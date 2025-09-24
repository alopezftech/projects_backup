/*
 * LAYOUT - Componentes de estructura y navegación
 *
 * El directorio LAYOUT contiene los componentes que definen la estructura
 * principal de la aplicación y la navegación global.
 *
 * PROPÓSITO DEL LAYOUT:
 *
 * 1. ESTRUCTURA PRINCIPAL
 *    - Define el layout base de la aplicación
 *    - Header, footer, sidebar, main content area
 *    - Responsive design y breakpoints
 *
 * 2. NAVEGACIÓN GLOBAL
 *    - Menús principales y de navegación
 *    - Breadcrumbs y rutas de navegación
 *    - Search global y quick actions
 *
 * 3. ELEMENTOS PERSISTENTES
 *    - Componentes que permanecen en todas las páginas
 *    - Barra de notificaciones
 *    - Loading global y overlays
 *
 * COMPONENTES TÍPICOS DEL LAYOUT:
 *
 * 1. MAIN LAYOUT
 *    - Componente contenedor principal
 *    - Define la estructura general de la app
 *    - Maneja el responsive design
 *
 * 2. HEADER
 *    - Logo, título de la aplicación
 *    - Navegación principal
 *    - User menu y profile actions
 *    - Search global
 *
 * 3. SIDEBAR/NAVIGATION
 *    - Menú lateral de navegación
 *    - Árbol de secciones y páginas
 *    - Filters y quick access
 *
 * 4. FOOTER
 *    - Enlaces legales y de contacto
 *    - Información de copyright
 *    - Links adicionales
 *
 * 5. BREADCRUMBS
 *    - Navegación jerárquica
 *    - Ubicación actual del usuario
 *    - Quick navigation back
 *
 * CARACTERÍSTICAS DEL LAYOUT:
 * - Componentes standalone en Angular 20
 * - Responsive design mobile-first
 * - Accesibilidad (a11y) integrada
 * - Theming y modo oscuro support
 * - Performance optimizado
 *
 * DIFERENCIA CON SHARED:
 * - Layout: Estructura específica de la app
 * - Shared: Componentes genéricos reutilizables
 *
 * USO EN LA APLICACIÓN:
 * Los componentes de layout se usan típicamente en:
 * - app.component.html (layout principal)
 * - Rutas que requieren layout específico
 * - Como wrapper de features
 */

// Exportamos los componentes de layout disponibles
export { HeaderComponent } from './header/header.component';
