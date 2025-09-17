// ---------------------------------------------------
// logging.middleware.ts - Middleware de logging de peticiones HTTP
//
// Este archivo define el middleware que registra cada petición HTTP recibida por el backend.
// Permite medir el tiempo de respuesta, registrar el método, URL, código de estado, IP y user-agent.
// Facilita la trazabilidad, el monitoreo de performance y la auditoría de accesos.
// ---------------------------------------------------

// Importa los tipos de Express para definir el middleware
import { Request, Response, NextFunction } from 'express';
// Importa el logger para registrar la información de la petición
import { logger } from '../utils/logger.js';

// Define el middleware de logging de peticiones
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  // Marca el inicio de la petición para medir la duración
  const start = Date.now();
  
  // Cuando la respuesta termina, registra los detalles de la petición
  res.on('finish', () => {
    // Calcula la duración total de la petición
    const duration = Date.now() - start;
    // Loguea la información relevante de la petición y respuesta
    logger.info('HTTP Request', {
      method: req.method, // Método HTTP (GET, POST, etc.)
      url: req.url, // URL solicitada
      statusCode: res.statusCode, // Código de estado de la respuesta
      duration: `${duration}ms`, // Tiempo de respuesta
      userAgent: req.get('User-Agent'), // User-Agent del cliente
      ip: req.ip // IP del cliente
    });
  });
  
  // Continúa con el siguiente middleware
  next();
};
