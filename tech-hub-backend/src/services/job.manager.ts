// ---------------------------------------------------
// job.manager.ts - Gestor centralizado de procesadores de jobs
//
// Maneja el registro automático de procesadores desde decoradores @Job
// y proporciona resolución de métodos para el JobWorker.
// ---------------------------------------------------

import 'reflect-metadata';
import { JobOptions } from '../decorators/job.decorator.js';
import { logger } from '../utils/logger.js';

export interface ProcessorInfo {
  target: any;
  methodName: string;
  metadata: JobOptions;
  processor?: Function; // La función real que procesará el job
}

export class JobManager {
  private static processorMap: Map<string, ProcessorInfo> = new Map();
  private static controllerInstances: Map<string, any> = new Map();

  /**
   * Registra un procesador desde un decorador @Job
   */
  static registerFromDecorator(
    target: any, 
    methodName: string, 
    metadata: JobOptions,
    processor?: Function
  ): void {
    const key = `${target.constructor.name}.${methodName}`;
    
    this.processorMap.set(key, {
      target: target.constructor,
      methodName,
      metadata,
      ...(processor && { processor })
    });

    logger.info('Job processor registered from decorator', {
      key,
      methodName,
      type: metadata.type,
      priority: metadata.priority
    });
  }

  /**
   * Registra un procesador específico para jobs
   */
  static registerProcessor(
    key: string,
    processor: Function,
    metadata: JobOptions
  ): void {
    const existingProcessor = this.processorMap.get(key);
    
    if (existingProcessor) {
      // Actualizar el procesador existente
      existingProcessor.processor = processor;
      existingProcessor.metadata = { ...existingProcessor.metadata, ...metadata };
    } else {
      // Crear nuevo registro
      this.processorMap.set(key, {
        target: null,
        methodName: key.split('.').pop() || '',
        metadata,
        processor
      });
    }

    logger.info('Job processor registered', {
      key,
      type: metadata.type,
      priority: metadata.priority
    });
  }

  /**
   * Obtiene información de un procesador registrado
   */
  static getProcessor(key: string): ProcessorInfo | undefined {
    return this.processorMap.get(key);
  }

  /**
   * Obtiene la instancia del controlador para ejecutar el método
   */
  static getControllerInstance(controllerName: string): any {
    return this.controllerInstances.get(controllerName);
  }

  /**
   * Registra una instancia de controlador
   */
  static registerControllerInstance(controllerName: string, instance: any): void {
    this.controllerInstances.set(controllerName, instance);
    logger.debug('Controller instance registered', { controllerName });
  }

  /**
   * Ejecuta un procesador de job directamente
   * Para jobs asíncronos, esto ejecuta el método original del controlador
   * con un contexto simulado
   */
  static async executeProcessorDirect(
    key: string, 
    parameters: any
  ): Promise<any> {
    const processorInfo = this.getProcessor(key);
    
    if (!processorInfo) {
      throw new Error(`Job processor not found: ${key}`);
    }

    const parts = key.split('.');
    if (parts.length < 2) {
      throw new Error(`Invalid job key format: ${key}`);
    }
    
    const controllerName = parts[0]!;
    const methodName = parts[1]!;
    
    const instance = this.getControllerInstance(controllerName);
    
    if (!instance) {
      throw new Error(`Controller instance not found: ${controllerName}`);
    }
    parameters.reportProgress(20, `Executing job processor ${methodName} - controller: ${controllerName}`);

    // Obtener el método original sin decorador del prototipo
    const originalMethod = this.getOriginalMethod(instance, methodName);
    
    if (!originalMethod) {
      throw new Error(`Original method ${methodName} not found in ${controllerName}`);
    }
    const originalUrl = parameters.originalUrl + parameters.endpointUrl;
    // Crear objetos mock para simular el contexto HTTP
    const mockReq = {
      body: parameters.payload || {},
      query: parameters.query || {},
      params: parameters.params || {},
      user: parameters.userId ? { userId: parameters.userId } : undefined,
      method: parameters.method || undefined,
      url: originalUrl || undefined,
      headers: { 'x-worker-execution': 'true' }
    };

    const mockRes = {
      status: (_code: number) => mockRes,
      json: (data: any) => {
        // En lugar de enviar respuesta HTTP, reportar progreso/resultado
        if (parameters.reportCompleted) {
          parameters.reportCompleted(JSON.stringify(data));
        }
        return data;
      }
    };

    const mockNext = (error?: any) => {
      if (error) {
        if (parameters.reportError) {
          parameters.reportError(error.message || error);
        }
        throw error;
      }
    };

    // Ejecutar el método original
    return await originalMethod.call(instance, mockReq, mockRes, mockNext);
  }

  /**
   * Obtiene el método original sin decorador
   */
  private static getOriginalMethod(instance: any, methodName: string): Function | null {
    // Buscar en la cadena de prototipos hasta encontrar el método original
    let current = instance.constructor.prototype;
    
    while (current) {
      const descriptor = Object.getOwnPropertyDescriptor(current, methodName);
      if (descriptor && typeof descriptor.value === 'function') {
        // Verificar si tiene metadatos de ser un método original guardado
        const originalMethod = (descriptor.value as any)._originalMethod;
        return originalMethod || descriptor.value;
      }
      current = Object.getPrototypeOf(current);
    }
    
    return null;
  }

  /**
   * Lista todos los procesadores registrados
   */
  static getRegisteredProcessors(): string[] {
    return Array.from(this.processorMap.keys());
  }

  /**
   * Obtiene estadísticas de los procesadores registrados
   * Todos los procesadores son asíncronos por defecto
   */
  static getProcessorStats(): {
    total: number;
    byType: Record<string, number>;
  } {
    const processors = Array.from(this.processorMap.values());
    
    return {
      total: processors.length,
      byType: processors.reduce((acc, p) => {
        const type = p.metadata.type?.toString() || 'unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  /**
   * Limpia todos los procesadores registrados (útil para testing)
   */
  static clear(): void {
    this.processorMap.clear();
    this.controllerInstances.clear();
    logger.debug('JobManager cleared');
  }
}