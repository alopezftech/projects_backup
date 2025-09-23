/*
 * SHARED COMPONENTS INDEX - Componentes reutilizables
 *
 * Este archivo centraliza las exportaciones de todos los componentes
 * que pueden ser reutilizados en diferentes features de la aplicación.
 *
 * TIPOS DE COMPONENTES SHARED:
 *
 * 1. UI COMPONENTS (Componentes de interfaz)
 *    - Button, Input, Modal, Card, etc.
 *    - Componentes de diseño y layout
 *    - Elementos visuales genéricos
 *
 * 2. PRESENTATION COMPONENTS (Componentes de presentación)
 *    - Loading spinners, progress bars
 *    - Error messages, success messages
 *    - Pagination, breadcrumbs
 *
 * 3. FORM COMPONENTS (Componentes de formulario)
 *    - Custom form controls
 *    - Validators visuales
 *    - Input wrappers y decoradores
 *
 * 4. UTILITY COMPONENTS (Componentes de utilidad)
 *    - Confirm dialogs
 *    - Toast notifications
 *    - Image lazy loading
 *
 * CARACTERÍSTICAS DE LOS COMPONENTES SHARED:
 * - Son "dumb components" (solo presentación)
 * - Reciben datos vía @Input()
 * - Comunican eventos vía @Output()
 * - No contienen lógica de negocio
 * - Son standalone components en Angular 20
 * - Altamente reutilizables y configurables
 *
 * EJEMPLO DE ESTRUCTURA:
 * components/
 * ├── button/
 * │   ├── button.component.ts
 * │   ├── button.component.html
 * │   ├── button.component.scss
 * │   └── button.component.spec.ts
 * └── modal/
 *     ├── modal.component.ts
 *     ├── modal.component.html
 *     ├── modal.component.scss
 *     └── modal.component.spec.ts
 */

// TODO: Aquí se exportarán los componentes cuando se creen
// export { ButtonComponent } from './button/button.component';
// export { ModalComponent } from './modal/modal.component';
// export { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

// Por ahora, exportamos un placeholder
export const COMPONENTS_INDEX = 'Components will be exported here';
