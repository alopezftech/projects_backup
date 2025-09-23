/*
 * SHARED MODULE - Componentes, pipes y directivas reutilizables
 *
 * El directorio SHARED contiene elementos que pueden ser reutilizados
 * en múltiples features de la aplicación. Es el lugar para todo lo que
 * es común pero no es específico del core del sistema.
 *
 * CONTENIDO DEL SHARED:
 *
 * 1. COMPONENTS (Componentes reutilizables)
 *    - Componentes UI genéricos (botones, modales, etc.)
 *    - Componentes de presentación sin lógica de negocio
 *    - Componentes que pueden usarse en múltiples features
 *
 * 2. PIPES (Transformadores de datos)
 *    - Pipes personalizados para formatear datos
 *    - Transformaciones de texto, fechas, números
 *    - Filters y ordenamientos
 *
 * 3. DIRECTIVES (Directivas personalizadas)
 *    - Directivas de atributo para comportamientos
 *    - Directivas estructurales personalizadas
 *    - Manipulación del DOM de forma reutilizable
 *
 * 4. UTILS (Utilidades específicas del frontend)
 *    - Funciones helper para componentes
 *    - Validadores de formularios
 *    - Animaciones y efectos visuales
 *
 * REGLAS IMPORTANTES:
 * - NO debe contener servicios singleton (esos van en core)
 * - Puede ser importado por cualquier feature
 * - Los componentes deben ser "dumb" (sin lógica de negocio)
 * - Todo debe ser reutilizable y genérico
 *
 * DIFERENCIA CON CORE:
 * - Core: Servicios singleton, guards, interceptors (lógica)
 * - Shared: Componentes, pipes, directivas (presentación)
 */

// Re-exportamos todo lo del shared para facilitar las importaciones
export * from './components/index';
export * from './pipes/index';
export * from './directives/index';
export * from './utils/index';
