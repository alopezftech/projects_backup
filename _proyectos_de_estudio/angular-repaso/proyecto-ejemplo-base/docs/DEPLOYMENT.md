# Guía de Deployment

## 🚀 Overview

Esta guía detalla los procesos y mejores prácticas para el deployment del proyecto de ejemplo de Angular 20 en diferentes ambientes. El deployment moderno de aplicaciones Angular requiere consideraciones específicas para optimización, seguridad, escalabilidad y monitoreo. Esta guía cubre desde builds locales hasta deployments en producción con CI/CD completo.

## 🏗️ Build Process

### Filosofía de Build

El proceso de build está diseñado para optimizar la aplicación para diferentes ambientes, aplicando transformaciones específicas que mejoran la performance, seguridad y mantenibilidad. Cada configuración de build tiene objetivos específicos y aplica optimizaciones apropiadas.

### 1. Build para Producción

Los builds de producción priorizan performance, seguridad y tamaño de bundle, aplicando todas las optimizaciones disponibles.

```bash
# Build estándar para producción
npm run build

# Build con SSR para producción
npm run build:ssr

# Análisis de bundle size
npm run analyze
```

**Optimizaciones aplicadas en producción:**

- **Tree Shaking**: Eliminación automática de código no utilizado, reduciendo significativamente el tamaño del bundle
- **Code Splitting**: División automática del código en chunks que se cargan bajo demanda
- **Minificación**: Compresión de JavaScript, CSS y HTML para reducir el tamaño de transferencia
- **Source Map Generation**: Generación de source maps optimizados para debugging en producción sin exponer código fuente

### 2. Configuración de Build

La configuración de build utiliza Angular CLI con configuraciones específicas para cada ambiente, permitiendo optimizaciones granulares.

```json
// angular.json - configuración de build
"configurations": {
  "production": {
    "budgets": [
      {
        "type": "initial",
        "maximumWarning": "500kB",
        "maximumError": "1MB"
      },
      {
        "type": "anyComponentStyle",
        "maximumWarning": "4kB",
        "maximumError": "8kB"
      }
    ],
    "outputHashing": "all",
    "optimization": true,
    "extractLicenses": true,
    "sourceMap": false,
    "namedChunks": false
  }
}
```

**Configuraciones críticas explicadas:**

- **Budget Monitoring**: Los budgets previenen el crecimiento descontrolado del bundle, alertando cuando los tamaños exceden límites establecidos
- **Output Hashing**: Genera hashes únicos para archivos estáticos, permitiendo caching agresivo mientras se garantiza que los cambios se reflejen inmediatamente
- **License Extraction**: Extrae información de licencias a archivos separados para cumplimiento legal y auditoría de dependencias

### 3. Optimizaciones de Build

Las optimizaciones de build van más allá de la configuración básica, implementando técnicas avanzadas para mejorar la experiencia del usuario.

```typescript
// app.config.ts - configuración para producción
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    // Providers optimizados para producción
    provideRouter(
      routes,
      withPreloading(PreloadAllModules), // Preload para mejor performance
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),

    // HTTP client optimizado
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch() // Usa Fetch API para mejor performance en SSR
    ),

    // Configuración de ambiente
    { provide: 'ENVIRONMENT', useValue: environment },
  ],
};
```

**Estrategias de optimización:**

- **Module Preloading**: Carga proactiva de módulos que probablemente serán necesarios, mejorando la perceived performance
- **Fetch API Integration**: Utilización de la API Fetch nativa para mejor performance en SSR y mayor compatibilidad
- **Environment Injection**: Inyección de configuración de ambiente que permite optimizaciones específicas por entorno

## 🌐 Ambientes de Deployment

### Filosofía de Ambientes

La gestión de múltiples ambientes permite testing riguroso, validación de features y deployment seguro a producción. Cada ambiente tiene configuraciones específicas que reflejan diferentes etapas del ciclo de vida de desarrollo.

### 1. Development

El ambiente de desarrollo está optimizado para velocidad de iteración y debugging comprehensivo.

```bash
# Variables de entorno
NODE_ENV=development
API_URL=http://localhost:3000/api
DEBUG_MODE=true

# Comando de deployment
npm run build:dev
npm run serve:dev
```

**Características del ambiente de desarrollo:**

