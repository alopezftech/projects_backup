/*
 * CORE MODULE - Funcionalidades principales del proyecto
 *
 * El directorio CORE contiene todo lo que es fundamental para el funcionamiento
 * de la aplicación y que debe ser cargado una sola vez al iniciar la app.
 *
 * CONTENIDO DEL CORE:
 *
 * 1. SERVICES (Servicios singleton)
 *    - Servicios que se instancian una sola vez en toda la app
 *    - API services, authentication, configuration, etc.
 *    - Se registran con providedIn: 'root'
 *
 * 2. GUARDS (Guardias de ruta)
 *    - Protección de rutas (autenticación, autorización, etc.)
 *    - Resolvers para pre-cargar datos
 *    - CanActivate, CanDeactivate, Resolve, etc.
 *
 * 3. INTERCEPTORS (Interceptores HTTP)
 *    - Logging, autenticación, manejo de errores
 *    - Se ejecutan en todas las peticiones HTTP
 *    - Configurados en app.config.ts
 *
 * 4. MODELS (Interfaces y tipos)
 *    - Definiciones de tipos TypeScript
 *    - Interfaces de API responses
 *    - Enums y constantes globales
 *
 * 5. UTILS (Utilidades)
 *    - Funciones helper reutilizables
 *    - Validadores personalizados
 *    - Constantes y configuraciones
 *
 * REGLA IMPORTANTE:
 * - El core solo se importa una vez en el bootstrap de la aplicación
 * - No debe depender de otros features
 * - Otros features pueden depender del core
 */

// Re-exportamos todo lo del core para facilitar las importaciones
export * from './services/index';
export * from './guards/index';
export * from './interceptors/index';
export * from './models/index';
export * from './utils/index';
