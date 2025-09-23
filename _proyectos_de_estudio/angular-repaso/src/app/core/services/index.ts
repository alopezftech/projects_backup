/*
 * SERVICES INDEX - Exportaciones de servicios del core
 *
 * Este archivo centraliza las exportaciones de todos los servicios principales
 * de la aplicación. Los servicios aquí definidos son singleton y se instancian
 * una sola vez durante el ciclo de vida de la aplicación.
 *
 * TIPOS DE SERVICIOS EN EL CORE:
 *
 * 1. API SERVICES
 *    - Comunicación con APIs externas
 *    - Manejo de respuestas HTTP
 *    - Cache y optimizaciones
 *
 * 2. STATE MANAGEMENT
 *    - Servicios de estado global
 *    - Stores y subjects para compartir datos
 *    - Manejo de estado de la aplicación
 *
 * 3. UTILITY SERVICES
 *    - Servicios de utilidades (loading, notifications, etc.)
 *    - Configuración y constantes
 *    - Helpers y funciones auxiliares
 *
 * EJEMPLO DE USO:
 * import { ApiService, LoadingService, LoggerService } from '@app/core';
 */

// Servicios implementados
export { LoggerService } from './logger.service';

// TODO: Aquí se exportarán más servicios cuando se creen
// export { ApiService } from './api.service';
// export { LoadingService } from './loading.service';
// export { NotificationService } from './notification.service';
