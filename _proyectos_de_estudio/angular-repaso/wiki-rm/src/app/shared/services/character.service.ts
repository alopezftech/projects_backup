import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LoggerService } from '../../core/services/logger.service';

/**
 * INTERFAZ API RESPONSE - Estructura de respuesta de la API Rick & Morty
 */
interface ApiResponse {
  readonly info: {
    readonly count: number;
    readonly pages: number;
    readonly next: string | null;
    readonly prev: string | null;
  };
  readonly results: any[];
}

/**
 * CHARACTER SERVICE - Servicio para manejo de datos de personajes
 *
 * Servicio siguiendo patrones Angular 20:
 * - Dependency injection moderna con inject()
 * - Error handling robusto con LoggerService
 * - Tipos explícitos y readonly properties
 * - Observable patterns con RxJS
 *
 * RESPONSABILIDADES:
 * - Comunicación con API de Rick & Morty
 * - Transformación y normalización de datos
 * - Manejo centralizado de errores
 * - Logging estructurado de operaciones
 */
@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  // Dependency injection moderna (Angular 20)
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggerService);
  private readonly apiUrl = 'https://rickandmortyapi.com/api/character';

  /**
   * Obtiene el total de personajes disponibles en la API
   * @returns Observable con el número total de personajes
   */
  getTotalCharacters(): Observable<number> {
    this.logger.info('Fetching total characters count');

    return this.http.get<ApiResponse>(this.apiUrl).pipe(
      map(response => response.info.count),
      tap(count => this.logger.info('Total characters fetched', { count })),
      catchError(error => {
        this.logger.error('Error fetching total characters', error);
        return of(0); // Valor por defecto en caso de error
      })
    );
  }

  /**
   * Obtiene personajes con filtros opcionales
   * @param page - Página a obtener (por defecto 1)
   * @param name - Filtro de nombre (opcional)
   * @returns Observable con la respuesta completa de la API
   */
  getCharacters(page: number = 1, name?: string): Observable<ApiResponse> {
    const searchParams = { page, name: name?.trim() };
    this.logger.info('Fetching characters', searchParams);

    let url = `${this.apiUrl}?page=${page}`;

    if (name && name.trim()) {
      const encodedName = encodeURIComponent(name.trim());
      url += `&name=${encodedName}`;
      this.logger.debug('Search URL constructed', { url, originalName: name, encodedName });
    }

    return this.http.get<ApiResponse>(url).pipe(
      tap(response =>
        this.logger.info('Characters fetched successfully', {
          count: response.results.length,
          totalPages: response.info.pages,
          currentPage: page,
          searchTerm: name,
        })
      ),
      catchError(error => {
        // Log más detallado del error
        this.logger.error('API Error Details', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error,
          page,
          searchTerm: name,
          url,
        });

        // Si es 404 (no encontrado), podría ser que el personaje no existe
        if (error.status === 404) {
          this.logger.warn('No characters found for search criteria', {
            searchTerm: name,
            page,
          });

          // Para 404, retornamos estructura vacía pero válida
          return of({
            info: { count: 0, pages: 1, next: null, prev: null },
            results: [],
          });
        }

        // Para otros errores, también retornamos estructura vacía para evitar cascadas
        this.logger.error('API request failed, returning empty results', {
          status: error.status,
          searchTerm: name,
          page,
        });

        return of({
          info: { count: 0, pages: 1, next: null, prev: null },
          results: [],
        });
      })
    );
  }
}
