# Guía de Desarrollo

## 🎯 Filosofía de Desarrollo

Esta guía está diseñada para facilitar un desarrollo eficiente, mantenible y escalable. Se basa en principios de clean code, testing comprehensivo y automatización de procesos repetitivos. El objetivo es minimizar la fricción durante el desarrollo mientras se mantienen altos estándares de calidad.

## 🚀 Inicio Rápido

### Prerequisitos

Los prerequisitos establecidos garantizan compatibilidad con las herramientas modernas de desarrollo y las características más recientes de Angular 20.

- **Node.js 18+**: Versión LTS que incluye soporte para ES2022, mejoras en performance y características modernas de JavaScript
- **npm 9+**: Gestión avanzada de dependencias con workspaces, mejor resolución de conflictos y cache mejorado
- **Angular CLI 20+**: Herramientas de línea de comandos con soporte para standalone components, SSR optimizado y build system moderno

### Filosofía de Instalación

El proceso de instalación está optimizado para ser rápido y confiable, utilizando `npm ci` en CI/CD para instalaciones determinísticas y `npm install` para desarrollo local con flexibilidad para actualizaciones menores.

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd proyecto-ejemplo-angular-20

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

## 💻 Comandos de Desarrollo

### Filosofía de Scripts NPM

Los scripts están organizados por categoría funcional y diseñados para ser composables. Cada script tiene un propósito específico y puede combinarse con otros para workflows complejos.

### Servidor de Desarrollo

El servidor de desarrollo utiliza Webpack Dev Server con hot module replacement para una experiencia de desarrollo óptima.

```bash
npm start                    # Servidor Angular en http://localhost:4200
npm run watch               # Build en modo watch
npm run serve:ssr          # Servidor SSR en http://localhost:4000
```

**Detalles de funcionamiento:**

- **npm start**: Inicia el servidor de desarrollo con live reload, source maps completos y proxy de API configurado
- **npm run watch**: Ejecuta build incremental que recompila solo los archivos modificados, optimizado para ciclos de desarrollo rápidos
- **npm run serve:ssr**: Servidor Express que sirve la aplicación con Server-Side Rendering para testing de funcionalidades SSR en desarrollo

### Testing

El testing está diseñado para diferentes escenarios de desarrollo y CI/CD, con configuraciones optimizadas para cada uso.

```bash
npm test                   # Tests en modo watch
npm run test:ci           # Tests para CI con coverage
npm run test:headless     # Tests en modo headless
```

**Estrategia de testing:**

- **npm test**: Modo interactivo para desarrollo con auto-reexecución en cambios de archivos
- **npm run test:ci**: Ejecución única con coverage report, optimizado para pipelines de CI/CD
- **npm run test:headless**: Testing en Chrome headless para ambientes sin display gráfico

### Code Quality

Las herramientas de calidad de código están integradas para mantener consistencia y prevenir errores comunes.

```bash
npm run lint              # Ejecutar ESLint
npm run lint:fix         # Corregir errores automáticamente
npm run format           # Formatear código con Prettier
npm run format:check     # Verificar formato
npm run code-quality     # Lint + format check
npm run code-quality:fix # Lint fix + format
npm run pre-commit       # Script completo pre-commit
```

**Automatización de calidad:**

- **Linting**: ESLint con reglas específicas para Angular, TypeScript y mejores prácticas de seguridad
- **Formatting**: Prettier para formateo consistente de TypeScript, HTML, SCSS y JSON
- **Pre-commit hooks**: Verificación automática antes de cada commit para mantener calidad del repositorio

### Build

Los builds están optimizados para diferentes ambientes con configuraciones específicas para cada caso de uso.

```bash
npm run build            # Build para producción
npm run build:dev        # Build para desarrollo
npm run analyze          # Análisis de bundle size
```

**Optimizaciones de build:**

- **Producción**: Tree shaking, minificación, optimización de imágenes y código splitting automático
- **Desarrollo**: Source maps completos, sin minificación para debugging eficiente
- **Análisis**: Bundle analyzer para identificar oportunidades de optimización

## 📁 Creación de Nuevos Componentes

### Filosofía de Componentes

