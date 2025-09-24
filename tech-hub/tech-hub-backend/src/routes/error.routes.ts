// ---------------------------------------------------
// error.routes.ts - Rutas para manejo y prueba de errores
//
// Este archivo define rutas para consultar errores registrados y forzar errores en desarrollo.
// Permite monitorizar errores ocurridos en la app y probar el sistema global de manejo de errores.
// ---------------------------------------------------

import { Router, Request, Response } from 'express';
// Importa Router para crear rutas, y los tipos Request y Response para tipar los parámetros.

import { getLoggedErrors } from '../middleware/error.middleware.js';
// Importa la función que devuelve los errores registrados por el middleware de errores.

const router = Router();
// Crea una instancia de Router para definir rutas específicas.

router.get('/errors', (_req: Request, res: Response) => {
  // Ruta GET /errors - Devuelve la lista de errores registrados.
  res.json(getLoggedErrors());
  // Responde con el array de errores registrados en el sistema.
});

router.get('/force-error', () => {
  // Ruta GET /force-error - Fuerza un error para probar el manejo global de errores.
  throw new Error("❌ Bug inesperado!");
  // Lanza una excepción para simular un error inesperado.
});

export { router as errorRoutes };
// Exporta el router con el alias errorRoutes para ser usado en la configuración principal de rutas.