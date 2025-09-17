# Guía Completa de Extracción del Sistema de Jobs TechHub - Todas las Fases

Basándome en el JobsGuide.md y el enfoque manual, aquí tienes la guía completa de todas las fases para extraer el sistema de jobs y crear una librería + CLI reutilizable.

---

## Índice de Fases

1. Fase 1: Análisis y Extracción Manual
2. Fase 2: Creación de la Librería Core
3. Fase 3: Desarrollo de la CLI
4. Fase 4: Middleware y Extensibilidad
5. Fase 5: Templates y Generación de Código
6. Fase 6: Testing y Validación
7. Fase 7: Documentación y Ejemplos
8. Fase 8: Publicación y Distribution

---

# Fase 1: Análisis y Extracción Manual

## Objetivo
Extraer manualmente toda la lógica del sistema de jobs del proyecto TechHub original y crear la base de la nueva librería.

## Paso 1.1: Preparar Workspace

### Crear estructura básica

```bash
mkdir tech-hub-jobs-workspace
cd tech-hub-jobs-workspace

# Estructura principal
mkdir -p packages/jobs-core/{src,tests}
mkdir -p packages/jobs-cli/{src,tests,templates}
mkdir -p examples/{basic,advanced,production}
mkdir -p docs
```

### Configurar workspace root

````json
{
  "name": "tech-hub-jobs-workspace",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "packages/*",
    "examples/*"
  ],
  "scripts": {
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces",
    "dev:core": "npm run dev --workspace=@techhub/jobs",
    "dev:cli": "npm run dev --workspace=techhub-jobs-cli"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "vitest": "^1.0.0",
    "tsx": "^4.0.0"
  }
}
````

## Paso 1.2: Extraer JobService Completo

### Abrir archivo original y copiar

**Desde**: `tech-hub-backend/src/services/job.service.ts`  
**Hacia**: `packages/jobs-core/src/services/JobService.ts`

### Modificar paso a paso

````typescript
// 1. ELIMINAR IMPORTS ESPECÍFICOS DEL PROYECTO
// ❌ QUITAR:
// import { UserService } from './user.service.js';
// import { ProductService } from './product.service.js';

// ✅ MANTENER SOLO:
import { Worker } from 'worker_threads';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

// 2. AGREGAR IMPORTS DE TIPOS
import type { 
  JobConfig, 
  JobStatus, 
  JobPriority,
  JobData, 
  JobsLibraryConfig,
  JobProcessor,
  JobContext 
} from '../types/index.js';

// 3. DEFINIR SCHEMAS ZOD PARA VALIDACIÓN
const JobConfigSchema = z.object({
  type: z.string().min(1, 'Tipo de job requerido'),
  priority: z.enum(['high', 'normal', 'low']).default('normal'),
  subType: z.string().min(1, 'SubType es requerido'),
  payload: z.any(),
  estimatedDuration: z.string().optional(),
  userId: z.string().optional()
});

const JobsConfigSchema = z.object({
  enableLogging: z.boolean().default(true),
  maxConcurrentJobs: z.number().int().min(1).max(50).default(10),
  workerPath: z.string().optional(),
  defaultPriority: z.enum(['high', 'normal', 'low']).default('normal'),
  validatePayload: z.boolean().default(true),
  workerTimeout: z.number().int().min(1000).default(300000) // 5 minutos
});

// 4. COPIAR CLASE JobService CON MODIFICACIONES
export class JobService {
  private static instance: JobService;
  private jobs: Map<string, JobData> = new Map();
  private config: JobsLibraryConfig;
  private activeWorkers: Map<string, Worker> = new Map();

  constructor(config: Partial<JobsLibraryConfig> = {}) {
    // Validar config con Zod
    this.config = JobsConfigSchema.parse(config);
    
    if (this.config.enableLogging) {
      console.log('JobService initialized with config:', this.config);
    }
  }

  // 5. SINGLETON PATTERN
  static getInstance(config?: Partial<JobsLibraryConfig>): JobService {
    if (!JobService.instance) {
      JobService.instance = new JobService(config);
    }
    return JobService.instance;
  }

