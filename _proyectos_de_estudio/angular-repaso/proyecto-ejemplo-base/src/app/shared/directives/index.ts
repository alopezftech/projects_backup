/*
 * SHARED DIRECTIVES INDEX - Directivas reutilizables
 *
 * Las directivas permiten agregar comportamientos y funcionalidades
 * a los elementos del DOM de manera reutilizable.
 *
 * TIPOS DE DIRECTIVAS:
 *
 * 1. ATTRIBUTE DIRECTIVES (Directivas de atributo)
 *    - Modifican el comportamiento o apariencia de un elemento
 *    - Ejemplos: tooltips, drag&drop, click outside
 *
 * 2. STRUCTURAL DIRECTIVES (Directivas estructurales)
 *    - Modifican la estructura del DOM agregando/removiendo elementos
 *    - Ejemplos: *ngIf personalizado, *ngFor con condiciones
 *
 * DIRECTIVAS COMUNES EN APLICACIONES:
 *
 * 1. INTERACTION DIRECTIVES (Interacción)
 *    - ClickOutside: Detecta clicks fuera del elemento
 *    - LongPress: Detecta presión prolongada
 *    - Ripple: Efecto de ondas en clicks
 *    - Tooltip: Muestra información al hover
 *
 * 2. VISIBILITY DIRECTIVES (Visibilidad)
 *    - LazyLoad: Carga lazy de imágenes/contenido
 *    - InViewport: Detecta si elemento está visible
 *    - AutoFocus: Enfoca automáticamente elementos
 *
 * 3. VALIDATION DIRECTIVES (Validación)
 *    - PasswordStrength: Valida fortaleza de contraseña
 *    - EmailValidator: Validación personalizada de email
 *    - NumberOnly: Solo permite números en inputs
 *
 * 4. UTILITY DIRECTIVES (Utilidad)
 *    - CopyToClipboard: Copia texto al portapapeles
 *    - ConfirmAction: Confirma acciones peligrosas
 *    - TrackBy: Optimiza *ngFor con tracking
 *
 * USO EN TEMPLATES:
 * <div appClickOutside (clickOutside)="closeMenu()">...</div>
 * <img appLazyLoad [src]="imageUrl">
 * <input appNumberOnly>
 *
 * CARACTERÍSTICAS:
 * - Reutilizables en cualquier componente
 * - Encapsulan comportamientos complejos
 * - Mejoran la separación de responsabilidades
 * - Facilitan el testing y mantenimiento
 */

// TODO: Aquí se exportarán las directivas cuando se creen
// export { ClickOutsideDirective } from './click-outside.directive';
// export { LazyLoadDirective } from './lazy-load.directive';
// export { TooltipDirective } from './tooltip.directive';
// export { RippleDirective } from './ripple.directive';

// Por ahora, exportamos un placeholder
export const DIRECTIVES_INDEX = 'Directives will be exported here';
