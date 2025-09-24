import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * LoggerService - Servicio centralizado para logging
 *
 * Este servicio maneja todos los logs de la aplicación de forma centralizada.
 * En producción, los logs se pueden enviar a servicios externos como LogRocket, Sentry, etc.
 * En desarrollo, los logs se muestran en consola con formato mejorado.
 */
@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private readonly isDevelopment = !environment.production;
  private readonly showResponseBody = environment.showResponseBody;

  /**
   * Permite cambiar dinámicamente si se muestra el body de la response
   */
  setShowResponseBody(show: boolean) {
    if (typeof window !== 'undefined') {
      (window as any).SHOW_RESPONSE_BODY = show;
    }
  }

  /**
   * Log de información general
   */
  info(message: string, data?: unknown): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.info(`[INFO] ${message}`, data || '');
    }
    // En producción: enviar a servicio de logging externo
  }

  /**
   * Log de advertencias
   */
  warn(message: string, data?: unknown): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.warn(`[WARN] ${message}`, data || '');
    }
    // En producción: enviar a servicio de logging externo
  }

  /**
   * Log de errores
   */
  error(message: string, error?: unknown): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.error(`[ERROR] ${message}`, error || '');
    }
    // En producción: enviar a servicio de error tracking (Sentry, etc.)
  }

  /**
   * Log de debugging - solo en desarrollo
   */
  debug(message: string, data?: unknown): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  }

  /**
   * Log de peticiones HTTP - para interceptors
   */
  http(method: string, url: string, data?: unknown): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.group(`🚀 HTTP ${method} ${url}`);
      if (data) {
        // eslint-disable-next-line no-console
        console.log('Data:', data);
      }
      // eslint-disable-next-line no-console
      console.groupEnd();
    }
  }

  /**
   * Log de respuestas HTTP - para interceptors
   */
  httpResponse(
    method: string,
    url: string,
    status: number,
    duration: number,
    data?: unknown
  ): void {
    if (this.isDevelopment) {
      const emoji = status >= 200 && status < 300 ? '✅' : '❌';
      console.group(`${emoji} HTTP ${method} ${url} - ${status} (${duration}ms)`);
      if (this.showResponseBody && data) {
        console.log('Response:', data);
      } else {
        console.log(`Petición completada (${status}) en ${duration}ms`);
      }
      console.groupEnd();
    }
  }

  /**
   * Log de errores HTTP - para interceptors
   */
  httpError(method: string, url: string, status: number, duration: number, error: unknown): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.group(`❌ HTTP Error ${method} ${url} - ${status} (${duration}ms)`);
      // eslint-disable-next-line no-console
      console.error('Error:', error);
      // eslint-disable-next-line no-console
      console.groupEnd();
    }
    // En producción: enviar a servicio de error tracking
  }
}
