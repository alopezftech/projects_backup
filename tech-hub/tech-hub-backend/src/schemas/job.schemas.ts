// ---------------------------------------------------
// job.schemas.ts - Esquemas de validación Zod para jobs
//
// Este archivo define los esquemas de validación para las peticiones relacionadas con jobs.
// Utiliza Zod para garantizar que los datos recibidos en la API cumplen con la estructura y tipos esperados.
// Permite validar la creación, consulta y filtrado de trabajos asíncronos en el backend.
// ---------------------------------------------------

// Importa Zod para definir y validar esquemas de datos
import { z } from 'zod';
import { JobType, JobPriority, JobStatus } from '../shared/models/job.model.js';

// Esquema para validar la creación de un job
export const JobRequestSchema = z.object({
  type: z.enum(JobType), // Tipo de job permitido
  parameters: z.record(z.string(), z.any()), // Parámetros dinámicos para el job
  priority: z.enum(JobPriority).default(JobPriority.NORMAL) // Prioridad del job
});

// Esquema para validar los parámetros de consulta de jobs
export const JobQuerySchema = z.object({
  status: z.enum(JobStatus).optional(), // Estado opcional para filtrar
  limit: z.coerce.number().min(1).max(100).default(20), // Límite de resultados por página
  offset: z.coerce.number().min(0).default(0) // Offset para paginación
});

// Tipos TypeScript inferidos a partir de los esquemas Zod
export type JobRequestInput = z.infer<typeof JobRequestSchema>; // Tipo para creación de job
export type JobQueryInput = z.infer<typeof JobQuerySchema>; // Tipo para consulta de jobs
