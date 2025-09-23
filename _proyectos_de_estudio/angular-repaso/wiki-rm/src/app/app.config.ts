// Archivo de configuración global para Angular 20.
// Este archivo centraliza los proveedores principales de la aplicación:
// - Define rutas, HTTP moderno, SSR (Server Side Rendering), interceptores y más.
// - Permite inicializar la app con dependencias recomendadas y facilita el mantenimiento y la escalabilidad.
// - Se usa en el bootstrap para arrancar la aplicación con la configuración adecuada.

import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http'; // Proveedor moderno de HttpClient y opciones para interceptores y SSR
import { ApplicationConfig } from '@angular/core'; // Tipo para la configuración global de la app
import { provideClientHydration } from '@angular/platform-browser'; // Habilita la hidratación del cliente para SSR
import { provideRouter, withComponentInputBinding } from '@angular/router'; // Proveedor de rutas y binding de inputs en componentes
import { routes } from './app.routes'; // Definición de las rutas de la aplicación
import { ErrorMapperInterceptor } from './core/interceptors/error-mapper.interceptor'; // Interceptor para mapeo de errores
import { LoggingInterceptor } from './core/interceptors/logging.interceptor'; // Interceptor para logging de peticiones HTTP
import { RetryTimeoutInterceptor } from './core/interceptors/retry-timeout.interceptor'; // Interceptor para reintentos y timeouts

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()), // Configura el enrutador y el binding de inputs en componentes
    provideClientHydration(), // Habilita la hidratación del cliente para SSR
    provideHttpClient(
      withInterceptorsFromDi(), // Permite usar interceptores definidos en el DI
      withFetch() // Usa la API Fetch para SSR y consistencia en peticiones
    ),
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true }, // Interceptor para logging global
    { provide: HTTP_INTERCEPTORS, useClass: RetryTimeoutInterceptor, multi: true }, // Interceptor para reintentos y timeouts
    { provide: HTTP_INTERCEPTORS, useClass: ErrorMapperInterceptor, multi: true }, // Interceptor para mapeo de errores
  ],
};
