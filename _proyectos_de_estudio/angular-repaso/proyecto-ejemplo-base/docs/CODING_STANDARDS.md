# Estándares de Código

# Estándares de Código

## 📋 Overview

Este documento define los estándares de código y mejores prácticas para mantener un código consistente, legible y mantenible en el proyecto de ejemplo de Angular 20. Los estándares establecidos aquí son el resultado de años de experiencia en desarrollo de aplicaciones empresariales y están alineados con las mejores prácticas de la comunidad Angular.

## 🎯 Principios Generales

### 1. Legibilidad

La legibilidad del código es fundamental para el mantenimiento a largo plazo y la colaboración efectiva en equipos. Un código legible reduce significativamente el tiempo necesario para entender, modificar y extender funcionalidades existentes.

- **El código debe ser autodocumentado**
  - _Definición_: El código debe expresar claramente su intención sin requerir comentarios explicativos. Los nombres de variables, funciones y clases deben describir precisamente qué hacen o representan.
- **Nombres descriptivos y significativos**
  - _Definición_: Los identificadores deben ser suficientemente descriptivos para que otro desarrollador pueda entender su propósito sin necesidad de examinar la implementación o buscar contexto adicional.
- **Funciones pequeñas y enfocadas**
  - _Definición_: Cada función debe tener una responsabilidad única y ser lo suficientemente pequeña para entenderse completamente de un vistazo. Idealmente, una función no debería exceder 20-30 líneas de código.
- **Comentarios solo cuando sea necesario**
  - _Definición_: Los comentarios deben explicar el "por qué" y no el "qué". Se utilizan para clarificar decisiones de diseño complejas, algoritmos no triviales o consideraciones de negocio que no son evidentes del código.

### 2. Consistencia

La consistencia en el código reduce la carga cognitiva y permite a los desarrolladores trabajar más eficientemente al no tener que adaptarse constantemente a diferentes estilos dentro del mismo proyecto.

- **Seguir convenciones establecidas**
  - _Definición_: Adherirse estrictamente a las convenciones de naming, estructura y formatting establecidas en este documento. La consistencia es más importante que las preferencias personales.
- **Usar herramientas de formateo automático**
  - _Definición_: Herramientas como Prettier y ESLint eliminan debates subjetivos sobre formato y garantizan que todo el código siga las mismas reglas sin intervención manual.
- **Mantener estructura de archivos uniforme**
  - _Definición_: La organización de archivos y carpetas debe seguir patrones predecibles que faciliten la navegación y localización de código específico.

### 3. Mantenibilidad

El código mantenible es aquel que puede modificarse, extenderse y debuggearse con mínimo esfuerzo y riesgo de introducir errores.

- **Separación de responsabilidades**
  - _Definición_: Cada módulo, clase o función debe tener una responsabilidad claramente definida. Esto facilita testing, debugging y modificaciones futuras.
- **Bajo acoplamiento, alta cohesión**
  - _Definición_: Los módulos deben depender mínimamente entre sí (bajo acoplamiento) pero los elementos dentro de cada módulo deben trabajar juntos hacia un objetivo común (alta cohesión).
- **Testing comprehensivo**
  - _Definición_: Todo código debe estar cubierto por tests automatizados que verifiquen tanto el comportamiento esperado como casos edge. Los tests actúan como documentación viva y red de seguridad para refactoring.
- **Refactoring continuo**
  - _Definición_: El código debe mejorarse continuamente mediante refactoring para mantener su calidad. Esto incluye simplificación de lógica compleja, eliminación de código duplicado y actualización de patrones obsoletos.

## 📝 Convenciones de Naming

### Filosofía de Naming

Las convenciones de naming son cruciales para la comunicación efectiva en el código. Un buen naming elimina ambigüedades, reduce el tiempo de comprensión y facilita la búsqueda y navegación en el codebase. Las convenciones establecidas aquí siguen estándares de la industria y mejores prácticas de Angular.

### 1. Archivos y Directorios

La nomenclatura de archivos y directorios debe ser predictible y expresar claramente el contenido y propósito de cada elemento.

