# 🎭 Sistema de Mock para Imágenes

Este proyecto incluye un sistema completo de mock para desacoplar los datos del backend y permitir el desarrollo sin conexión a base de datos.

## 🚀 Cómo usar el Mock

### Activar/Desactivar el Mock

1. **Para activar el mock** (modo desarrollo):
   - Editar `src/environments/environment.ts`
   - Cambiar `useMockData: true`

2. **Para usar el backend real**:
   - Editar `src/environments/environment.ts`
   - Cambiar `useMockData: false`

### Configuración del Mock

En `src/environments/environment.ts` puedes configurar:

```typescript
mock: {
  // Tiempo de latencia simulada para las peticiones (ms)
  networkDelay: 500,
  
  // Número de imágenes mock a generar
  mockImagesCount: 50,
  
  // Distribución de estatuses para imágenes mock
  statusDistribution: {
    'Pendiente': 0.6,    // 60% pendientes
    'Revisado': 0.3,     // 30% revisadas  
    'Rechazado': 0.1     // 10% rechazadas
  }
}
```

## 🔧 Funcionalidades Mock

El mock incluye:

- ✅ Generación automática de imágenes blob con colores aleatorios
- ✅ Datos realistas para facultades y tipos de estudio
- ✅ Simulación de latencia de red configurable
- ✅ Filtrado completo por facultad, tipo de estudio y status
- ✅ Generación de fechas aleatorias
- ✅ Tamaños de archivo simulados
- ✅ Todas las operaciones CRUD (crear, leer, actualizar, eliminar)

## 📊 Datos Generados

El mock genera automáticamente:

- **50 imágenes** por defecto (configurable)
- **11 facultades** diferentes
- **9 tipos de estudio** diferentes  
- **3 estatuses**: Pendiente, Revisado, Rechazado
- **Imágenes blob** generadas dinámicamente con Canvas API
- **Fechas aleatorias** entre enero 2024 y hoy

## 🔄 Alternancia entre Mock y Backend

La arquitectura permite cambiar fácilmente entre mock y backend real:

1. **AppService** detecta automáticamente el modo configurado
2. **ConfigService** centraliza toda la configuración
3. **MockImageService** proporciona todos los métodos de la API
4. **Sin cambios** necesarios en componentes

## 🎯 Ventajas del Mock

- **💰 Sin costes** de backend durante desarrollo
- **⚡ Desarrollo rápido** sin dependencias externas
- **🧪 Datos consistentes** para testing
- **🔧 Configuración flexible** por entorno
- **📱 Desarrollo offline** completo

## 🚦 Estados de Imagen

El mock simula tres estados:
- **Pendiente**: Imágenes que necesitan revisión (60%)
- **Revisado**: Imágenes ya procesadas (30%)
- **Rechazado**: Imágenes descartadas (10%)

## 💡 Consejos de Uso

1. **Durante desarrollo**: Usar mock para implementar funcionalidades
2. **Para testing**: Ajustar `mockImagesCount` según necesidades
3. **Para demos**: Usar latencia baja (`networkDelay: 100`)
4. **Para producción**: Automáticamente usa backend real

## 🔍 Ejemplo de Filtrado

El mock soporta filtrado completo:
```typescript
// Buscar imágenes de Medicina con status Pendiente
buscarImagenesConFiltros({
  facultad: 'Medicina',
  status: 'Pendiente'
})
```

## 📝 Logs del Mock

El mock incluye logs detallados con el prefijo 🎭 para facilitar el debugging:

- `🎭 Modo MOCK activado`
- `🎭 Mock generado: X imágenes`
- `🎭 Mock: Buscando imágenes con filtros`
- `🎭 Mock: Encontradas X imágenes`
