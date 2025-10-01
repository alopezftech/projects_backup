import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  // Configuración basada en el entorno
  public readonly useMockData = environment.useMockData;
  
  // URLs del backend
  public readonly baseUrl = environment.baseUrl;
  public readonly apiUrl = environment.apiUrl;
  
  // Configuraciones del mock
  public readonly mockConfig = environment.mock;
  
  constructor() {
    if (this.useMockData) {
      console.log('🎭 Modo MOCK activado - Sin conexiones al backend');
      console.log('📊 Configuración mock:', this.mockConfig);
    } else {
      console.log('🌐 Modo BACKEND activado - Conectando a:', this.baseUrl);
    }
  }
}