  // 6. MÉTODO createJob CON VALIDACIÓN ZOD
  async createJob(config: unknown): Promise<string> {
    try {
      // Validar configuración con Zod
      const validatedConfig = JobConfigSchema.parse(config);
      
      const jobId = this.generateJobId();
      
      const job: JobData = {
        jobId,
        status: 'queued' as JobStatus,
        type: validatedConfig.type,
        subType: validatedConfig.subType,
        priority: validatedConfig.priority,
        payload: validatedConfig.payload,
        progress: 0,
        createdAt: new Date(),
        estimatedDuration: validatedConfig.estimatedDuration,
        userId: validatedConfig.userId
      };

      // Almacenar job
      this.jobs.set(jobId, job);
      
      if (this.config.enableLogging) {
        console.log(`Job created: ${jobId} - Type: ${job.type}/${job.subType}`);
      }
      
      // Ejecutar en worker thread
      this.executeJobInWorker(job);
      
      return jobId;
      
    } catch (error) {
      if (this.config.enableLogging) {
        console.error('Error creating job:', error);
      }
      throw error;
    }
  }

  // 7. COPIAR MÉTODOS EXISTENTES (getJob, cancelJob, etc.)
  getJob(jobId: string): JobData | null {
    return this.jobs.get(jobId) || null;
  }

  cancelJob(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job) return false;

    if (['completed', 'failed', 'cancelled'].includes(job.status)) {
      return false; // Ya terminado
    }

    job.status = 'cancelled';
    job.completedAt = new Date();
    
    // Terminar worker si existe
    const worker = this.activeWorkers.get(jobId);
    if (worker) {
      try {
        worker.terminate();
        this.activeWorkers.delete(jobId);
      } catch (error) {
        console.error(`Error terminating worker for job ${jobId}:`, error);
      }
    }
    
    if (this.config.enableLogging) {
      console.log(`Job cancelled: ${jobId}`);
    }
    
