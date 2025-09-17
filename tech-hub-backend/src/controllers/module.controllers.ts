// ---------------------------------------------------
// module.controllers.ts - Módulo centralizador de controladores
//
// Este archivo se encarga de importar y crear instancias de todos los 
// controladores para asegurar que sus procesadores de jobs estén 
// registrados correctamente en JobManager.
// ---------------------------------------------------

import { JobManager } from '../services/job.manager.js';
import { logger } from '../utils/logger.js';

/**
 * Función que inicializa todos los controladores del sistema.
 * Crea instancias de cada controlador para activar los decoradores @Job
 * y registrar los procesadores en JobManager.
 */
export async function initializeControllers(): Promise<void> {
  try {
    logger.info('Initializing controllers...');
    
    // Importar dinámicamente el array de controladores desde index.controller.ts
    const { controllers } = await import('./index.controller.js');
    
    // Crear instancias de todos los controladores para activar los decoradores @Job
    for (const ControllerClass of controllers) {
      new ControllerClass();
      logger.debug(`Initialized controller: ${ControllerClass.name}`);
    }
    
    // Importar otros controladores que no están en el array (sin decoradores @Job)
    await import('./job.controller.js');
    await import('./health.controller.js');
    
    // Obtener estadísticas de procesadores registrados
    const stats = JobManager.getProcessorStats();
    logger.info('Controllers initialized successfully', {
      totalProcessors: stats.total,
      processorsByType: stats.byType,
      initializedControllers: controllers.map(c => c.name)
    });
    
  } catch (error) {
    logger.error('Failed to initialize controllers', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

/**
 * Exportación por defecto para conveniencia
 */
export default {
  initializeControllers
};
