// ---------------------------------------------------
// error.middleware.ts - Middleware de manejo de errores global
//
// Este archivo define el middleware centralizado para capturar, loguear y responder
// a los errores que ocurren en la aplicación Express. Permite devolver respuestas
// estructuradas y seguras, diferenciando entre errores operacionales y de validación,
// y mostrando el stack sólo en desarrollo. Facilita la trazabilidad y el monitoreo.
// ---------------------------------------------------

// Importa los tipos de Express para definir el handler de errores
import { Request, Response, NextFunction } from 'express';
// Importa el logger para registrar los errores
import { logger } from '../utils/logger.js';
import { ZodError } from 'zod';

// Define la interfaz extendida para errores personalizados
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Array en memoria para registrar todos los errores capturados
// TODO: almacenar en base de datos o sistema de logging externo
const errors: {
  message?: string;
  stack?: string | undefined;
  ruta: string;
  metodo: string;
  fecha: string;
  status: number;
}[] = [];

// Set para evitar errores duplicados (se limpia cada 5 minutos)
const processedErrors = new Set<string>();
setInterval(() => {
  processedErrors.clear();
  logger.info('Error deduplication cache cleared');
}, 5 * 60 * 1000);

// Función para crear un hash único del error
function createErrorHash(err: Error, req?: Request | null): string {
  const stackLine = err.stack?.split('\n')[1] || '';
  const route = req?.originalUrl || 'global';
  const message = err.message;
  const timestamp = Math.floor(Date.now() / 1000); // Agrupar por segundo
  
  return `${message}-${route}-${stackLine}-${timestamp}`;
}

// Middleware de manejo de errores
export const errorHandler = (
  err: Error | AppError,
  req?: Request | null,
  res?: Response | null,
  _next?: NextFunction
): void => {
  try {
    // Crear hash único para detectar duplicados
    const errorHash = createErrorHash(err, req);
    
    // Si ya procesamos este error recientemente, no lo registremos de nuevo
    if (processedErrors.has(errorHash)) {
      console.log('Duplicate error detected, skipping registration');
      if (res && !res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
      return;
    }
    
    // Marcar error como procesado
    processedErrors.add(errorHash);

    // Determinar el código de estado según el tipo de error
    let statusCode = 500; // Por defecto
    
    if (err instanceof AppError) {
      statusCode = err.statusCode;
    } else if (err.name === 'ZodError') {
      statusCode = 400; // Bad Request para errores de validación
    }

    logger.error('Error capturado', {
      message: err.message,
      stack: err.stack,
      ruta: req ? req.originalUrl : 'N/A (global error)',
      metodo: req ? req.method : 'N/A',
      fecha: new Date().toISOString(),
      statusCode,
      errorHash, // Para debugging
    });

    errors.push({
      message: err.message,
      stack: err.stack,
      ruta: req ? req.originalUrl : 'N/A (global error)',
      metodo: req ? req.method : 'N/A',
      fecha: new Date().toISOString(),
      status: statusCode,
    });
    
    // Formatear el error según su tipo
    let formattedError: any = {
      message: err.message
    };

    // Manejo específico para errores de Zod
    if (err.name === 'ZodError') {
      const zodError = err as ZodError; // ZodError

      formattedError = {
        message: 'Error de validación',
        errors: (zodError.issues).map((error: any) => ({
          field: error.path?.join('.') || 'unknown',
          message: error.message || 'Validation error',
          code: error.code || 'validation_error',
          ...(error.expected && { expected: error.expected }),
          ...(error.received && { received: error.received }),
          ...(error.values && { validOptions: error.values })
        }))
      };
    }
    // Manejo para errores personalizados (AppError)
    else if (err instanceof AppError) {
      formattedError = {
        message: err.message,
        statusCode: err.statusCode,
        error: 'AppError'
      };
    }
    // Otros tipos de errores
    else {
      // En desarrollo, incluir stack trace
      if (process.env.NODE_ENV === 'development') {
        formattedError.stack = err.stack;
      }
    }

    if (res && !res.headersSent) {
      res.status(statusCode).json({
        success: false,
        ...formattedError
      });
    }
    
  } catch (middlewareError) {
    // Si hay un error en el middleware mismo, manejarlo de forma segura
    console.error('Error en el middleware de errores:', middlewareError);
    
    // Registrar el error del middleware
    errors.push({
      message: `Middleware Error: ${middlewareError instanceof Error ? middlewareError.message : 'Unknown'}`,
      stack: middlewareError instanceof Error ? middlewareError.stack : undefined,
      ruta: req ? req.originalUrl : 'N/A (middleware error)',
      metodo: req ? req.method : 'N/A',
      fecha: new Date().toISOString(),
      status: 500,
    });
    
    logger.error('Error en middleware de errores', {
      originalError: err.message,
      middlewareError: middlewareError instanceof Error ? middlewareError.message : 'Unknown',
      stack: middlewareError instanceof Error ? middlewareError.stack : undefined
    });
    
    // Respuesta de emergencia
    if (res && !res.headersSent) {
      res.status(500).json({
        success: false,
        message: middlewareError instanceof Error ? middlewareError.message : 'Unknown Error.Middleware error',
        error: 'Internal server error'
      });
    }
  }
};

export const getLoggedErrors = () => errors;