    return true;
  }

  // 8. NUEVO MÉTODO listJobs CON FILTROS
  listJobs(filters: {
    status?: JobStatus;
    type?: string;
    userId?: string;
    limit?: number;
    offset?: number;
    dateFrom?: Date;
    dateTo?: Date;
  } = {}): { jobs: JobData[]; total: number } {
    let filteredJobs = Array.from(this.jobs.values());
    
    // Aplicar filtros
    if (filters.status) {
      filteredJobs = filteredJobs.filter(job => job.status === filters.status);
    }
    
    if (filters.type) {
      filteredJobs = filteredJobs.filter(job => job.type === filters.type);
    }
    
    if (filters.userId) {
      filteredJobs = filteredJobs.filter(job => job.userId === filters.userId);
    }
    
    if (filters.dateFrom) {
      filteredJobs = filteredJobs.filter(job => job.createdAt >= filters.dateFrom!);
    }
    
    if (filters.dateTo) {
      filteredJobs = filteredJobs.filter(job => job.createdAt <= filters.dateTo!);
    }
    
    // Ordenar por fecha de creación (más recientes primero)
    filteredJobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    const total = filteredJobs.length;
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;
    
    const paginatedJobs = filteredJobs.slice(offset, offset + limit);
    
    return { jobs: paginatedJobs, total };
  }

  // 9. MÉTODOS INTERNOS
  private generateJobId(): string {
    return uuidv4();
  }

  private executeJobInWorker(job: JobData): void {
    // Determinar path del worker
    const workerPath = this.config.workerPath || 
      new URL('../workers/GenericWorker.js', import.meta.url).pathname;
    
    try {
      const worker = new Worker(workerPath, {
        workerData: job
      });

      // Almacenar referencia al worker
      this.activeWorkers.set(job.jobId, worker);

      // Configurar timeout
      const timeout = setTimeout(() => {
        worker.terminate();
        this.handleWorkerError(job.jobId, new Error('Worker timeout'));
      }, this.config.workerTimeout);

      worker.on('message', (message) => {
        this.handleWorkerMessage(job.jobId, message);
        
        // Si el job terminó, limpiar timeout y worker
        if (['completed', 'failed'].includes(message.type)) {
          clearTimeout(timeout);
          this.activeWorkers.delete(job.jobId);
        }
      });

      worker.on('error', (error) => {
        clearTimeout(timeout);
        this.activeWorkers.delete(job.jobId);
        this.handleWorkerError(job.jobId, error);
      });

      worker.on('exit', (code) => {
        clearTimeout(timeout);
        this.activeWorkers.delete(job.jobId);
        
        if (code !== 0) {
          this.handleWorkerError(job.jobId, new Error(`Worker stopped with exit code ${code}`));
        }
      });

    } catch (error) {
      this.handleWorkerError(job.jobId, error as Error);
    }
  }

  private handleWorkerMessage(jobId: string, message: any): void {
    const job = this.jobs.get(jobId);
    if (!job) return;

    const previousStatus = job.status;

    switch (message.type) {
      case 'progress':
        job.progress = Math.max(0, Math.min(100, message.data.progress));
        job.status = 'progress';
        if (message.data.message) {
          job.currentMessage = message.data.message;
        }
        break;

      case 'completed':
        job.status = 'completed';
        job.progress = 100;
        job.completedAt = new Date();
        if (message.data.resultUrl) {
          job.resultUrl = message.data.resultUrl;
        }
        delete job.currentMessage;
        break;

      case 'error':
        job.status = 'failed';
        job.completedAt = new Date();
        job.error = message.data.error;
        delete job.currentMessage;
        break;
    }

    // Log cambios de estado importantes
    if (this.config.enableLogging && previousStatus !== job.status) {
      console.log(`Job ${jobId}: ${previousStatus} → ${job.status}`, {
        progress: job.progress,
        message: job.currentMessage || job.error
      });
    }
  }

  private handleWorkerError(jobId: string, error: Error): void {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = 'failed';
    job.completedAt = new Date();
    job.error = error.message;
    delete job.currentMessage;

    if (this.config.enableLogging) {
      console.error(`Job ${jobId} failed:`, error.message);
    }
  }

  // 10. MÉTODOS PARA ESTADÍSTICAS Y MONITOREO
  getStats(): {
    total: number;
    byStatus: Record<JobStatus, number>;
    byType: Record<string, number>;
    activeWorkers: number;
  } {
    const jobs = Array.from(this.jobs.values());
    
    const byStatus = jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {} as Record<JobStatus, number>);
    
    const byType = jobs.reduce((acc, job) => {
      acc[job.type] = (acc[job.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: jobs.length,
      byStatus,
      byType,
      activeWorkers: this.activeWorkers.size
    };
  }

  // 11. LIMPIEZA DE JOBS ANTIGUOS
  cleanupOldJobs(olderThanHours: number = 24): number {
    const cutoffDate = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
    let cleaned = 0;
    
    for (const [jobId, job] of this.jobs.entries()) {
      if (job.completedAt && job.completedAt < cutoffDate) {
        this.jobs.delete(jobId);
        cleaned++;
      }
    }
    
    if (this.config.enableLogging && cleaned > 0) {
      console.log(`Cleaned up ${cleaned} old jobs`);
    }
    
    return cleaned;
  }

  // 12. EXPORTAR SCHEMAS PARA USO EXTERNO
  static readonly schemas = {
    JobConfig: JobConfigSchema,
    JobsConfig: JobsConfigSchema
  };
}

// 13. EXPORTAR TIPOS
export type { JobConfig, JobStatus, JobPriority, JobData, JobsLibraryConfig };
````

## Paso 1.3: Crear Tipos Completos

````typescript
// TIPOS PRINCIPALES
export type JobStatus = 'queued' | 'started' | 'progress' | 'completed' | 'failed' | 'cancelled';

export type JobPriority = 'high' | 'normal' | 'low';

export type JobType = string; // Flexible para cualquier tipo de job

// INTERFACES CORE
export interface JobConfig {
  type: JobType;
  priority: JobPriority;
  subType: string;
  payload: any;
  estimatedDuration?: string;
  userId?: string;
}

export interface JobData {
  jobId: string;
  status: JobStatus;
  type: JobType;
  subType: string;
  priority: JobPriority;
  payload: any;
  progress: number;
  createdAt: Date;
  completedAt?: Date;
  estimatedDuration?: string;
  userId?: string;
  resultUrl?: string;
  error?: string;
  currentMessage?: string;
}

export interface JobsLibraryConfig {
  enableLogging: boolean;
  maxConcurrentJobs: number;
  workerPath?: string;
  defaultPriority: JobPriority;
  validatePayload: boolean;
  workerTimeout: number;
}

// INTERFACES PARA PROCESADORES
export interface JobContext {
  jobId: string;
  userId?: string;
  reportProgress: (progress: number, message?: string) => void;
  reportCompleted: (resultUrl?: string) => void;
  reportError: (error: string) => void;
}

export interface JobProcessor<T = any> {
  (payload: T, context: JobContext): Promise<void>;
}

export interface ProcessorConfig {
  name?: string;
  description?: string;
  estimatedDuration?: string;
  priority?: JobPriority;
  concurrent?: boolean;
  timeout?: number;
}

export interface ProcessorInfo {
  processor: JobProcessor;
  config: ProcessorConfig;
  schema?: any; // Zod schema
}

// INTERFACES PARA MIDDLEWARE Y PLUGINS
export interface AuthenticationConfig {
  required: boolean;
  validate: (req: any) => Promise<{ valid: boolean; user?: any; message?: string }>;
}

export interface AuthorizationConfig {
  required: boolean;
  validate: (req: any, jobConfig: JobConfig) => Promise<{ valid: boolean; message?: string }>;
}

export interface PluginConfig {
  authentication?: AuthenticationConfig;
  authorization?: AuthorizationConfig;
  storage?: StorageConfig;
  notifications?: NotificationConfig;
}

export interface StorageConfig {
  saveResult?: (jobId: string, result: any) => Promise<string>;
  loadResult?: (resultUrl: string) => Promise<any>;
}

export interface NotificationConfig {
  onJobComplete?: (jobId: string, userId?: string, result?: any) => Promise<void>;
  onJobError?: (jobId: string, userId?: string, error: Error) => Promise<void>;
}

// TIPOS PARA RESPONSES DE API
export interface JobResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

export interface JobListResponse extends JobResponse {
  data: JobData[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface JobStatsResponse extends JobResponse {
  data: {
    total: number;
    byStatus: Record<JobStatus, number>;
    byType: Record<string, number>;
    activeWorkers: number;
  };
}

// TIPOS PARA WORKER COMMUNICATION
export interface WorkerMessage {
  type: 'progress' | 'completed' | 'error';
  jobId: string;
  data: any;
}

export interface ProgressMessage extends WorkerMessage {
  type: 'progress';
  data: {
    progress: number;
    message?: string;
  };
}

export interface CompletedMessage extends WorkerMessage {
  type: 'completed';
  data: {
    resultUrl?: string;
  };
}

export interface ErrorMessage extends WorkerMessage {
  type: 'error';
  data: {
    error: string;
  };
}
````

## Paso 1.4: Extraer BaseController

### Copiar y modificar BaseController

````typescript
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { JobService } from '../services/JobService.js';
import type { 
  JobConfig, 
  JobProcessor, 
  ProcessorConfig, 
  JobContext,
  ProcessorInfo,
  PluginConfig 
} from '../types/index.js';

// REGISTRO DE PROCESADORES
export class BaseController {
  protected static jobService: JobService;
  protected static processors: Map<string, ProcessorInfo> = new Map();
  protected static pluginConfig: PluginConfig = {};

  // INICIALIZACIÓN
  static initialize(jobService?: JobService, pluginConfig?: PluginConfig): void {
    this.jobService = jobService || JobService.getInstance();
    this.pluginConfig = { ...this.pluginConfig, ...pluginConfig };
    
    console.log('BaseController initialized with', this.processors.size, 'processors');
  }

  // REGISTRO DE PROCESADORES CON VALIDACIÓN ZOD
  static registerJobProcessor<T = any>(
    key: string,
    processor: JobProcessor<T>,
    schema?: z.ZodSchema<T>,
    config: ProcessorConfig = {}
  ): void {
    // Validar key
    if (!key || typeof key !== 'string' || key.trim() === '') {
      throw new Error('ProcessorKey debe ser un string válido no vacío');
    }

    // Validar que no exista ya
    if (this.processors.has(key)) {
      console.warn(`⚠️  Procesador '${key}' ya existe. Será sobrescrito.`);
    }

    // Crear wrapper con validación automática
    const wrappedProcessor: JobProcessor = async (payload: unknown, context: JobContext) => {
      const startTime = Date.now();
      
      try {
        // Validar payload si hay schema
        let validatedPayload = payload;
        if (schema) {
          try {
            validatedPayload = schema.parse(payload);
          } catch (error) {
            throw new Error(`Validación de payload falló: ${error.message}`);
          }
        }

        // Ejecutar procesador original
        await processor(validatedPayload as T, context);
        
        const duration = Date.now() - startTime;
        console.log(`✅ Procesador '${key}' completado en ${duration}ms`);
        
      } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`❌ Procesador '${key}' falló después de ${duration}ms:`, error.message);
        throw error;
      }
    };

    // Registrar procesador
    this.processors.set(key, {
      processor: wrappedProcessor,
      config: {
        name: config.name || key,
        description: config.description,
        estimatedDuration: config.estimatedDuration,
        priority: config.priority || 'normal',
        concurrent: config.concurrent ?? true,
        timeout: config.timeout || 300000 // 5 minutos por defecto
      },
      schema
    });

    console.log(`📝 Procesador '${key}' registrado exitosamente`);
  }

  // OBTENER PROCESADOR
  static getProcessor(key: string): JobProcessor | undefined {
    const processorInfo = this.processors.get(key);
    return processorInfo?.processor;
  }

  static getProcessorInfo(key: string): ProcessorInfo | undefined {
    return this.processors.get(key);
  }

  static getRegisteredProcessors(): string[] {
    return Array.from(this.processors.keys());
  }

  static getAllProcessorsInfo(): Record<string, ProcessorConfig> {
    const result: Record<string, ProcessorConfig> = {};
    for (const [key, info] of this.processors.entries()) {
      result[key] = info.config;
    }
    return result;
  }

  // CREAR JOB ASÍNCRONO CON VALIDACIONES Y PLUGINS
  protected async createAsyncJob(
    config: JobConfig,
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // 1. Verificar que el procesador existe
      if (!BaseController.processors.has(config.subType)) {
        return res.status(400).json({
          success: false,
          error: `Procesador '${config.subType}' no encontrado`,
          availableProcessors: BaseController.getRegisteredProcessors()
        });
      }

      // 2. Autenticación (si está configurada)
      if (BaseController.pluginConfig.authentication?.required) {
        const authResult = await BaseController.pluginConfig.authentication.validate(req);
        if (!authResult.valid) {
          return res.status(401).json({
            success: false,
            error: authResult.message || 'Autenticación falló'
          });
        }
        
        // Agregar usuario autenticado al request
        if (authResult.user) {
          req.user = authResult.user;
        }
      }

      // 3. Autorización (si está configurada)
      if (BaseController.pluginConfig.authorization?.required) {
        const authzResult = await BaseController.pluginConfig.authorization.validate(req, config);
        if (!authzResult.valid) {
          return res.status(403).json({
            success: false,
            error: authzResult.message || 'Sin permisos para ejecutar este job'
          });
        }
      }

      // 4. Completar configuración del job
      const processorInfo = BaseController.processors.get(config.subType)!;
      const jobConfig: JobConfig = {
        ...config,
        userId: config.userId || req.user?.id || req.headers['user-id'] as string,
        priority: config.priority || processorInfo.config.priority || 'normal',
        estimatedDuration: config.estimatedDuration || processorInfo.config.estimatedDuration
      };

      // 5. Crear job
      const jobId = await BaseController.jobService.createJob(jobConfig);
      const job = BaseController.jobService.getJob(jobId);

      // 6. Respuesta estándar 202 Accepted
      res.status(202).json({
        success: true,
        data: {
          jobId,
          status: job?.status || 'queued',
          type: job?.type,
          subType: job?.subType,
          createdAt: job?.createdAt,
          estimatedDuration: job?.estimatedDuration,
          progress: job?.progress || 0
        },
        message: `Proceso ${config.subType} iniciado. Use el jobId para consultar el progreso.`
      });

    } catch (error) {
      console.error('Error creating async job:', error);
      next(error);
    }
  }

  // CREAR JOB VALIDADO (MÉTODO HELPER)
  protected async createValidatedJob<T>(
    subType: string,
    payload: T,
    req: Request,
    res: Response,
    next: NextFunction,
    options: {
      type?: string;
      priority?: 'high' | 'normal' | 'low';
      estimatedDuration?: string;
    } = {}
  ): Promise<void> {
    await this.createAsyncJob({
      type: options.type || 'data_processing',
      subType,
      payload,
      priority: options.priority || 'normal',
      estimatedDuration: options.estimatedDuration
    }, req, res, next);
  }

  // VALIDACIÓN DE PARÁMETROS
  protected validateJobParameters(payload: any, requiredFields: string[]): string[] {
    const errors: string[] = [];
    
    if (!payload || typeof payload !== 'object') {
      return ['payload es requerido y debe ser un objeto'];
    }
    
    for (const field of requiredFields) {
      const value = payload[field];
      if (value === undefined || value === null || value === '') {
        errors