```
kebab-case para nombres de archivos:
✅ user-profile.component.ts
✅ api-config.service.ts
❌ UserProfile.component.ts
❌ apiConfig.service.ts

PascalCase para nombres de clases:
✅ UserProfileComponent
✅ ApiConfigService
❌ userProfileComponent
❌ apiConfigService
```

**Justificación técnica:**

- **kebab-case**: Compatible con sistemas de archivos case-sensitive y case-insensitive, evita conflictos en diferentes sistemas operativos
- **PascalCase para clases**: Sigue convenciones de TypeScript/JavaScript y facilita la diferenciación entre clases y otras entidades
- **Consistencia**: Permite búsquedas predictibles y auto-completado efectivo en IDEs

### 2. Variables y Funciones

Las variables y funciones deben expresar claramente su propósito y contenido, facilitando la comprensión del flujo de datos y lógica de la aplicación.

```typescript
// camelCase para variables y funciones
✅ const userName = 'John';
✅ function getUserData() {}
❌ const user_name = 'John';
❌ function get_user_data() {}

// Nombres descriptivos
✅ const isUserAuthenticated = true;
✅ const userAccountBalance = 1000;
❌ const flag = true;
❌ const data = 1000;
```

**Principios aplicados:**

- **Expresividad**: Los nombres deben revelar la intención sin necesidad de examinar el contexto
- **Precisión**: Evitar términos genéricos como 'data', 'info', 'item' cuando se puede ser más específico
- **Consistencia**: Usar la misma terminología para conceptos similares en toda la aplicación

### 3. Constantes

Las constantes representan valores inmutables y configuraciones que deben ser fácilmente identificables y modificables.

```typescript
// SCREAMING_SNAKE_CASE para constantes
✅ const MAX_RETRY_ATTEMPTS = 3;
✅ const API_BASE_URL = 'https://api.example.com';
❌ const maxRetryAttempts = 3;
❌ const apiBaseUrl = 'https://api.example.com';
```

**Beneficios del convención:**

- **Visibilidad**: Las constantes son fácilmente identificables en el código
- **Configuración**: Facilita la localización de valores que pueden necesitar ajustes
- **Inmutabilidad**: La convención visual refuerza el concepto de que estos valores no deben cambiar

### 4. Interfaces y Types

Los tipos e interfaces definen contratos en el código y deben expresar claramente la estructura y propósito de los datos que representan.

```typescript
// PascalCase con sufijo descriptivo
✅ interface UserProfile {}
✅ interface ApiResponse<T> {}
✅ type UserRole = 'admin' | 'user' | 'guest';
❌ interface userProfile {}
❌ interface IUserProfile {} // No usar prefijo I
```

**Directrices de diseño:**

- **Claridad conceptual**: Los nombres deben reflejar el dominio de negocio
- **Evitar prefijos técnicos**: 'I' para interfaces es redundante en TypeScript
- **Sufijos descriptivos**: Cuando es apropiado, usar sufijos como 'Config', 'Options', 'Response' para clarificar el propósito

## 🧩 Estructura de Componentes

### 1. Template Base

```typescript
import { Component, OnInit, OnDestroy, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { LoggerService } from '../../core/services/logger.service';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="example">
      <!-- Template content -->
    </div>
  `,
  styleUrl: './example.component.scss',
})
export class ExampleComponent implements OnInit, OnDestroy {
  // 1. Dependency injection
  private readonly logger = inject(LoggerService);
  private readonly destroy$ = new Subject<void>();

  // 2. Inputs (usando signal inputs de Angular 17+)
  readonly data = input<any>();
  readonly config = input<Configuration>();

  // 3. Outputs
  readonly userAction = output<string>();
  readonly dataChange = output<any>();

  // 4. Public properties
  title = 'Example Component';
  isLoading = false;

  // 5. Private properties
  private readonly defaultConfig: Configuration = {};

  // 6. Lifecycle hooks
  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // 7. Public methods
  onUserClick(): void {
    this.userAction.emit('click');
  }

