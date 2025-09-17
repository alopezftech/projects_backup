// ---------------------------------------------------
// rateLimit.middleware.ts - Middleware de rate limiting
//
// Este archivo define el middleware que limita la cantidad de peticiones permitidas por IP
// en un periodo de tiempo. Protege el backend contra abusos, ataques de denegación de servicio
// y permite controlar la carga en entornos de alta concurrencia. Configurable por entorno.
// ---------------------------------------------------

// Importa el paquete express-rate-limit para limitar peticiones
import rateLimit from 'express-rate-limit';
// Importa la configuración global para obtener los parámetros de rate limiting
import { config } from '../config/config.js';

// Exporta el middleware configurado para limitar peticiones
export const rateLimiter = rateLimit({
  // Ventana de tiempo en milisegundos para contar las peticiones
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  // Número máximo de peticiones permitidas por IP en la ventana
  max: config.RATE_LIMIT_MAX_REQUESTS,
  // Mensaje personalizado para cuando se excede el límite
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  // Usa los headers estándar para informar el rate limit
  standardHeaders: true,
  // No usa los headers legacy
  legacyHeaders: false,
  // Handler personalizado para respuestas cuando se excede el límite
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Please try again later.'
    });
  }
});
