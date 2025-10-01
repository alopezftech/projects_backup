import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { MockImageService } from './mock-image.service';
import { ApiResponse, ProcessResult } from '../interfaces/image.interface';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private readonly baseUrl: string;
  private readonly apiUrl: string;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private mockImageService: MockImageService
  ) {
    this.baseUrl = this.configService.baseUrl;
    this.apiUrl = this.configService.apiUrl;
  }

  // Checkeo de salud del backend
  checkHealth(): Observable<ApiResponse> {
    if (this.configService.useMockData) {
      return this.mockImageService.checkHealth();
    }
    return this.http.get<ApiResponse>(`${this.baseUrl}/health`);
  }

  // Obtener todas las imagenes
  getImages(): Observable<ApiResponse> {
    if (this.configService.useMockData) {
      return this.mockImageService.getImages();
    }
    return this.http.get<ApiResponse>(`${this.apiUrl}/imagenes`);
  }

  // Procesar imagenes
  processImages(processType: string): Observable<ApiResponse> {
    if (this.configService.useMockData) {
      return this.mockImageService.processImages(processType);
    }
    const body = { tipoProceso: processType };
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/imagenes/procesar`,
      body,
      this.httpOptions
    );
  }

  // Cargar imagen
  uploadImage(name: string, data: string): Observable<ApiResponse> {
    if (this.configService.useMockData) {
      return this.mockImageService.uploadImage(name, data);
    }
    const body = { nombre: name, datos: data };
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/imagenes/subir`,
      body,
      this.httpOptions
    );
  }

  // Borrar imagen
  deleteImage(id: string): Observable<ApiResponse> {
    if (this.configService.useMockData) {
      return this.mockImageService.deleteImage(id);
    }
    return this.http.delete<ApiResponse>(`${this.apiUrl}/imagenes/${id}`);
  }

  // Normalizar nombres de imágenes
  normalizeNames(): Observable<ApiResponse> {
    if (this.configService.useMockData) {
      return this.mockImageService.normalizeNames();
    }
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/imagenes/normalizar`,
      {},
      this.httpOptions
    );
  }

  // Verificación de imágenes
  verifyImages(): Observable<ApiResponse> {
    if (this.configService.useMockData) {
      return this.mockImageService.verifyImages();
    }
    return this.http.get<ApiResponse>(`${this.apiUrl}/imagenes/verificar`);
  }

  // Obtiene las imagenes sin revisar para la página de auditoría
  getUnreviewedImages(): Observable<ApiResponse> {
    if (this.configService.useMockData) {
      return this.mockImageService.getUnreviewedImages();
    }
    return this.http.get<ApiResponse>(`${this.apiUrl}/imagenes/sin-revisar`);
  }

  // Obtiene las imagenes validadas para la página de válidas
  getValidatedImages(): Observable<ApiResponse> {
    if (this.configService.useMockData) {
      return this.mockImageService.getValidatedImages();
    }
    return this.http.get<ApiResponse>(`${this.apiUrl}/imagenes/validas`);
  }

  // Obtiene las imágenes rechazadas para la página de rechazos
  getRejectedImages(): Observable<ApiResponse> {
    if (this.configService.useMockData) {
      return this.mockImageService.getRejectedImages();
    }
    return this.http.get<ApiResponse>(`${this.apiUrl}/imagenes/rechazadas`);
  }

  // Actualiza estado de una imagen (Pendiente, Válida, Rechazada)
  updateImageStatus(
    imageId: string,
    newStatus: 'Pendiente' | 'Válida' | 'Rechazada'
  ): Observable<ApiResponse> {
    if (this.configService.useMockData) {
      return this.mockImageService.updateImageStatus(imageId, newStatus);
    }
    const body = { status: newStatus };
    return this.http.put<ApiResponse>(
      `${this.apiUrl}/imagenes/${imageId}/status`,
      body,
      this.httpOptions
    );
  }

  // busca imagenes con filtros para el audit
  searchImagesWithFilters(filters: {
    faculty?: string;
    studyType?: string;
    status?: string;
  }): Observable<ApiResponse> {
    if (this.configService.useMockData) {
      return this.mockImageService.searchImagesWithFilters(filters);
    }

    let params = new URLSearchParams();

    if (filters.faculty) {
      params.append('facultad', filters.faculty);
    }
    if (filters.studyType) {
      params.append('tipoEstudio', filters.studyType);
    }
    if (filters.status) {
      params.append('status', filters.status);
    }

    const queryString = params.toString();
    const url = queryString
      ? `${this.apiUrl}/imagenes/buscar?${queryString}`
      : `${this.apiUrl}/imagenes/buscar`;

    return this.http.get<ApiResponse>(url);
  }
  
}