  // 8. Private methods
  private initializeComponent(): void {
    this.logger.info('Component initialized');
  }
}
```

### 2. Orden de Propiedades

```typescript
export class ExampleComponent {
  // 1. Static properties
  static readonly componentName = 'ExampleComponent';

  // 2. Dependency injection
  private readonly service = inject(ExampleService);

  // 3. Inputs
  readonly data = input<any>();

  // 4. Outputs
  readonly change = output<any>();

  // 5. ViewChild/ContentChild
  @ViewChild('template') template!: TemplateRef<any>;

  // 6. Public properties
  title = '';
  items: Item[] = [];

  // 7. Private properties
  private readonly destroy$ = new Subject<void>();
}
```

## 🛠️ Servicios

### 1. Estructura de Servicios

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // 1. Dependency injection
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggerService);

  // 2. Private state
  private readonly _users$ = new BehaviorSubject<User[]>([]);
  private readonly baseUrl = '/api/users';

  // 3. Public readonly observables
  readonly users$ = this._users$.asObservable();

  // 4. Public methods
  getUsers(): Observable<User[]> {
    this.logger.info('Fetching users');
    return this.http.get<User[]>(this.baseUrl);
  }

  createUser(user: CreateUserRequest): Observable<User> {
    this.logger.info('Creating user', { userId: user.id });
    return this.http.post<User>(this.baseUrl, user);
  }

  // 5. Private methods
  private updateUsersState(users: User[]): void {
    this._users$.next(users);
  }
}
```

### 2. Error Handling en Servicios

```typescript
getUserById(id: string): Observable<User> {
  return this.http.get<User>(`${this.baseUrl}/${id}`).pipe(
    tap(user => this.logger.info('User fetched', { userId: id })),
    catchError(error => {
      this.logger.error('Failed to fetch user', error);
      return throwError(() => new Error(`User ${id} not found`));
    })
  );
}
```

## 🎨 Estilos SCSS

### 1. Estructura de Archivos

```scss
// component.scss
@use '../../styles/variables' as vars;
@use '../../styles/mixins' as mixins;

.component {
  // 1. Layout properties
  display: flex;
  flex-direction: column;

  // 2. Box model
  padding: vars.$spacing-md;
  margin: 0;
  border: 1px solid vars.$border-color;

  // 3. Typography
  font-family: vars.$font-family-primary;
  font-size: vars.$font-size-base;

  // 4. Visual
  background-color: vars.$background-color;
  border-radius: vars.$border-radius;

  // 5. Animation
  transition: all 0.3s ease;

  // 6. Nested elements
  &__header {
    @include mixins.flex-center;
    margin-bottom: vars.$spacing-sm;
  }

  &__content {
    flex: 1;
  }

  // 7. Modifiers
  &--highlighted {
    background-color: vars.$primary-color;
  }

  // 8. State selectors
  &:hover {
    opacity: 0.8;
  }

  &:focus {
    outline: 2px solid vars.$focus-color;
  }
}
```

### 2. Nomenclatura BEM

```scss
// Block
.user-card {
}

// Element
.user-card__header {
}
.user-card__avatar {
}
.user-card__name {
}
.user-card__actions {
}

// Modifier
.user-card--premium {
}
.user-card--disabled {
}
.user-card__avatar--large {
}
```

## 📊 TypeScript

### 1. Types y Interfaces

```typescript
// Interfaces para objetos
interface User {
  readonly id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt?: Date;
}

// Types para unions y primitivos
type UserRole = 'admin' | 'user' | 'guest';
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Utility types
type CreateUserRequest = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
type UserSummary = Pick<User, 'id' | 'name' | 'email'>;
```

### 2. Funciones

```typescript
// Explicit return types para funciones públicas
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Arrow functions para callbacks y métodos simples
const filterActiveUsers = (users: User[]): User[] =>
  users.filter(user => user.isActive);

// Async/await sobre Promises
async loadUserData(userId: string): Promise<User> {
  try {
    const user = await this.userService.getUser(userId).toPromise();
    return user;
  } catch (error) {
    this.logger.error('Failed to load user', error);
    throw error;
  }
}
```

### 3. Guards de Tipo

