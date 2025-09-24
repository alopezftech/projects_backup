import { Routes } from '@angular/router';

/*
 * RUTAS PRINCIPALES DE LA APLICACIÓN
 *
 * Este archivo define la configuración de rutas para la aplicación Angular 20.
 * Implementa lazy loading para optimizar la carga inicial y mejorar el performance.
 *
 * ESTRATEGIAS DE ROUTING:
 *
 * 1. LAZY LOADING
 *    - Cada feature se carga bajo demanda
 *    - Reduce el bundle inicial
 *    - Mejora el tiempo de carga inicial
 *
 * 2. FEATURE-BASED ROUTES
 *    - Cada feature tiene sus propias rutas
 *    - Separación clara de responsabilidades
 *    - Facilita el mantenimiento
 *
 * 3. ROUTE CONFIGURATION
 *    - Títulos descriptivos para SEO
 *    - Guards para protección de rutas
 *    - Resolvers para pre-cargar datos
 *
 * ESTRUCTURA DE RUTAS:
 * - '/' -> Redirige a la página principal
 * - '/feature' -> Carga el feature correspondiente
 * - '**' -> Página 404 para rutas no encontradas
 *
 * CONVENCIONES:
 * - Usar kebab-case para URLs (my-feature)
 * - Agregar títulos descriptivos
 * - Implementar rutas de error (404)
 * - Usar guards cuando sea necesario
 */

export const routes: Routes = [
  // Ruta raíz - redirige a la página de inicio
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },

  // Ruta de inicio/dashboard
  {
    path: 'home',
    loadComponent: () => import('./features/home/home-page/home-page.component').then(m => m.HomeComponent),
    title: 'Inicio - Rick & Morty Wiki',
  },

  // Wiki sections in English paths
  {
    path: 'characters',
    loadChildren: () => import('./features/characters/character.routes').then(m => m.characterRoutes),
    title: 'Personajes - Rick & Morty Wiki',
  },
  {
    path: 'episodes',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Episodios - Rick & Morty Wiki',
  },
  {
    path: 'curiosities',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Curiosidades - Rick & Morty Wiki',
  },

  // Ruta de error 404 - debe ir antes del wildcard
  {
    path: '404',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Page Not Found',
  },

  // Wildcard route - SIEMPRE debe ir al final
  {
    path: '**',
    redirectTo: '/404',
  },
];
