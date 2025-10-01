// Configuración del entorno de producción
export const environment = {
  production: true,
  
  // En producción siempre usar el backend real
  useMockData: false,
  
  // URLs del backend en producción
  apiUrl: 'https://tu-backend-prod.com/api', // Cambiar por la URL real
  baseUrl: 'https://tu-backend-prod.com',
  
  mock: {
    networkDelay: 0,
    mockImagesCount: 0,
    statusDistribution: {}
  }
};
