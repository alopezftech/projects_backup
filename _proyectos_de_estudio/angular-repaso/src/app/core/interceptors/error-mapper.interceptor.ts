import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';

/**
 * Interfaz para errores personalizados de la aplicación
 */
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date;
  url?: string;
  method?: string;
}

/**
 * Interceptor para mapear errores HTTP a errores personalizados de la aplicación.
 * Centraliza el manejo de errores y proporciona mensajes amigables al usuario.
 * Permite logging centralizado y notificaciones consistentes.
 */
@Injectable()
export class ErrorMapperInterceptor implements HttpInterceptor {
  private readonly logger = inject(LoggerService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const mappedError = this.mapHttpErrorToAppError(error, req);

        // Log del error mapeado usando LoggerService
        this.logger.error('🚨 Mapped Error:', mappedError);

        // Aquí podrías enviar el error a un servicio de logging externo
        // this.errorLoggingService.logError(mappedError);

        return throwError(() => mappedError);
      })
    );
  }

  private mapHttpErrorToAppError(
    httpError: HttpErrorResponse,
    req: HttpRequest<unknown>
  ): AppError {
    const baseError: AppError = {
      code: this.getErrorCode(httpError),
      message: this.getErrorMessage(httpError),
      timestamp: new Date(),
      url: req.url,
      method: req.method,
      details: httpError.error,
    };

    return baseError;
  }

  private getErrorCode(httpError: HttpErrorResponse): string {
    switch (httpError.status) {
      case 0:
        return 'NETWORK_ERROR';
      case 400:
        return 'BAD_REQUEST';
      case 401:
        return 'UNAUTHORIZED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'NOT_FOUND';
      case 408:
        return 'REQUEST_TIMEOUT';
      case 429:
        return 'RATE_LIMIT_EXCEEDED';
      case 500:
        return 'INTERNAL_SERVER_ERROR';
      case 502:
        return 'BAD_GATEWAY';
      case 503:
        return 'SERVICE_UNAVAILABLE';
      case 504:
        return 'GATEWAY_TIMEOUT';
      default:
        return `HTTP_${httpError.status}`;
    }
  }

  private getErrorMessage(httpError: HttpErrorResponse): string {
    // Mensajes específicos para la API de Rick and Morty
    if (httpError.url?.includes('rickandmortyapi.com')) {
      return this.getRickAndMortyErrorMessage(httpError);
    }

    // Mensajes genéricos
    switch (httpError.status) {
      case 0:
        return 'No se pudo conectar al servidor. Verifica tu conexión a internet.';
      case 400:
        return 'La solicitud contiene datos inválidos.';
      case 401:
        return 'No tienes autorización para acceder a este recurso.';
      case 403:
        return 'No tienes permisos para realizar esta acción.';
      case 404:
        return 'El recurso solicitado no fue encontrado.';
      case 408:
        return 'La solicitud tardó demasiado tiempo. Inténtalo de nuevo.';
      case 429:
        return 'Has realizado demasiadas solicitudes. Espera un momento e inténtalo de nuevo.';
      case 500:
        return 'Error interno del servidor. Inténtalo más tarde.';
      case 502:
        return 'El servidor no está disponible temporalmente.';
      case 503:
        return 'El servicio no está disponible. Inténtalo más tarde.';
      case 504:
        return 'El servidor tardó demasiado en responder.';
      default:
        return `Error inesperado (${httpError.status}). Inténtalo más tarde.`;
    }
  }

  private getRickAndMortyErrorMessage(httpError: HttpErrorResponse): string {
    switch (httpError.status) {
      case 404:
        if (httpError.url?.includes('/character/')) {
          return 'Personaje no encontrado. Puede que no exista o el ID sea incorrecto.';
        }
        if (httpError.url?.includes('/episode/')) {
          return 'Episodio no encontrado. Verifica el número de episodio.';
        }
        if (httpError.url?.includes('/location/')) {
          return 'Ubicación no encontrada. Puede que no exista o el ID sea incorrecto.';
        }
        return 'Recurso de Rick and Morty no encontrado.';
      case 500:
        return 'La API de Rick and Morty está experimentando problemas. Inténtalo más tarde.';
      default:
        return this.getErrorMessage(httpError);
    }
  }
}
