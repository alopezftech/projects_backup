# Proyecto de Ejemplo de Angular 20

## 📋 Descripción

Proyecto de ejemplo completo que demuestra las mejores prácticas de Angular 20 con arquitectura escalable, herramientas de desarrollo modernas y estándares profesionales para aplicaciones empresariales.

## 📚 Documentación Completa

### 📖 Guías Principales

- **[🚀 Guía de Desarrollo](./docs/DEVELOPMENT.md)** - Instrucciones paso a paso para desarrollo
- **[🏗️ Arquitectura del Proyecto](./docs/ARCHITECTURE.md)** - Diseño, patrones y flujo de datos
- **[📝 Estándares de Código](./docs/CODING_STANDARDS.md)** - Convenciones y mejores prácticas
- **[🔐 Guía de Seguridad](./docs/SECURITY.md)** - Medidas de seguridad y vulnerabilidades
- **[🚀 Guía de Deployment](./docs/DEPLOYMENT.md)** - CI/CD, Docker y deployment en la nube

### 🔍 Navegación Rápida por Temas

| Si buscas...                    | Ve a...                                                                                   |
| ------------------------------- | ----------------------------------------------------------------------------------------- |
| **Instalar y ejecutar**         | [Inicio Rápido](#-inicio-rápido)                                                          |
| **Crear componentes/servicios** | [Guía de Desarrollo - Componentes](./docs/DEVELOPMENT.md#-creación-de-nuevos-componentes) |
| **Entender la estructura**      | [Arquitectura - Estructura](./docs/ARCHITECTURE.md#-estructura-detallada)                 |
| **Configurar interceptors**     | [Desarrollo - HTTP Interceptors](./docs/DEVELOPMENT.md#-http-interceptors)                |
| **Estándares de código**        | [Estándares - Convenciones](./docs/CODING_STANDARDS.md#-convenciones-de-naming)           |
| **Testing**                     | [Desarrollo - Testing](./docs/DEVELOPMENT.md#-testing)                                    |
| **Deployment**                  | [Deployment - Ambientes](./docs/DEPLOYMENT.md#-ambientes-de-deployment)                   |
| **Seguridad**                   | [Seguridad - Implementadas](./docs/SECURITY.md#️-medidas-de-seguridad-implementadas)      |

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# Abrir en navegador: http://localhost:4200
```

## 🛠️ Comandos Principales

| Comando                | Descripción                |
| ---------------------- | -------------------------- |
| `npm start`            | Servidor de desarrollo     |
| `npm run build`        | Build para producción      |
| `npm test`             | Ejecutar tests             |
| `npm run lint`         | Verificar código           |
| `npm run code-quality` | Verificar calidad completa |

> 📖 **Para más comandos y detalles**: Ver [Guía de Desarrollo](./docs/DEVELOPMENT.md)

## ✨ Características Destacadas

### 🏗️ **Arquitectura Moderna**

- **Angular 20** con Standalone Components
- **Server-Side Rendering (SSR)** configurado
- **Arquitectura modular** con separación clara de responsabilidades
- **Barrel exports** para importaciones limpias

### 🛠️ **Herramientas de Desarrollo**

- **ESLint + Prettier** - Calidad de código automatizada
- **TypeScript Strict** - Máxima seguridad de tipos
- **Testing completo** - Karma + Jasmine con coverage
- **Scripts NPM** optimizados para desarrollo y CI/CD

### 🌐 **HTTP y Manejo de Errores**

- **3 Interceptors profesionales**:
  - `LoggingInterceptor` - Logging detallado de requests/responses
  - `RetryTimeoutInterceptor` - Reintentos automáticos y timeouts
  - `ErrorMapperInterceptor` - Mapeo centralizado de errores
- **LoggerService** centralizado con niveles de logging
- **Error handling** robusto y user-friendly

### 🎨 **Estilos y UI**

- **SCSS** con arquitectura modular
- **Variables globales** y mixins reutilizables
- **Metodología BEM** para naming consistente

> 🏗️ **Detalles de arquitectura**: Ver [Arquitectura del Proyecto](./docs/ARCHITECTURE.md)

## 📁 Estructura del Proyecto

```
src/app/
├── core/                    # 🔧 Servicios centrales
│   ├── interceptors/        # HTTP Interceptors profesionales
│   ├── services/           # LoggerService, etc.
│   ├── models/             # Interfaces y tipos
│   └── guards/             # Route Guards
├── features/               # 🎯 Funcionalidades específicas
│   └── home/               # Componente de ejemplo
├── shared/                 # 🔄 Componentes reutilizables
│   ├── components/         # UI components
│   ├── directives/         # Directivas personalizadas
│   └── pipes/              # Pipes personalizados
├── layout/                 # 🖼️ Componentes de layout
└── styles/                 # 🎨 Estilos SCSS globales
```

> 📖 **Detalles completos**: Ver [Arquitectura del Proyecto](./docs/ARCHITECTURE.md)

## � HTTP Interceptors Implementados

| Interceptor                 | Propósito             | Características                                                                 |
| --------------------------- | --------------------- | ------------------------------------------------------------------------------- |
| **LoggingInterceptor**      | Debugging y monitoreo | • Logs automáticos<br>• Métricas de performance<br>• Separación dev/prod        |
| **RetryTimeoutInterceptor** | Resiliencia de red    | • Reintentos automáticos<br>• Timeouts configurables<br>• Backoff exponencial   |
| **ErrorMapperInterceptor**  | Manejo de errores     | • Mensajes user-friendly<br>• Logging centralizado<br>• Sanitización de errores |

> 🔧 **Implementación detallada**: Ver [Guía de Desarrollo](./docs/DEVELOPMENT.md#http-interceptors)

## � Seguridad y Calidad

### ✅ **Medidas Implementadas**

- **TypeScript Strict Mode** - Máxima seguridad de tipos
- **ESLint Security Rules** - Prevención de vulnerabilidades
- **HTTP Interceptors** seguros - Manejo protegido de requests
- **Error boundaries** - Logging sin exposición de datos sensibles
- **0 vulnerabilidades** en dependencias (npm audit)

### ⚠️ **Para Implementar por Proyecto**

- Content Security Policy (CSP)
- Authentication/Authorization guards
- Input sanitization específica
- Rate limiting avanzado

> 🔐 **Guía completa**: Ver [Guía de Seguridad](./docs/SECURITY.md)

## 🚀 Deployment y CI/CD

### **Ambientes Soportados**

- **Development** - Desarrollo local con hot reload
- **Staging** - Ambiente de pruebas
- **Production** - Producción optimizada con SSR

### **Plataformas de Deployment**

- **Docker** - Containerización con multi-stage builds
- **AWS S3 + CloudFront** - Hosting estático escalable
- **Vercel/Netlify** - Deployment automático
- **CI/CD** - GitHub Actions y GitLab CI configurados

> 🚀 **Instrucciones completas**: Ver [Guía de Deployment](./docs/DEPLOYMENT.md)

## � Estado del Proyecto

### ✅ **Completado y Funcional**

- [x] Arquitectura modular escalable
- [x] HTTP Interceptors profesionales
- [x] Sistema de logging centralizado
- [x] Configuración ESLint/Prettier
- [x] Testing setup con 100% coverage
- [x] SSR configurado y optimizado
- [x] Scripts de calidad automatizados
- [x] Documentación completa

### 🎯 **Listo para Desarrollo**

Este proyecto de ejemplo está preparado para:

- **Desarrollo inmediato** - Setup completo funcionando
- **Equipos profesionales** - Estándares y herramientas establecidas
- **Escalabilidad** - Arquitectura preparada para crecimiento
- **Mantenimiento** - Documentación y testing comprehensivos

## � Próximos Pasos

**Para usar este proyecto de ejemplo:**

1. **Explorar** el código y arquitectura implementada
2. **Estudiar** los interceptors y servicios profesionales
3. **Adaptar** para necesidades específicas del proyecto
4. **Extender** con features adicionales según requerimientos
5. **Implementar** medidas de seguridad específicas si es necesario

## 🤝 Aprendizaje y Contribución

**Este proyecto sirve como:**

- 📚 **Referencia de mejores prácticas** en Angular 20
- 🏗️ **Ejemplo de arquitectura** profesional y escalable
- 🔧 **Demostración de herramientas** modernas de desarrollo
- 📖 **Documentación completa** de patrones y estándares

---

## 📄 Información del Proyecto

- **Angular Version**: 20.3.0
- **TypeScript**: 5.9.2 (Strict Mode)
- **Node.js**: 18+ requerido
- **License**: MIT

**🎯 Proyecto de ejemplo completo demostrando las mejores prácticas de Angular 20 para desarrollo profesional.**