```typescript
// Type guards
function isUser(obj: any): obj is User {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string';
}

// Uso de type guards
function processUserData(data: unknown): void {
  if (isUser(data)) {
    // TypeScript sabe que data es User aquí
    console.log(data.name);
  }
}
```

## 🧪 Testing

### 1. Nomenclatura de Tests

```typescript
describe('UserService', () => {
  describe('getUsers', () => {
    it('should return list of users when API call succeeds', () => {
      // Test implementation
    });

    it('should handle empty response from API', () => {
      // Test implementation
    });

    it('should throw error when API call fails', () => {
      // Test implementation
    });
  });

  describe('createUser', () => {
    it('should create user with valid data', () => {
      // Test implementation
    });

    it('should validate required fields before creating user', () => {
      // Test implementation
    });
  });
});
```

### 2. Estructura de Tests

```typescript
describe('Component', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let mockService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    // 1. Create spies
    const spy = jasmine.createSpyObj('UserService', ['getUsers']);

    // 2. Configure TestBed
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [{ provide: UserService, useValue: spy }],
    }).compileComponents();

    // 3. Create component
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    mockService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## 📋 ESLint Rules

### 1. Reglas Habilitadas

```javascript
// eslint.config.js (principales reglas)
rules: {
  // Angular
  '@angular-eslint/component-selector': ['error', { prefix: 'app', style: 'kebab-case' }],
  '@angular-eslint/directive-selector': ['error', { prefix: 'app', style: 'camelCase' }],
  '@angular-eslint/use-lifecycle-interface': 'error',

  // TypeScript
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/no-unused-vars': 'error',
  '@typescript-eslint/explicit-function-return-type': 'off',

  // General
  'no-console': 'warn',
  'no-debugger': 'error',
  'eqeqeq': ['error', 'always'],
  'curly': ['error', 'all'],
}
```

## 📖 Documentación

### 1. JSDoc para Funciones Públicas

````typescript
/**
 * Calculates the total price of items in the cart
 * @param items - Array of cart items
 * @param discountPercent - Discount percentage (0-100)
 * @returns Total price after discount
 * @example
 * ```typescript
 * const total = calculateCartTotal(items, 10); // 10% discount
 * ```
 */
function calculateCartTotal(items: CartItem[], discountPercent: number = 0): number {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return subtotal * (1 - discountPercent / 100);
}
````

### 2. Comentarios en Código

```typescript
// ✅ Buen comentario - explica el "por qué"
// Using setTimeout to ensure DOM is updated before measuring
setTimeout(() => this.measureElementHeight(), 0);

// ❌ Mal comentario - explica el "qué" (obvio del código)
// Increment counter by 1
counter++;

// ✅ Comentario para código complejo
// Binary search algorithm to find insertion point
// Complexity: O(log n)
let left = 0;
let right = array.length - 1;
```

## 🔧 Configuración del Editor

### 1. VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "angular.experimental-ivy": true
}
```

### 2. Extensiones Recomendadas

- Angular Language Service
- ESLint
- Prettier
- Auto Rename Tag
- Angular Snippets

## ✅ Checklist de Code Review

### General

- [ ] Código sigue convenciones de naming
- [ ] No hay código muerto o comentado
- [ ] Funciones tienen responsabilidad única
- [ ] Error handling implementado
- [ ] Tests cubren casos principales

### Angular Específico

- [ ] Componentes usan OnPush cuando es posible
- [ ] Subscriptions se desuscriben correctamente
- [ ] Inputs/Outputs tipados correctamente
- [ ] Lifecycle hooks implementados según necesidad

### Performance

- [ ] No hay operaciones costosas en templates
- [ ] TrackBy functions en \*ngFor
- [ ] Lazy loading implementado donde corresponde
- [ ] Bundle size no incrementa significativamente

### Seguridad

- [ ] No hay datos sensibles en código
- [ ] Inputs validados y sanitizados
- [ ] No uso de innerHTML sin sanitización
- [ ] HTTPS usado para todas las APIs

---

Estos estándares aseguran código consistente, mantenible y de alta calidad en todo el proyecto.
