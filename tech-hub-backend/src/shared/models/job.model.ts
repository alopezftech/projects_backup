// Modelos y tipos para trabajos (jobs)
export enum JobType {
  REPORT_GENERATION = 'report_generation',
  DATA_PROCESSING = 'data_processing',
  ML_TRAINING = 'ml_training'
}
export enum JobPriority {
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low'
}
export enum JobStatus {
  QUEUED = 'queued',
  STARTED = 'started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface ReportGenerationParameters {
  reportType: string;
  startDate: string;
  endDate: string;
  filters?: Record<string, string | number>;
}

export interface DataProcessingParameters {
  source: string;
  destination: string;
  batchSize?: number;
  transformations?: string[];
}

export interface MLTrainingParameters {
  datasetId: string;
  epochs: number;
  learningRate: number;
  modelType: string;
  hyperparameters?: Record<string, number | string>;
}

// Discriminated union para JobRequest
export type JobRequest =
  | {
      type: 'report_generation';
      parameters: ReportGenerationParameters;
      priority: JobPriority;
    }
  | {
      type: 'data_processing';
      parameters: DataProcessingParameters;
      priority: JobPriority;
    }
  | {
      type: 'ml_training';
      parameters: MLTrainingParameters;
      priority: JobPriority;
    };


export interface JobResponse {
  jobId: string;
  status: JobStatus;
  progress?: number;
  type: JobType;
  resultUrl?: string;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
  estimatedDuration?: string;
  priority: JobPriority;
  userId?: string;
  payload?: any;
  url?: string;
  method?: string;
}

export interface JobStartedEvent {
  event: 'job.started';
  jobId: string;
  timestamp: Date;
}

export interface JobProgressEvent {
  event: 'job.progress';
  jobId: string;
  progress: number;
  message: string;
}

export interface JobCompletedEvent {
  event: 'job.completed';
  jobId: string;
  resultUrl: string;
}

export type JobEvent = JobStartedEvent | JobProgressEvent | JobCompletedEvent;
