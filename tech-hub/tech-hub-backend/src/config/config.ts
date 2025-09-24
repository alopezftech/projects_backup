// ---------------------------------------------------
// config.ts - Configuración centralizada de TechHub Backend
//
// Este archivo gestiona todas las variables de entorno y parámetros de configuración
// para el backend. Permite definir valores para cada entorno (desarrollo, preproducción, producción)
// y facilita el acceso seguro y tipado a la configuración global de la aplicación.
// Incluye parámetros para seguridad, almacenamiento, colas, caché, autenticación, rate limiting y resiliencia.
// ---------------------------------------------------

// Importa dotenv para cargar variables de entorno desde un archivo .env
import dotenv from 'dotenv';

// Detecta el entorno y carga el archivo .env correspondiente

const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';


// Inicializa dotenv para que process.env tenga los valores definidos en .env
dotenv.config({ path: envFile });

// Exporta un objeto de configuración con todos los parámetros relevantes
export const config = {
  // Entorno de ejecución (development, production, etc.)
  NODE_ENV: process.env.NODE_ENV || 'development',
  // Puerto en el que escucha el servidor
  PORT: parseInt(process.env.PORT || '3000', 10),
  // Nivel de logging (info, debug, error)
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // Origen permitido para CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  
  // Conexión a Azure Service Bus para colas de trabajos asíncronos
  AZURE_SERVICE_BUS_CONNECTION_STRING: process.env.AZURE_SERVICE_BUS_CONNECTION_STRING || '',
  AZURE_SERVICE_BUS_QUEUE_NAME: process.env.AZURE_SERVICE_BUS_QUEUE_NAME || 'jobs',
  
  // Conexión a Azure Blob Storage para almacenamiento de resultados grandes
  AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING || '',
  AZURE_STORAGE_CONTAINER_NAME: process.env.AZURE_STORAGE_CONTAINER_NAME || 'results',
  
  // Configuración de Redis para caché y performance
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
  
  // Clave y expiración para autenticación JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  
  // Configuración de rate limiting para limitar peticiones por IP
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 min
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  
  // Parámetros para el patrón circuit breaker (resiliencia)
  CIRCUIT_BREAKER_TIMEOUT: parseInt(process.env.CIRCUIT_BREAKER_TIMEOUT || '3000', 10),
  CIRCUIT_BREAKER_ERROR_THRESHOLD: parseInt(process.env.CIRCUIT_BREAKER_ERROR_THRESHOLD || '50', 10),
  CIRCUIT_BREAKER_RESET_TIMEOUT: parseInt(process.env.CIRCUIT_BREAKER_RESET_TIMEOUT || '30000', 10)
};