Los componentes en este proyecto siguen el principio de responsabilidad única y están diseñados para ser reutilizables, testables y mantenibles. Cada componente debe tener un propósito claro y una interfaz bien definida.

### 1. Feature Component

Los Feature Components encapsulan funcionalidades específicas del dominio de negocio. Son componentes de nivel superior que orquestan la interacción entre múltiples componentes más pequeños.

```bash
# Crear nuevo feature
ng generate component features/user-profile --standalone

# Estructura generada:
features/user-profile/
├── user-profile.component.ts
├── user-profile.component.html
├── user-profile.component.scss
└── user-profile.component.spec.ts
```

**Características de Feature Components:**

- **Standalone**: Utilizan la nueva arquitectura de componentes independientes de Angular
- **Lazy Loading Ready**: Preparados para carga diferida para optimizar el bundle inicial
- **Domain-Specific**: Contienen lógica específica del dominio de negocio
- **Testing Included**: Generan automáticamente archivos de test con configuración base

### 2. Shared Component

Los Shared Components son elementos de UI reutilizables que pueden utilizarse en múltiples features. Siguen principios de design system para mantener consistencia visual.

```bash
# Crear componente compartido
ng generate component shared/components/modal --standalone

# Importar directamente desde el archivo del componente
import { ModalComponent } from '@app/shared/components/modal/modal.component';
```

**Principios de Shared Components:**

- **Reusabilidad**: Diseñados para ser utilizados en múltiples contextos
- **Configurabilidad**: Aceptan inputs para personalizar comportamiento y apariencia
- **Consistencia**: Siguen guidelines de design system establecidos
- **Explicit Imports**: Facilitan la trazabilidad y el refactoring del código

### 3. Template Base para Componentes

```typescript
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggerService } from '../../core/services/logger.service';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="example">
      <h2>{{ title }}</h2>
      <!-- Component content -->
    </div>
  `,
  styleUrl: './example.component.scss',
})
export class ExampleComponent implements OnInit, OnDestroy {
  private readonly logger = inject(LoggerService);

  title = 'Example Component';

  ngOnInit(): void {
    this.logger.info('ExampleComponent initialized');
  }

  ngOnDestroy(): void {
    this.logger.info('ExampleComponent destroyed');
  }
}
```

## 🛡️ Servicios

### 1. Crear Nuevo Servicio

```bash
# Generar servicio
ng generate service core/services/api --flat

# Template base
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggerService);

  getData(): Observable<any> {
    this.logger.info('Fetching data from API');
    return this.http.get('/api/data');
  }
}
```

### 2. Añadir al Core Index

```typescript
// Importar servicios directamente desde su archivo
import { LoggerService } from '@app/core/services/logger.service';
import { ApiService } from '@app/core/services/api.service';
```

## 🔧 HTTP Interceptors

### Crear Nuevo Interceptor

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class CustomInterceptor implements HttpInterceptor {
  private readonly logger = inject(LoggerService);

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Interceptor logic
    return next.handle(req);
  }
}
```

### Registrar en App Config

```typescript
// app.config.ts
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomInterceptor } from './core/interceptors/custom.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... otros providers
    { provide: HTTP_INTERCEPTORS, useClass: CustomInterceptor, multi: true },
  ],
};
```

## 🎨 Estilos SCSS

### 1. Variables Globales

```scss
// styles/_variables.scss
$primary-color: #007bff;
$secondary-color: #6c757d;
$success-color: #28a745;
$warning-color: #ffc107;
$error-color: #dc3545;

$border-radius: 4px;
$box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
```

### 2. Mixins Útiles

```scss
// styles/_mixins.scss
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin button-style($bg-color, $text-color) {
  background-color: $bg-color;
  color: $text-color;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: $border-radius;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
}
```

### 3. Uso en Componentes

```scss
// component.scss
@import '../../styles/variables';
@import '../../styles/mixins';

.component {
  @include flex-center;

  .button {
    @include button-style($primary-color, white);
  }
}
```

## 🧪 Testing

### 1. Unit Test Template

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExampleComponent } from './example.component';
import { LoggerService } from '../../core/services/logger.service';

