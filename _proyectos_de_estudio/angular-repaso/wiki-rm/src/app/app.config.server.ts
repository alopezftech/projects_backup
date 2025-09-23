// src/app/app.config.server.ts
import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { appConfig } from './app.config';
import { provideServerRendering } from '@angular/platform-server';

const serverOnlyConfig: ApplicationConfig = {
  providers: [
    // Activa SSR + soporte de rutas de servidor y app shell
    provideServerRendering(),
    // << aquí, providers SOLO del servidor >>
  ],
};

export const config = mergeApplicationConfig(appConfig, serverOnlyConfig);
