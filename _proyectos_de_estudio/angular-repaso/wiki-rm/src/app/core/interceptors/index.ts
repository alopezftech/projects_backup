/*
 * INTERCEPTORS INDEX - Exportaciones de interceptores HTTP
 *
 * Los interceptores permiten interceptar y modificar las peticiones y respuestas HTTP
 * de manera global en toda la aplicación.
 *
 * INTERCEPTORES IMPLEMENTADOS:
 *
 * 1. LoggingInterceptor
 *    - Registra todas las peticiones HTTP para debugging
 *    - Muestra información detallada en consola
 *    - Útil para desarrollo y monitoreo
 *
 * 2. RetryTimeoutInterceptor
 *    - Maneja timeouts y reintentos automáticos
 *    - Mejora la resiliencia ante fallos de red
 *    - Configuración personalizada por endpoint
 *
 * 3. ErrorMapperInterceptor
 *    - Mapea errores HTTP a mensajes personalizados
 *    - Centraliza el manejo de errores
 *    - Proporciona mensajes amigables al usuario
 *
 * CONFIGURACIÓN:
 * Los interceptores se registran en app.config.ts con:
 * { provide: HTTP_INTERCEPTORS, useClass: InterceptorClass, multi: true }
 *
 * ORDEN DE EJECUCIÓN:
 * Los interceptores se ejecutan en el orden que se registran en providers
 */

export { LoggingInterceptor } from './logging.interceptor';
export { RetryTimeoutInterceptor } from './retry-timeout.interceptor';
export { ErrorMapperInterceptor } from './error-mapper.interceptor';
