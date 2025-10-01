// Configuración del entorno de desarrollo
export const environment = {
  production: false,
  
  // 🎭 Configuración del mock
  // Cambiar useMockData a false para conectar al backend real
  useMockData: true,
  
  // URLs del backend (cuando no se usa mock)
  apiUrl: 'http://localhost:3000/api',
  baseUrl: 'http://localhost:3000',
  
  // Configuraciones específicas del mock
  mock: {
    // Tiempo de latencia simulada para las peticiones (ms)
    networkDelay: 500,
    // Número de imágenes mock a generar (este se ignora ya que generamos por combinación)
    mockImagesCount: 50,
    // Distribución de estatuses para imágenes mock (todas pendientes para revisión)
    statusDistribution: {
      'Pendiente': 1.0,    // 100% pendientes (objetivo del proyecto es revisarlas)
      'Revisado': 0.0,     // 0% revisadas
      'Rechazado': 0.0     // 0% rechazadas
    }
  }
};
