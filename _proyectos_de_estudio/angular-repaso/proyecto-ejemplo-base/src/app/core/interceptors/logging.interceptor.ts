import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';

/**
 * Interceptor para logging de todas las peticiones HTTP.
 * Registra información detallada sobre requests y responses para debugging y monitoreo.
 * Útil para desarrollo, debugging y auditoría de tráfico HTTP.
 */
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  private readonly logger = inject(LoggerService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const startTime = Date.now();

    // Log de la petición saliente usando LoggerService
    this.logger.http(req.method, req.url, {
      headers: req.headers.keys().map(key => `${key}: ${req.headers.get(key)}`),
      body: req.body,
    });

    return next.handle(req).pipe(
      tap({
        next: event => {
          if (event instanceof HttpResponse) {
            const duration = Date.now() - startTime;
            this.logger.httpResponse(req.method, req.url, event.status, duration, {
              body: event.body,
              headers: event.headers.keys().map(key => `${key}: ${event.headers.get(key)}`),
            });
          }
        },
        error: (error: HttpErrorResponse) => {
          const duration = Date.now() - startTime;
          this.logger.httpError(req.method, req.url, error.status, duration, {
            message: error.message,
            error: error,
          });
        },
      })
    );
  }
}
