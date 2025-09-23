import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig).catch(err => {
  // En aplicaciones empresariales, esto se enviaría a un servicio de error tracking
  // Como Sentry, LogRocket, etc. Por ahora mantenemos console.error para bootstrap failures
  console.error('🚨 Bootstrap Error:', err);
});
