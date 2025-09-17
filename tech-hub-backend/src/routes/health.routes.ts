// ---------------------------------------------------
// health.routes.ts - Rutas para health check y readiness check
//
// Este archivo define las rutas HTTP que permiten consultar el estado de salud y disponibilidad del backend.
// Facilita la integración con sistemas de monitorización y orquestadores.
// ---------------------------------------------------

import { Router } from 'express';
// Importa Router de Express para crear un grupo de rutas.

import * as healthController from '../controllers/health.controller.js';
// Importa todos los controladores relacionados con health check y readiness check.

const router = Router();
// Crea una instancia de Router para definir rutas específicas.

router.get('/', healthController.healthCheck);
// Ruta GET /api/health - Ejecuta el controlador healthCheck para devolver el estado general del servicio.

router.get('/ready', healthController.readinessCheck);
// Ruta GET /api/health/ready - Ejecuta el controlador readinessCheck para indicar si el servicio está listo.

export { router as healthRoutes };
// Exporta el router con el alias healthRoutes para ser usado en la configuración principal de rutas.