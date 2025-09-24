// ---------------------------------------------
// TechHub Backend - server.ts
//
// Este archivo es el punto de entrada principal del Backend for Frontend (BFF) para TechHub.
// Su función es inicializar y configurar el servidor Express.js, gestionar la seguridad, logging, rate limiting,
// exponer rutas HTTP para operaciones síncronas y asíncronas, y habilitar comunicación en tiempo real con Socket.IO.
// Está diseñado para servir múltiples microfrontends Electron, soportar trabajos asíncronos, y escalar horizontalmente.
// ---------------------------------------------

// Importa la configuración centralizada de variables de entorno
import { config } from './config/config.js';
// Importa Express y tipos para definir la aplicación y los handlers
import express, { Express } from 'express';
// Importa CORS para permitir peticiones cross-origin
import cors from 'cors';
// Importa Helmet para mejorar la seguridad HTTP
import helmet from 'helmet';
// Importa Compression para comprimir respuestas HTTP
import compression from 'compression';
// Importa el módulo HTTP para crear el servidor
import { createServer } from 'http';
// Importa Socket.IO para comunicación en tiempo real
import { Server as SocketIOServer } from 'socket.io';
// Importa el logger para logging estructurado
import { logger } from './utils/logger.js';
// Importa las rutas de jobs (procesos asíncronos)
import { jobRoutes } from './routes/job.routes.js';
// Importa las rutas de health (salud y readiness)
import { healthRoutes } from './routes/health.routes.js';
// Importa las rutas de errores
import { errorRoutes } from './routes/error.routes.js';
// Importa el middleware de manejo de errores
import { errorHandler } from './middleware/error.middleware.js';
// Importa el middleware de logging de peticiones
import { requestLogger } from './middleware/logging.middleware.js';
// Importa el middleware de rate limiting
import { rateLimiter } from './middleware/rateLimit.middleware.js';
// import pkg from '../package.json' with { type: 'json' };
import 'reflect-metadata';
import { MetadataService } from './services/metadata.service.js';
import { initializeControllers } from './controllers/module.controllers.js';
import { controllers } from './controllers/index.controller.js';

// Función principal async para inicializar el servidor
async function startServer() {
  // Inicializa la aplicación Express
  const app: Express = express();
  // Crea el servidor HTTP a partir de la app Express
  const server = createServer(app);
  // Inicializa Socket.IO sobre el servidor HTTP, configurando CORS
  const io = new SocketIOServer(server, {
    cors: {
    origin: config.CORS_ORIGIN, // Origen permitido para WebSocket
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  },
});

// Aplica middleware de seguridad HTTP
app.use(helmet());
// Aplica CORS para permitir peticiones desde el frontend
app.use(cors({ origin: config.CORS_ORIGIN }));
// Aplica compresión a las respuestas HTTP
app.use(compression());

// Configura el parseo de JSON en el body de las peticiones
app.use(express.json());
// Configura el parseo de datos urlencoded en el body
app.use(express.urlencoded({ extended: true }));

// Aplica el middleware de logging para registrar cada petición
app.use(requestLogger);

// Aplica el rate limiter para limitar el número de peticiones por IP
app.use(rateLimiter);

// Registra la ruta de health check (estado y readiness)
app.use('/api/health', healthRoutes);
// Registra la ruta de jobs (procesamiento asíncrono)
app.use('/api/jobs', jobRoutes);

// Inicializar controladores para registrar procesadores de jobs
await initializeControllers();

MetadataService.registerControllers(app, controllers)

// Registra la ruta de errores (manejo de errores)
if (process.env.NODE_ENV !== 'production') {
  app.use('/api', errorRoutes);
}

// Configura los eventos de conexión de Socket.IO
io.on('connection', (socket) => {
  // Logea la conexión de un nuevo cliente WebSocket
  logger.info(`Client connected: ${socket.id}`);

  // Permite a un cliente suscribirse a actualizaciones de un job específico
  socket.on('subscribe', (jobId: string) => {
    socket.join(`job:${jobId}`);
    logger.info(`Client ${socket.id} subscribed to job:${jobId}`);
  });

  // Permite a un cliente cancelar la suscripción a un job
  socket.on('unsubscribe', (jobId: string) => {
    socket.leave(`job:${jobId}`);
    logger.info(`Client ${socket.id} unsubscribed from job:${jobId}`);
  });

  // Logea la desconexión del cliente
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Manejadores globales de errores no capturados (solo logging, sin duplicar registro)
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });
  
  // En producción, terminar el proceso de forma elegante
  if (process.env.NODE_ENV === 'production') {
    console.error('Uncaught exception detected. Shutting down gracefully...');
  }
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', {
    promise,
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined,
    timestamp: new Date().toISOString(),
  });
  
  // En producción, considerar terminar el proceso
  if (process.env.NODE_ENV === 'production') {
    console.error('Unhandled rejection detected. Consider restarting...');
  }
});

  // Middleware de manejo de errores debe ir después de todas las rutas
  app.use(errorHandler);

  // Define el puerto de escucha del servidor
  const PORT = config.PORT || 3000;

  // Inicia el servidor HTTP y muestra información en el log
  server.listen(PORT, () => {
    logger.info(`TechHub Backend v1.0.1 listening on port ${PORT}`);
    logger.info(`Environment: ${config.NODE_ENV}`);
    logger.info(`API base URL: http://localhost:${PORT}/api`);
    logger.info(`CORS origin: ${config.CORS_ORIGIN}`);
    logger.info(`Log level: ${config.LOG_LEVEL}`);
    logger.info(
      `Azure Service Bus: ${!!config.AZURE_SERVICE_BUS_CONNECTION_STRING ? 'configured' : 'not configured'}`
    );
    logger.info('TechHub Backend started successfully');
  });

  return { app, server, io };
}

// Iniciar el servidor
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// Exporta la función principal y el logger para uso externo
export { startServer };
