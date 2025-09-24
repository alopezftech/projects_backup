// ---------------------------------------------------
// job.routes.ts - Rutas para gestión de jobs (tareas asíncronas)
//
// Este archivo define las rutas HTTP para crear, consultar, cancelar y listar jobs.
// Permite administrar procesos asíncronos en el backend desde la API REST.
// ---------------------------------------------------

import { Router } from 'express';
// Importa Router de Express para crear un grupo de rutas.

import * as jobController from '../controllers/job.controller.js';
// Importa todos los controladores relacionados con la gestión de jobs.

const router = Router();
// Crea una instancia de Router para definir rutas específicas.

router.post('/', jobController.createJob);
// Ruta POST /api/jobs - Crea un nuevo job asíncrono.

router.get('/:jobId', jobController.getJob);
// Ruta GET /api/jobs/:jobId - Consulta el estado de un job por su ID.

router.delete('/:jobId', jobController.cancelJob);
// Ruta DELETE /api/jobs/:jobId - Cancela un job en curso por su ID.

router.get('/', jobController.listJobs);
// Ruta GET /api/jobs - Lista y filtra los jobs existentes.

export { router as jobRoutes };
// Exporta el router con el alias jobRoutes para ser usado en la configuración principal de rutas.