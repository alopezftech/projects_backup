/*
 * GUARDS INDEX - Exportaciones de guardias de ruta
 *
 * Los guards son servicios que controlan la navegación en la aplicación.
 * Se ejecutan antes de activar, desactivar o cargar rutas.
 *
 * TIPOS DE GUARDS:
 *
 * 1. CanActivate
 *    - Determina si una ruta puede ser activada
 *    - Ejemplo: verificar autenticación
 *
 * 2. CanActivateChild
 *    - Determina si las rutas hijas pueden ser activadas
 *    - Ejemplo: verificar permisos para secciones completas
 *
 * 3. CanDeactivate
 *    - Determina si se puede salir de una ruta
 *    - Ejemplo: advertir sobre cambios no guardados
 *
 * 4. Resolve
 *    - Pre-carga datos antes de activar la ruta
 *    - Ejemplo: cargar datos de usuario antes de mostrar el perfil
 *
 * 5. CanLoad
 *    - Determina si un módulo puede ser cargado (lazy loading)
 *    - Ejemplo: verificar permisos antes de cargar un feature
 *
 * EJEMPLO DE USO EN RUTAS:
 * {
 *   path: 'admin',
 *   canActivate: [AuthGuard, AdminGuard],
 *   loadComponent: () => import('./admin.component')
 * }
 */

// TODO: Aquí se exportarán los guards cuando se creen
// export { AuthGuard } from './auth.guard';
// export { AdminGuard } from './admin.guard';
// export { UnsavedChangesGuard } from './unsaved-changes.guard';

// Por ahora, exportamos un placeholder
export const GUARDS_INDEX = 'Guards will be exported here';
