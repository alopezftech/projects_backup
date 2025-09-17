// ---------------------------------------------------
// logger.ts - Logger centralizado con Winston
//
// Este archivo define el logger principal del backend usando Winston.
// Permite registrar logs estructurados, con nivel configurable, timestamp, stacktrace y formato JSON.
// Facilita la trazabilidad, el monitoreo y la depuración en todos los ambientes.
// ---------------------------------------------------

// Importa Winston para logging avanzado
import winston from 'winston';
// Importa la configuración global para obtener el nivel de log
import { config } from '../config/config.js';

// Crea y exporta el logger configurado
export const logger = winston.createLogger({
  level: config.LOG_LEVEL, // Nivel de log (info, debug, error)
  format: winston.format.combine(
    winston.format.timestamp(), // Agrega timestamp a cada log
    winston.format.errors({ stack: true }), // Incluye stacktrace en errores
    winston.format.json() // Formato JSON estructurado
  ),
  transports: [
    new winston.transports.Console({ // Transporta los logs a la consola
      format: winston.format.combine(
        winston.format.colorize(), // Colorea los logs en consola
        winston.format.simple() // Formato simple para desarrollo
      )
    })
  ]
});