describe('ExampleComponent', () => {
  let component: ExampleComponent;
  let fixture: ComponentFixture<ExampleComponent>;
  let loggerSpy: jasmine.SpyObj<LoggerService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('LoggerService', ['info', 'error']);

    await TestBed.configureTestingModule({
      imports: [ExampleComponent],
      providers: [{ provide: LoggerService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
    loggerSpy = TestBed.inject(LoggerService) as jasmine.SpyObj<LoggerService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log initialization', () => {
    component.ngOnInit();
    expect(loggerSpy.info).toHaveBeenCalledWith('ExampleComponent initialized');
  });
});
```

### 2. Service Test Template

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch data', () => {
    const mockData = { id: 1, name: 'Test' };

    service.getData().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('/api/data');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
```

## 🛣️ Routing

### 1. Definir Rutas

```typescript
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'users',
    loadChildren: () => import('./features/users/users.routes').then(m => m.USERS_ROUTES),
  },
  { path: '**', redirectTo: '/404' },
];
```

### 2. Lazy Loading de Features

```typescript
// features/users/users.routes.ts
import { Routes } from '@angular/router';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./user-list/user-list.component').then(m => m.UserListComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./user-detail/user-detail.component').then(m => m.UserDetailComponent),
  },
];
```

## 🔐 Guards

### 1. Functional Guard

```typescript
// core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
```

### 2. Uso en Rutas

```typescript
// app.routes.ts
{
  path: 'dashboard',
  loadComponent: () => import('./features/dashboard/dashboard.component'),
  canActivate: [authGuard]
}
```

## 📊 State Management

### 1. Service-based State

```typescript
// core/services/user-state.service.ts
import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private readonly _users = signal<User[]>([]);
  private readonly _loading = signal(false);

  readonly users = this._users.asReadonly();
  readonly loading = this._loading.asReadonly();

  setUsers(users: User[]): void {
    this._users.set(users);
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }
}
```

## 🔧 Configuración por Ambiente

### 1. Environment Files

```typescript
// environments/environment.ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api',
  featureFlags: {
    newDashboard: true,
    betaFeatures: false,
  },
  logging: {
    level: 'debug',
    enableConsole: true,
  },
};
```

### 2. Uso en Servicios

```typescript
import { environment } from '../../../environments/environment';

@Injectable()
export class ConfigService {
  get apiUrl(): string {
    return environment.apiBaseUrl;
  }

  isFeatureEnabled(feature: string): boolean {
    return environment.featureFlags[feature] || false;
  }
}
```

## 📋 Checklist de Desarrollo

### Antes de Crear PR

- [ ] `npm run code-quality` pasa sin errores
- [ ] `npm run test:ci` todos los tests pasan
- [ ] Componentes tienen tests unitarios
- [ ] Documentación actualizada
- [ ] Imports explícitos y claros
- [ ] No hay console.log en código de producción
- [ ] Types definidos correctamente
- [ ] Error handling implementado

### Performance Checklist

- [ ] OnPush change detection donde aplicable
- [ ] TrackBy functions en \*ngFor
- [ ] Lazy loading implementado
- [ ] Images optimizadas
- [ ] Bundle size monitoreado

### Accessibility Checklist

- [ ] Alt text en imágenes
- [ ] Labels en form controls
- [ ] Keyboard navigation
- [ ] ARIA attributes
- [ ] Color contrast

## 🔍 Debugging

### 1. Angular DevTools

```bash
# Instalar extensión del navegador
# Chrome/Edge: Angular DevTools
# Firefox: Angular DevTools
```

### 2. Console Debugging

```typescript
// Temporal debugging (remover antes de commit)
console.group('Debug Component State');
console.log('Component data:', this.data);
console.log('Loading state:', this.loading);
console.groupEnd();
```

### 3. Logger Service

```typescript
// Usar LoggerService para debugging persistente
this.logger.debug('User action', { action: 'click', element: 'button' });
```

## 📚 Recursos Adicionales

- [Angular Style Guide](https://angular.io/guide/styleguide)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Angular Testing Guide](https://angular.io/guide/testing)

---

Esta guía proporciona las herramientas y patrones necesarios para desarrollo eficiente y mantenible en este proyecto de ejemplo de Angular 20.
