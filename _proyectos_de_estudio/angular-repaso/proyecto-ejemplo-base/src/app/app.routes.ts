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
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'Home - Angular 20 example project',
  },

  // TODO: Aquí se agregarán las rutas de cada feature cuando se implementen
  // Ejemplo de como serían las rutas de features:
  /*
  {
    path: 'characters',
    loadChildren: () => import('./features/characters/character.routes').then(m => m.characterRoutes),
    title: 'Characters - Rick & Morty Wiki'
  },
  {
    path: 'episodes', 
    loadChildren: () => import('./features/episodes/episode.routes').then(m => m.episodeRoutes),
    title: 'Episodes - Rick & Morty Wiki'
  },
  */

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
