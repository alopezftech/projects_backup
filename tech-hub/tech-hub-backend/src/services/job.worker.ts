// ---------------------------------------------------
// job.worker.ts - Worker thread genérico para ejecutar jobs asíncronos
//
// Este worker se ejecuta en un thread separado para evitar bloquear
// el hilo principal del servidor. Delega el procesamiento a los
// procesadores específicos registrados por cada controller.
// ---------------------------------------------------

import { parentPort, workerData } from 'worker_threads';
import { JobStatus } from '../shared/models/job.model.js';

// Interfaz para los datos del worker
interface WorkerData {
  jobId: string;
  type: string;
  parameters: any;
  userId?: string;
}

// Función para reportar progreso
function reportProgress(progress: number, message?: string): void {
  if (parentPort) {
    parentPort.postMessage({
      type: JobStatus.IN_PROGRESS,
      progress,
      message
    });
  }
}

// Función para reportar completación
function reportCompleted(resultUrl?: string): void {
  if (parentPort) {
    parentPort.postMessage({
      type: JobStatus.COMPLETED,
      resultUrl
    });
  }
}

// Función para reportar error
function reportError(error: string): void {
  if (parentPort) {
    parentPort.postMessage({
      type: JobStatus.FAILED,
      error
    });
  }
}

// Procesador principal del worker
async function processJob(data: WorkerData): Promise<void> {
  try {
    const { jobKey } = data.parameters;
    
    if (!jobKey) {
      throw new Error('Missing jobKey in job parameters');
    }
    
    // Importar dinámicamente el JobManager para acceder a los procesadores
    const { JobManager } = await import('./job.manager.js');
    
    // Inicializar todos los controladores para asegurar que sus procesadores estén registrados
    const { initializeControllers } = await import('../controllers/module.controllers.js');
    await initializeControllers();
    
    // Buscar el procesador registrado
    const processor = JobManager.getProcessor(jobKey);
    
    if (!processor) {
      throw new Error(`No processor found for job key: ${jobKey}`);
    }

    reportProgress(10, `Iniciando procesamiento de ${processor.methodName}...`);

    // Preparar parámetros para el método del controlador
    const methodParameters = {
      ...data.parameters,
      reportProgress,
      reportCompleted,
      reportError,
      jobId: data.jobId,
      userId: data.userId
    };

    // Ejecutar el procesador usando JobManager
    await JobManager.executeProcessorDirect(jobKey, methodParameters);
    
    // El JobManager ya maneja el reporte de completación a través del mockRes.json()
    // No necesitamos reportar aquí para evitar duplicados

  } catch (error) {
    reportError(error instanceof Error ? error.message : 'Unknown error');
  }
}

// Ejecutar el procesamiento si estamos en el worker
if (workerData) {
  processJob(workerData as WorkerData).catch((error) => {
    reportError(error instanceof Error ? error.message : 'Worker execution failed');
  });
}