- **Hot Module Replacement**: Recarga instantánea de módulos modificados sin perder estado de aplicación
- **Source Maps Completos**: Mapeos detallados para debugging preciso en herramientas de desarrollo
- **API Mocking**: Capacidad de usar APIs mock para desarrollo independiente del backend
- **Logging Verbose**: Información detallada de debugging y performance metrics

### 2. Staging

El ambiente de staging replica producción lo más fielmente posible para testing final antes del release.

```bash
# Variables de entorno
NODE_ENV=staging
API_URL=https://api-staging.example.com
DEBUG_MODE=false
ANALYTICS_ENABLED=false

# Comando de deployment
npm run build:staging
```

**Propósito del ambiente de staging:**

- **Production Simulation**: Configuración idéntica a producción pero con datos de prueba
- **Integration Testing**: Validación de integración con sistemas externos reales
- **Performance Testing**: Evaluación de performance bajo condiciones similares a producción
- **User Acceptance Testing**: Ambiente seguro para testing por stakeholders no técnicos

### 3. Production

El ambiente de producción está optimizado para performance, seguridad y confiabilidad máximas.

```bash
# Variables de entorno
NODE_ENV=production
API_URL=https://api.example.com
DEBUG_MODE=false
ANALYTICS_ENABLED=true
CDN_URL=https://cdn.example.com

# Comando de deployment
npm run build
```

**Optimizaciones de producción:**

- **Asset Optimization**: Compresión, minificación y optimización de imágenes
- **CDN Integration**: Distribución de assets estáticos a través de redes de distribución global
- **Caching Strategies**: Implementación de estrategias de caching agresivas para performance
- **Monitoring Integration**: Integración con herramientas de monitoreo y alertas

## 🐳 Docker Deployment

### 1. Dockerfile Multi-stage

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built app
COPY --from=builder /app/dist/proyecto-ejemplo-angular-20 /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Security headers
COPY security-headers.conf /etc/nginx/conf.d/security-headers.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 2. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  angular-app:
    build:
      context: .
      target: production
    ports:
      - '80:80'
    environment:
      - NODE_ENV=production
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    restart: unless-stopped

  # SSL termination
  nginx-proxy:
    image: nginxproxy/nginx-proxy
    ports:
      - '443:443'
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - ./certs:/etc/nginx/certs
    restart: unless-stopped
```

### 3. Nginx Configuration

```nginx
# nginx.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Security headers
    include /etc/nginx/conf.d/security-headers.conf;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Angular routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### 4. Security Headers

```nginx
# security-headers.conf
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:;" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

## ☁️ Cloud Deployment

### 1. AWS S3 + CloudFront

```bash
# Build y subir a S3
npm run build
aws s3 sync dist/proyecto-ejemplo-angular-20 s3://my-app-bucket --delete

# Invalidar cache de CloudFront
aws cloudfront create-invalidation --distribution-id E1234567890 --paths "/*"
```

```json
// deploy-aws.json - Script de deployment
{
  "scripts": {
    "deploy:aws": "npm run build && aws s3 sync dist/proyecto-ejemplo-angular-20 s3://$AWS_S3_BUCKET --delete && aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths '/*'"
  }
}
```

### 2. Vercel Deployment

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/proyecto-ejemplo-angular-20"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### 3. Netlify Deployment

```toml
# netlify.toml
[build]
  publish = "dist/proyecto-ejemplo-angular-20"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

## 🔄 CI/CD Pipeline

### 1. GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npm run code-quality
      - run: npm run test:ci

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/

      - name: Deploy to S3
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          aws s3 sync dist/proyecto-ejemplo-angular-20 s3://${{ secrets.S3_BUCKET }} --delete
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_ID }} --paths "/*"
```

### 2. GitLab CI/CD

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: '18'

cache:
  paths:
    - node_modules/

test:
  stage: test
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run code-quality
    - npm run test:ci
  artifacts:
    reports:
      coverage: coverage/lcov.info

build:
  stage: build
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

deploy_production:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache aws-cli
  script:
    - aws s3 sync dist/proyecto-ejemplo-angular-20 s3://$S3_BUCKET --delete
    - aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*"
  only:
    - main
```

## 📊 Monitoreo y Performance

### 1. Performance Monitoring

