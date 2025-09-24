// ============================================================================
// JOB DECORATOR - Sistema de decoradores para trabajos en segundo plano
// 
// Este archivo implementa el decorador @Job que permite convertir métodos de 
// controlador en procesadores de trabajos asíncronos. Cuando se usa @Job,
// el método puede ejecutarse tanto sincrónicamente (desde workers) como 
// asincrónicamente (creando jobs en cola) dependiendo del contexto de llamada.
// ============================================================================

// Importa reflect-metadata para habilitar el sistema de metadatos
import 'reflect-metadata';

// Importa tipos de Express para manejar requests, responses y middleware
import { Request, Response, NextFunction } from 'express';

// Importa servicios necesarios para la gestión de trabajos
import { JobService } from '../services/job.service.js';     // Crear y gestionar jobs
import { JobManager } from '../services/job.manager.js';    // Registrar procesadores
import { JobType, JobPriority } from '../shared/models/job.model.js'; // Enums para configuración

// Importa el logger para trazabilidad y debugging
import { logger } from '../utils/logger.js';

// Crea un Symbol único para identificar metadatos de jobs
// Evita colisiones con otras propiedades de metadata
const JOB_METADATA = Symbol('job');

// Define la interfaz para opciones del decorador @Job
// Especifica qué configuraciones se pueden pasar al decorador
export interface JobOptions {
  type?: JobType;       // Tipo de trabajo (DATA_PROCESSING, EMAIL_PROCESSING, etc.)
  priority?: JobPriority; // Prioridad del trabajo (LOW, NORMAL, HIGH, URGENT)
}

// Función principal del decorador @Job que acepta opciones de configuración
// Retorna un decorador que puede ser aplicado a métodos de clase
export function Job(options: JobOptions = {}) {
  
  // Función decorador que recibe los metadatos del método siendo decorado
  // target: instancia de la clase que contiene el método
  // propertyKey: nombre del método siendo decorado
  // descriptor: descriptor del método (contiene la función original)
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    
    // Guarda referencia al método original antes de modificarlo
    // Necesario para ejecutar la lógica original cuando sea requerido
    const originalMethod = descriptor.value;
    
    // Define función para registrar automáticamente el procesador en JobManager
    // Se ejecutará cuando se cree una instancia de la clase contenedora
    const registerProcessor = (_instance: any) => {
      
      // Crea una clave única para identificar este procesador
      // Formato: "NombreClase.nombreMetodo" (ej: "ProductController.createProduct")
      const jobKey = `${target.constructor.name}.${propertyKey}`;
      
      // Registra el método original como procesador en JobManager
      // JobManager lo usará para ejecutar jobs de este tipo
      JobManager.registerProcessor(
        jobKey,           // Identificador único del procesador
        originalMethod,   // Función original a ejecutar
        options          // Opciones de configuración (type, priority)
      );
    };
    
    // Inicializa array de registros de jobs en el constructor si no existe
    // Permite que múltiples métodos @Job se registren en la misma clase
    if (!target.constructor._jobRegistrations) {
      target.constructor._jobRegistrations = [];
    }
    
    // Agrega la función de registro al array para ejecución posterior
    // Se ejecutará cuando se instancie la clase
    target.constructor._jobRegistrations.push(registerProcessor);
    
    // Reemplaza el método original con una versión "inteligente" que decide
    // si ejecutar sincrónicamente o crear un job asíncrono
    descriptor.value = async function (...args: any[]) {
      
      // Identifica objetos Request, Response y NextFunction de los argumentos
      // Busca objetos con propiedades específicas de Express
      const req = args.find(arg => arg && arg.method && arg.url) as Request;
      const res = args.find(arg => arg && arg.status && arg.json) as Response;
      const next = args.find(arg => typeof arg === 'function') as NextFunction;
      
      // Detecta si la llamada proviene de un worker thread
      // Workers marcan requests con header especial para evitar bucles infinitos
      const isWorkerExecution = req && req.headers && req.headers['x-worker-execution'];
      
      // RAMA 1: Llamada HTTP normal (no desde worker) - Crear job asíncrono
      if (req && res && !isWorkerExecution) {
        try {
          
          // Regenera la clave del job para consistencia
          const jobKey = `${target.constructor.name}.${propertyKey}`;
          
          // Construye configuración completa del job
          const jobConfig = {
            type: options.type || JobType.DATA_PROCESSING,        // Tipo por defecto
            priority: options.priority || JobPriority.NORMAL,     // Prioridad por defecto
            parameters: {
              jobKey,                    // Identificador del procesador
              methodName: propertyKey,   // Nombre del método original
              payload: req.body,         // Datos del cuerpo de la petición
              headers: {                 // Headers completos con metadata adicional
                ...req.headers, 
                originalUrl: req.originalUrl, 
                method: req.method, 
                endpointUrl: req.url 
              },
              query: req.query,          // Parámetros de query string
              params: req.params,        // Parámetros de ruta
              timestamp: new Date().toISOString(), // Timestamp de creación
              userId: req.user?.userId   // ID del usuario si está autenticado
            }
          };

          // Crea el job en la cola de procesamiento
          const job = await JobService.createJob(jobConfig);
          
          // Log informativo sobre la creación del job
          logger.info('Async job created via decorator', {
            jobId: job.jobId,
            jobKey,
            methodName: propertyKey,
            userId: req.user?.userId
          });

          // Retorna respuesta HTTP 202 (Accepted) indicando procesamiento asíncrono
          // Cliente debe usar jobId para consultar progreso
          return res.status(202).json({
            success: true,
            data: job,
            message: `Proceso ${propertyKey} iniciado. Use el jobId para consultar el progreso.`
          });
          
        } catch (error) {
          // Maneja errores durante creación del job
          if (next) next(error);
        }
        
      } else {
        // RAMA 2: Ejecución directa (desde worker o llamada no-HTTP)
        
        // Log para trazabilidad de ejecuciones directas
        if (req) {
          logger.info('Method execution (worker or direct)', {
            methodName: propertyKey,
            userId: req.user?.userId,
            timestamp: new Date().toISOString(),
            payload: req.body,
            query: req.query,
            params: req.params,
            isWorkerExecution
          });
        }
        
        // Ejecuta el método original con todos los argumentos
        // Mantiene el contexto 'this' original
        return originalMethod.apply(this, args);
      }
    };

    // Almacena referencia al método original en la función modificada
    // JobManager lo necesita para ejecutar la lógica real
    (descriptor.value as any)._originalMethod = originalMethod;

    // Guarda metadata del job en el sistema de reflection
    // Permite introspección posterior del método decorado
    Reflect.defineMetadata(JOB_METADATA, {
      methodName: propertyKey,  // Nombre del método
      ...options               // Opciones del decorador (type, priority)
    }, target.constructor, propertyKey);
  };
}

// Función utilitaria para recuperar metadata de jobs de un método específico
// target: clase que contiene el método
// propertyKey: nombre del método del cual obtener metadata
// Retorna: objeto con metadata del job o undefined si no existe
export function getJobMetadata(target: any, propertyKey: string) {
  // Recupera metadata almacenada para el método específico
  return Reflect.getMetadata(JOB_METADATA, target, propertyKey);
}