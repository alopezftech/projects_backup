// ---------------------------------------------
// job.controller.ts
// Controladores para la gestión de jobs (tareas asíncronas).
// Permiten crear, consultar, cancelar y listar jobs usando Worker Threads.
// Facilitan el seguimiento y administración de procesos asíncronos en el backend.
// ---------------------------------------------

import { Request, Response, NextFunction } from 'express';
// Importa los tipos de Express para tipar los parámetros de las funciones.

import { JobRequestSchema, JobQuerySchema } from '../schemas/job.schemas.js';
// Importa los esquemas de validación para las peticiones y consultas de jobs.

import { JobService } from '../services/job.service.js';
// Importa el servicio que maneja la lógica de jobs con Worker Threads.

import { logger } from '../utils/logger.js';
// Importa el logger para registrar eventos importantes.

// Re-exportar jobs para mantener compatibilidad con user.controller.ts
export const jobs = new Map(); // Placeholder, se mantiene para compatibilidad

export async function createJob(req: Request, res: Response, next: NextFunction) {
  // Controlador para crear un nuevo job usando JobService.
  try {

    // TODO: Aquí deberiamos usar @ValidateSchema una vez que esté implementado.
    // Por ahora, validamos manualmente el cuerpo de la petición.
    const validatedData = JobRequestSchema.parse(req.body);

    // Valida el cuerpo de la petición usando el esquema.
    
    const jobConfig = {
      type: validatedData.type,
      priority: validatedData.priority,
      parameters: validatedData.parameters,
      ...(req.user?.userId && { userId: req.user.userId })
    };
    
    const job = await JobService.createJob(jobConfig);
    
    logger.info('Job created via API', { 
      jobId: job.jobId, 
      type: validatedData.type, 
      priority: validatedData.priority,
      userId: req.user?.userId
    });
    
    res.status(202).json(job);
    // Devuelve el job creado con estado 202 (Accepted).
  } catch (error) {
    next(error);
    // Pasa el error al middleware de manejo de errores.
  }
}

export function getJob(req: Request, res: Response, next: NextFunction) {
  // Controlador para consultar el estado de un job por su ID.
  try {
    const { jobId } = req.params;
    if (!jobId || typeof jobId !== 'string') {
      res.status(400).json({ success: false, error: 'Invalid jobId' });
      return;
    }
    
    const job = JobService.getJob(jobId);
    if (!job) {
      res.status(404).json({ success: false, error: 'Job not found' });
      return;
    }
    
    res.json(job);
  } catch (error) {
    next(error);
  }
}

export function cancelJob(req: Request, res: Response, next: NextFunction) {
  // Controlador para cancelar un job en curso.
  try {
    const { jobId } = req.params;
    if (!jobId || typeof jobId !== 'string') {
      res.status(400).json({ success: false, error: 'Invalid jobId' });
      return;
    }
    
    const cancelled = JobService.cancelJob(jobId);
    if (!cancelled) {
      res.status(404).json({ success: false, error: 'Job not found or cannot be cancelled' });
      return;
    }
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export function listJobs(req: Request, res: Response, next: NextFunction) {
  // Controlador para listar y filtrar jobs.
  try {
    const queryParams = JobQuerySchema.parse(req.query);
    
    const listOptions = {
      limit: queryParams.limit,
      offset: queryParams.offset,
      ...(queryParams.status && { status: queryParams.status })
    };
    
    const result = JobService.listJobs(listOptions);

    res.json({
      success: true,
      data: result.jobs,
      pagination: {
        total: result.total,
        limit: queryParams.limit,
        offset: queryParams.offset,
        hasMore: queryParams.offset + queryParams.limit < result.total
      }
    });
  } catch (error) {
    next(error);
  }
}