```typescript
// core/services/performance.service.ts
@Injectable({
  providedIn: 'root',
})
export class PerformanceService {
  private readonly logger = inject(LoggerService);

  measurePageLoad(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming;

        this.logger.info('Page Performance', {
          loadTime: perfData.loadEventEnd - perfData.fetchStart,
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
          firstContentfulPaint: this.getFirstContentfulPaint(),
        });
      });
    }
  }

  private getFirstContentfulPaint(): number {
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
    return fcpEntry ? fcpEntry.startTime : 0;
  }
}
```

### 2. Error Monitoring

```typescript
// core/services/error-reporting.service.ts
@Injectable({
  providedIn: 'root',
})
export class ErrorReportingService {
  private readonly logger = inject(LoggerService);
  private readonly environment = inject('ENVIRONMENT');

  reportError(error: Error, context?: any): void {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      context,
    };

    // En producción, enviar a servicio de monitoreo
    if (this.environment.production) {
      this.sendToErrorService(errorReport);
    } else {
      this.logger.error('Application Error', errorReport);
    }
  }

  private sendToErrorService(errorReport: any): void {
    // Integración con Sentry, LogRocket, etc.
    // fetch('/api/errors', {
    //   method: 'POST',
    //   body: JSON.stringify(errorReport)
    // });
  }
}
```

## 🔧 Environment Configuration

### 1. Environment Files

```typescript
// environments/environment.prod.ts
export const environment = {
  production: true,
  apiBaseUrl: 'https://api.example.com',

  // Feature flags
  featureFlags: {
    newDashboard: true,
    betaFeatures: false,
  },

  // Analytics
  analytics: {
    googleAnalyticsId: 'GA_TRACKING_ID',
    hotjarId: 'HOTJAR_ID',
  },

  // Performance
  performance: {
    enableTracking: true,
    sampleRate: 0.1,
  },

  // Security
  security: {
    enableCSP: true,
    apiTimeout: 10000,
  },
};
```

### 2. Runtime Configuration

```typescript
// core/services/config.service.ts
@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: any;

  async loadConfig(): Promise<void> {
    try {
      // Cargar configuración desde endpoint
      const response = await fetch('/assets/config.json');
      this.config = await response.json();
    } catch (error) {
      console.warn('Failed to load runtime config, using defaults');
      this.config = {};
    }
  }

  get(key: string, defaultValue?: any): any {
    return this.config[key] ?? defaultValue;
  }
}

// app.config.ts - Inicializar configuración
export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: ConfigService) => () => configService.loadConfig(),
      deps: [ConfigService],
      multi: true,
    },
  ],
};
```

## 📋 Deployment Checklist

### Pre-deployment

- [ ] Tests pasan (`npm run test:ci`)
- [ ] Code quality checks pasan (`npm run code-quality`)
- [ ] Build exitoso sin warnings
- [ ] Bundle size dentro de límites
- [ ] Environment variables configuradas
- [ ] Security headers configurados

### Deployment

- [ ] Backup de versión anterior
- [ ] Deploy a staging primero
- [ ] Smoke tests en staging
- [ ] Deploy a producción
- [ ] Verificar health checks
- [ ] Cache invalidation si es necesario

### Post-deployment

- [ ] Verificar funcionalidad crítica
- [ ] Monitorear logs de errores
- [ ] Verificar métricas de performance
- [ ] Rollback plan disponible
- [ ] Notificar al equipo

## 🚨 Rollback Strategy

### 1. Automated Rollback

```bash
# Script de rollback automático
#!/bin/bash
PREVIOUS_VERSION=$(aws s3api list-object-versions --bucket $S3_BUCKET --prefix index.html --query 'Versions[1].VersionId' --output text)

if [ "$PREVIOUS_VERSION" != "None" ]; then
  aws s3api restore-object --bucket $S3_BUCKET --key index.html --version-id $PREVIOUS_VERSION
  aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*"
  echo "Rollback completed to version: $PREVIOUS_VERSION"
else
  echo "No previous version found"
  exit 1
fi
```

### 2. Blue-Green Deployment

```yaml
# docker-compose.blue-green.yml
version: '3.8'

services:
  app-blue:
    build: .
    ports:
      - '8001:80'
    environment:
      - ENVIRONMENT=blue

  app-green:
    build: .
    ports:
      - '8002:80'
    environment:
      - ENVIRONMENT=green

  load-balancer:
    image: nginx
    ports:
      - '80:80'
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf
    depends_on:
      - app-blue
      - app-green
```

---

Esta guía proporciona un framework completo para deployment seguro y confiable del proyecto de ejemplo de Angular 20 en múltiples ambientes y plataformas.
