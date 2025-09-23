import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';

/**
 * Interceptor para manejar timeouts y reintentos automáticos.
 * Mejora la resiliencia de la aplicación ante fallos temporales de red.
 * Configurable por tipo de petición y endpoint.
 */
@Injectable()
export class RetryTimeoutInterceptor implements HttpInterceptor {
  private readonly logger = inject(LoggerService);
  private readonly DEFAULT_TIMEOUT = 10000; // 10 segundos
  private readonly DEFAULT_RETRY_COUNT = 2;
  private readonly RETRY_DELAY = 1000; // 1 segundo entre reintentos

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Configuración específica por endpoint
    const config = this.getConfigForRequest(req);

    return next.handle(req).pipe(
      timeout(config.timeout),
      catchError((error: HttpErrorResponse) => {
        // Solo reintenta en ciertos casos
        if (this.shouldRetry(error, req)) {
          this.logger.warn(`🔄 Retrying request: ${req.method} ${req.url} (${error.status})`);
          return throwError(() => error);
        }
        return throwError(() => error);
      }),
      // Reintentar con delay exponencial
      retry({
        count: config.retryCount,
        delay: (error, retryCount) => {
          this.logger.info(`⏳ Retry ${retryCount}/${config.retryCount} for ${req.url}`);
          return timer(this.RETRY_DELAY * Math.pow(2, retryCount - 1));
        },
      }),
      catchError((error: HttpErrorResponse) => {
        this.logger.error(
          `💥 Request failed after ${config.retryCount} retries: ${req.url}`,
          error
        );
        return throwError(() => error);
      })
    );
  }

  private getConfigForRequest(req: HttpRequest<unknown>): { timeout: number; retryCount: number } {
    // Configuración personalizada por endpoint
    if (req.url.includes('/character')) {
      return { timeout: 15000, retryCount: 3 }; // Más tiempo para characters
    }

    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
      return { timeout: this.DEFAULT_TIMEOUT, retryCount: 1 }; // Menos reintentos para operaciones de escritura
    }

    return { timeout: this.DEFAULT_TIMEOUT, retryCount: this.DEFAULT_RETRY_COUNT };
  }

  private shouldRetry(error: HttpErrorResponse, req: HttpRequest<unknown>): boolean {
    // No reintentar en errores del cliente (4xx) excepto algunos específicos
    if (error.status >= 400 && error.status < 500) {
      return error.status === 408 || error.status === 429; // Timeout o Rate Limit
    }

    // No reintentar operaciones de escritura en errores 5xx para evitar duplicados
    if (
      (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') &&
      error.status >= 500
    ) {
      return false;
    }

    // Reintentar errores de red y 5xx para GET
    return error.status >= 500 || error.status === 0;
  }
}
