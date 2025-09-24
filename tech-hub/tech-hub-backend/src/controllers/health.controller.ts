// ---------------------------------------------
// health.controller.ts
// Controladores para endpoints de health check y readiness check.
// Permiten monitorizar el estado y disponibilidad del backend.
// ---------------------------------------------

import { Request, Response } from 'express';
// Importa los tipos Request y Response de Express para tipar los parámetros de las funciones.

export function healthCheck(_req: Request, res: Response) {
  // Controlador para el endpoint de health check.
  // Devuelve el estado general del servicio y algunos metadatos.
  res.json({
    success: true,                      // Indica que la petición fue exitosa.
    status: 'healthy',                  // Estado del servicio ('healthy').
    timestamp: new Date().toISOString(),// Fecha y hora actual en formato ISO.
    service: 'TechHub Backend',         // Nombre del servicio.
    version: '1.0.0'                    // Versión del servicio (puede obtenerse dinámicamente).
  });
}

export function readinessCheck(_req: Request, res: Response) {
  // Controlador para el endpoint de readiness check.
  // Permite saber si el servicio está listo para recibir peticiones.
  // Aquí se pueden agregar chequeos de base de datos y servicios externos.
  res.json({
    success: true,                      // Indica que la petición fue exitosa.
    status: 'ready',                    // Estado de readiness ('ready').
    timestamp: new Date().toISOString() // Fecha y hora actual en formato ISO.
  });
}