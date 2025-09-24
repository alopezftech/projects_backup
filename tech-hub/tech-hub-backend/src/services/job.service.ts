// ---------------------------------------------------
// job.service.ts - Servicio para gestión de jobs asíncronos
//
// Implementa un sistema de jobs usando Worker Threads para evitar
// bloquear el hilo principal. Permite ejecutar procesos largos en paralelo.
// ---------------------------------------------------

import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { JobResponse, JobType, JobPriority, JobStatus } from '../shared/models/job.model.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Almacenamiento en memoria para jobs
export const jobs: Map<string, JobResponse> = new Map();
const activeWorkers: Map<string, Worker> = new Map();

export interface JobConfig {
  type: JobType;
  priority: JobPriority;
  parameters: any;
  userId?: string;
}

export class JobService {
  
  // Crear y ejecutar un job
  static async createJob(config: JobConfig): Promise<JobResponse> {
    const jobId = uuidv4();
    console.log('Params in createJob:', config.parameters);
    
    const job: JobResponse = {
      jobId,
      type: config.type,
      status: JobStatus.QUEUED,
      createdAt: new Date(),
      estimatedDuration: this.getEstimatedDuration(config.type),
      progress: 0,
      priority: config.priority,
      userId: config.userId ?? '0',
      payload: config.parameters.payload,
      url: config.parameters.headers.originalUrl + config.parameters.headers.endpointUrl,
      method: config.parameters.headers.method,
    };

    jobs.set(jobId, job);
    
    logger.info('Job created', { 
      jobId, 
      type: config.type, 
      priority: config.priority,
      userId: config.userId 
    });

    // Ejecutar el job en un worker thread
    setImmediate(() => {
      this.executeJob(jobId, config);
    });

    return job;
  }

  // Ejecutar job en worker thread
  private static async executeJob(jobId: string, config: JobConfig): Promise<void> {
    try {
      const job = jobs.get(jobId);
      if (!job) return;

      job.status = JobStatus.STARTED;
      jobs.set(jobId, job);

      // Crear worker thread
      const workerPath = join(__dirname, 'job.worker.js');
      const worker = new Worker(workerPath, {
        workerData: {
          jobId,
          type: config.type,
          parameters: config.parameters,
          userId: config.userId
        }
      });

      activeWorkers.set(jobId, worker);

      // Manejar mensajes del worker
      worker.on('message', (message) => {
        const currentJob = jobs.get(jobId);
        if (!currentJob) return;

        switch (message.type as JobStatus) {
  
          case JobStatus.IN_PROGRESS:
            currentJob.progress = message.progress;
            currentJob.status = JobStatus.IN_PROGRESS;
            jobs.set(jobId, currentJob);
            logger.info('Job progress updated. ', { message: message.message, jobId, progress: message.progress });
            break;

          case JobStatus.COMPLETED:
            currentJob.status = JobStatus.COMPLETED;
            currentJob.progress = 100;
            currentJob.completedAt = new Date();
            currentJob.resultUrl = message.resultUrl;
            jobs.set(jobId, currentJob);
            activeWorkers.delete(jobId);
            logger.info('Job completed', { jobId, resultUrl: message.resultUrl });
            break;

          case JobStatus.FAILED || 'error':
            currentJob.status = JobStatus.FAILED;
            currentJob.error = message.error;
            jobs.set(jobId, currentJob);
            activeWorkers.delete(jobId);
            logger.error('Job failed', { jobId, error: message.error });
            break;
        }
      });

      // Manejar errores del worker
      worker.on(JobStatus.FAILED || 'error', (error) => {
        const currentJob = jobs.get(jobId);
        if (currentJob) {
          currentJob.status = JobStatus.FAILED;
          currentJob.error = error.message;
          jobs.set(jobId, currentJob);
        }
        activeWorkers.delete(jobId);
        logger.error('Worker error', { jobId, error: error.message });
      });

      // Cleanup al terminar el worker
      worker.on('exit', (code) => {
        activeWorkers.delete(jobId);
        if (code !== 0) {
          logger.error('Worker stopped with exit code', { jobId, code });
        }
      });

    } catch (error) {
      const job = jobs.get(jobId);
      if (job) {
        job.status = JobStatus.FAILED;
        job.error = error instanceof Error ? error.message : 'Unknown error';
        jobs.set(jobId, job);
      }
      logger.error('Error executing job', { jobId, error });
    }
  }

  // Obtener job por ID
  static getJob(jobId: string): JobResponse | undefined {
    return jobs.get(jobId);
  }

  // Cancelar job
  static cancelJob(jobId: string): boolean {
    const job = jobs.get(jobId);
    if (!job) return false;

    if (job.status === JobStatus.COMPLETED || job.status === JobStatus.FAILED) {
      return false;
    }

    job.status = JobStatus.CANCELLED;
    jobs.set(jobId, job);

    // Terminar worker si está activo
    const worker = activeWorkers.get(jobId);
    if (worker) {
      worker.terminate();
      activeWorkers.delete(jobId);
    }

    logger.info('Job cancelled', { jobId });
    return true;
  }

  // Listar jobs con filtros
  static listJobs(options: {
    status?: string;
    limit?: number;
    offset?: number;
  } = {}): { jobs: JobResponse[]; total: number } {
    let filteredJobs = Array.from(jobs.values());

    if (options.status) {
      filteredJobs = filteredJobs.filter(job => job.status === options.status);
    }

    const total = filteredJobs.length;
    const limit = options.limit || 50;
    const offset = options.offset || 0;

    const paginatedJobs = filteredJobs
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);

    return { jobs: paginatedJobs, total };
  }

  // Estimar duración según tipo de job
  private static getEstimatedDuration(type: JobType): string {
    switch (type) {
      case 'report_generation':
        return '2-5 minutes';
      case 'data_processing':
        return '5-15 minutes';
      case 'ml_training':
        return '10-30 minutes';
      default:
        return '5 minutes';
    }
  }

  // Cleanup de jobs antiguos (opcional)
  static cleanupOldJobs(maxAgeHours: number = 24): void {
    const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
    
    for (const [jobId, job] of jobs.entries()) {
      if (job.createdAt < cutoffTime && 
          (job.status === JobStatus.COMPLETED || job.status === JobStatus.FAILED || job.status === JobStatus.CANCELLED)) {
        jobs.delete(jobId);
      }
    }
  }
}
