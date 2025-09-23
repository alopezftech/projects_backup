/*
 * FEATURES - Arquitectura basada en funcionalidades
 *
 * El directorio FEATURES contiene todos los módulos de funcionalidades
 * específicas de la aplicación. Cada feature es independiente y autónomo.
 *
 * PRINCIPIOS DE LA ARQUITECTURA FEATURE-BASED:
 *
 * 1. SEPARACIÓN POR DOMINIO
 *    - Cada feature representa una funcionalidad completa
 *    - Agrupa todo lo relacionado: componentes, servicios, rutas
 *    - Facilita el mantenimiento y escalabilidad
 *
 * 2. INDEPENDENCIA ENTRE FEATURES
 *    - Cada feature puede desarrollarse independientemente
 *    - Minimal acoplamiento entre features
 *    - Facilita el trabajo en equipo
 *
 * 3. LAZY LOADING
 *    - Cada feature se carga bajo demanda
 *    - Mejora el tiempo de carga inicial
 *    - Optimiza el bundle size
 *
 * ESTRUCTURA ESTÁNDAR DE UN FEATURE:
 *
 * feature-name/
 * ├── components/          # Componentes específicos del feature
 * │   ├── feature-list/
 * │   ├── feature-card/
 * │   └── feature-detail/
 * ├── pages/              # Páginas/containers del feature
 * │   ├── feature-page/
 * │   └── feature-detail-page/
 * ├── services/           # Servicios específicos del feature
 * │   └── feature.service.ts
 * ├── models/             # Interfaces específicas del feature
 * │   └── feature.interface.ts
 * └── feature.routes.ts   # Rutas del feature
 *
 * DIFERENCIA ENTRE COMPONENTS Y PAGES:
 *
 * COMPONENTS (Dumb Components):
 * - Solo presentación, reciben datos vía @Input
 * - Emiten eventos vía @Output
 * - Reutilizables dentro del feature
 * - No manejan estado ni lógica de negocio
 *
 * PAGES (Smart Components):
 * - Manejan estado y lógica de negocio
 * - Se conectan con servicios
 * - Orquestan la interacción entre components
 * - Son los containers principales del feature
 *
 * COMUNICACIÓN ENTRE FEATURES:
 * - A través de servicios del core
 * - Mediante eventos globales
 * - Usando state management (si es necesario)
 * - Nunca importar directamente de otro feature
 *
 * BENEFITS DE ESTA ARQUITECTURA:
 * - Escalabilidad: Fácil agregar nuevos features
 * - Mantenibilidad: Código organizado y predecible
 * - Testabilidad: Features aislados y testeable
 * - Performance: Lazy loading optimiza la carga
 * - Colaboración: Equipos pueden trabajar en paralelo
 */

// Este archivo sirve como documentación de la arquitectura de features
export const FEATURES_ARCHITECTURE = {
  description: 'Feature-based architecture documentation',
  principles: [
    'Domain separation',
    'Feature independence',
    'Lazy loading',
    'Smart/Dumb component pattern',
  ],
  benefits: ['Scalability', 'Maintainability', 'Testability', 'Performance', 'Team collaboration'],
};
