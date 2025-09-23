# Guía de Seguridad

## 🔒 Overview

Esta guía define las medidas de seguridad implementadas y recomendadas para el proyecto de ejemplo de Angular 20, siguiendo las mejores prácticas de seguridad para aplicaciones frontend. La seguridad en aplicaciones web modernas requiere un enfoque multicapa que aborde vulnerabilidades tanto en el código como en la infraestructura de deployment.

## 🛡️ Medidas de Seguridad Implementadas

### Filosofía de Seguridad por Capas

La seguridad implementada en este proyecto sigue el principio de "defensa en profundidad", donde múltiples capas de protección trabajan en conjunto para crear un sistema robusto contra amenazas diversas. Cada capa tiene un propósito específico y complementa las demás.

### ✅ 1. TypeScript Strict Mode

TypeScript Strict Mode es la primera línea de defensa contra errores que pueden llevar a vulnerabilidades de seguridad. Al enforcer tipado estricto, se previenen muchas categorías de errores comunes.

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true, // Habilita todas las verificaciones estrictas
    "noImplicitOverride": true, // Requiere override explícito
    "noPropertyAccessFromIndexSignature": true, // Previene acceso no seguro a propiedades
    "noImplicitReturns": true, // Requiere return explícito
    "noFallthroughCasesInSwitch": true // Previene fallthrough en switch
  }
}
```

**Beneficios de seguridad:**

- **Prevención de errores en tiempo de compilación**
  - _Definición_: El compilador de TypeScript detecta potenciales problemas antes de que el código llegue a producción, incluyendo accesos a propiedades undefined que podrían ser explotados por atacantes.

- **Detección temprana de tipos incorrectos**
  - _Definición_: Los tipos incorrectos pueden llevar a comportamientos inesperados que pueden ser explotados. El tipado estricto asegura que los datos fluyan de forma predecible a través de la aplicación.

- **Mayor confiabilidad del código**
  - _Definición_: Un código más confiable es más seguro. Al eliminar ambigüedades de tipos, se reduce la superficie de ataque y se facilita el análisis de seguridad del código.

### ✅ 2. ESLint Security Rules

ESLint con reglas de seguridad específicas proporciona análisis estático automatizado para detectar patrones de código potencialmente peligrosos.

```javascript
// eslint.config.js
rules: {
  // Previene uso de eval()
  'no-eval': 'error',

  // Previene console.log en producción
  'no-console': 'warn',

  // Requiere comparaciones estrictas
  'eqeqeq': ['error', 'always'],

  // Angular specific security
  '@angular-eslint/template/no-autofocus': 'error',
  '@angular-eslint/template/no-positive-tabindex': 'error',
}
```

**Protecciones implementadas:**

- **Prevención de inyección de código**: La regla `no-eval` previene el uso de `eval()` y constructores similares que pueden ejecutar código arbitrario
- **Protección de accesibilidad**: Las reglas de Angular previenen problemas de accesibilidad que pueden ser vectores de ataque o problemas de usabilidad
- **Comparaciones seguras**: `eqeqeq` previene comparaciones loose que pueden llevar a bypasses de validación

### ✅ 3. HTTP Interceptors de Seguridad

Los interceptors HTTP implementan capas de seguridad que protegen todas las comunicaciones de la aplicación con servicios externos.

#### Error Mapping Interceptor

El Error Mapping Interceptor previene la exposición de información sensible a través de mensajes de error, implementando el principio de "fail securely".

```typescript
@Injectable()
export class ErrorMapperInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // No exponer información sensible en errores
        const sanitizedError = this.sanitizeError(error);
        return throwError(() => sanitizedError);
      })
    );
  }

  private sanitizeError(error: HttpErrorResponse): AppError {
    // Filtrar información sensible antes de mostrar al usuario
    return {
      code: this.getPublicErrorCode(error),
      message: this.getPublicErrorMessage(error),
      timestamp: new Date(),
      // No incluir stack traces o detalles internos
    };
  }
}
```

**Principios de seguridad aplicados:**

- **Information Disclosure Prevention**: Evita que stack traces, paths internos o detalles de configuración sean expuestos a usuarios finales
- **Error Normalization**: Convierte errores técnicos en mensajes consistentes que no revelan información sobre la arquitectura interna
- **Logging Separation**: Mantiene logs detallados para desarrolladores mientras presenta mensajes simples a usuarios

#### Logging Interceptor Seguro

El Logging Interceptor implementa logging seguro que captura información necesaria para debugging sin comprometer datos sensibles.

```typescript
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Filtrar headers sensibles en logs
    const sanitizedHeaders = this.sanitizeHeaders(req.headers);

    this.logger.http(req.method, req.url, {
      headers: sanitizedHeaders,
      // No loggear body si contiene información sensible
      body: this.shouldLogBody(req) ? req.body : '[FILTERED]',
    });

    return next.handle(req);
  }

  private sanitizeHeaders(headers: HttpHeaders): string[] {
    const sensitiveHeaders = ['authorization', 'x-api-key', 'cookie'];
    return headers
      .keys()
      .filter(key => !sensitiveHeaders.includes(key.toLowerCase()))
      .map(key => `${key}: ${headers.get(key)}`);
  }
}
```

**Características de seguridad:**

- **Header Sanitization**: Filtra automáticamente headers que contienen tokens de autenticación o información sensible
- **Selective Body Logging**: Determina inteligentemente qué request bodies son seguros para logging
- **PII Protection**: Protege información personal identificable (PII) de ser registrada inadvertidamente

### ✅ 4. Dependency Security

```bash
# npm audit ejecutado regularmente
npm audit

# Resultado actual: 0 vulnerabilidades
found 0 vulnerabilities
```

### ✅ 5. Environment Configuration

```typescript
// environment.ts
export const environment = {
  production: false,
  apiBaseUrl: 'https://rickandmortyapi.com/api', // HTTPS only
  // No incluir API keys o secrets aquí
};
```

## ⚠️ Medidas de Seguridad Pendientes (Para Implementar por Proyecto)

### 1. Content Security Policy (CSP)

```html
<!-- index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               connect-src 'self' https://api.example.com;"
/>
```

### 2. Authentication Guards

```typescript
// core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  return true;
};

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const requiredRole = route.data?.['role'];

  if (!authService.hasRole(requiredRole)) {
    throw new Error('Insufficient permissions');
  }

  return true;
};
```

### 3. Secure HTTP Service

```typescript
@Injectable({
  providedIn: 'root',
})
export class SecureHttpService {
  private readonly http = inject(HttpClient);

  // Automatic CSRF token handling
  get<T>(url: string, options?: any): Observable<T> {
    return this.http.get<T>(url, {
      ...options,
      headers: {
        ...options?.headers,
        'X-CSRF-Token': this.getCsrfToken(),
      },
    });
  }

  // Input validation
  post<T>(url: string, body: any, options?: any): Observable<T> {
    const sanitizedBody = this.sanitizeInput(body);
    return this.http.post<T>(url, sanitizedBody, options);
  }

  private getCsrfToken(): string {
    // Implementar obtención de CSRF token
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
  }

  private sanitizeInput(input: any): any {
    // Implementar sanitización de inputs
    return this.deepSanitize(input);
  }
}
```

### 4. Input Sanitization Service

```typescript
@Injectable({
  providedIn: 'root',
})
export class SanitizationService {
  private readonly domSanitizer = inject(DomSanitizer);

  sanitizeHtml(html: string): SafeHtml {
    return this.domSanitizer.sanitize(SecurityContext.HTML, html) || '';
  }

  sanitizeUrl(url: string): SafeUrl {
    return this.domSanitizer.sanitize(SecurityContext.URL, url) || '';
  }

  sanitizeInput(input: string): string {
    // Remover caracteres peligrosos
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }
}
```

### 5. Rate Limiting Interceptor

```typescript
@Injectable()
export class RateLimitInterceptor implements HttpInterceptor {
  private readonly requestCounts = new Map<string, number>();
  private readonly requestTimes = new Map<string, number[]>();

  private readonly RATE_LIMIT = 100; // requests per minute
  private readonly TIME_WINDOW = 60000; // 1 minute

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const key = this.getRequestKey(req);

    if (this.isRateLimited(key)) {
      return throwError(() => new Error('Rate limit exceeded'));
    }

    this.recordRequest(key);
    return next.handle(req);
  }

  private isRateLimited(key: string): boolean {
    const now = Date.now();
    const times = this.requestTimes.get(key) || [];

    // Clean old requests outside time window
    const recentTimes = times.filter(time => now - time < this.TIME_WINDOW);
    this.requestTimes.set(key, recentTimes);

    return recentTimes.length >= this.RATE_LIMIT;
  }

  private recordRequest(key: string): void {
    const now = Date.now();
    const times = this.requestTimes.get(key) || [];
    times.push(now);
    this.requestTimes.set(key, times);
  }

  private getRequestKey(req: HttpRequest<unknown>): string {
    // Group by endpoint, could also include user ID
    return `${req.method}:${req.url}`;
  }
}
```

## 🔐 Best Practices de Seguridad

### 1. Manejo de Tokens

```typescript
@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  // Usar sessionStorage en lugar de localStorage para tokens sensibles
  setToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  // Limpiar tokens al cerrar sesión
  clearTokens(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.clear(); // Limpiar cualquier dato persistente
  }

  // Verificar expiración de token
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
```

### 2. Validación de Inputs

```typescript
@Component({
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <input formControlName="email" type="email" [class.is-invalid]="isFieldInvalid('email')" />

      <!-- Usar textContent en lugar de innerHTML -->
      <div class="error" [textContent]="getFieldError('email')"></div>
    </form>
  `,
})
export class SecureFormComponent {
  userForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit(): void {
    if (this.userForm.valid) {
      // Sanitizar datos antes de enviar
      const formData = this.sanitizeFormData(this.userForm.value);
      this.submitData(formData);
    }
  }

  private sanitizeFormData(data: any): any {
    return Object.keys(data).reduce((sanitized, key) => {
      sanitized[key] =
        typeof data[key] === 'string'
          ? this.sanitizationService.sanitizeInput(data[key])
          : data[key];
      return sanitized;
    }, {} as any);
  }
}
```

### 3. Secure Routing

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' },
    loadChildren: () => import('./admin/admin.routes'),
  },
  {
    path: 'user',
    canActivate: [authGuard],
    loadChildren: () => import('./user/user.routes'),
  },
  // Redirect desconocidas a 404
  { path: '**', redirectTo: '/404' },
];
```

## 🔍 Security Checklist

### ✅ Desarrollo

- [x] TypeScript strict mode habilitado
- [x] ESLint security rules configuradas
- [x] HTTP interceptors implementados
- [x] Error handling seguro
- [x] Dependencies sin vulnerabilidades
- [ ] CSP headers configurados
- [ ] Authentication/Authorization guards
- [ ] Input sanitization
- [ ] Rate limiting

### ✅ Deployment

- [ ] HTTPS configurado
- [ ] Security headers (HSTS, X-Frame-Options, etc.)
- [ ] Environment variables para secrets
- [ ] Build optimization y minification
- [ ] Source maps removidos en producción
- [ ] Error reporting sin información sensible

### ✅ Runtime

- [ ] Session timeout configurado
- [ ] Automatic logout en inactividad
- [ ] Secure cookie configuration
- [ ] CORS configurado correctamente
- [ ] API rate limiting
- [ ] Logging de eventos de seguridad

## 🚨 Vulnerabilidades Comunes a Evitar

### 1. XSS (Cross-Site Scripting)

```typescript
// ❌ Peligroso
@Component({
  template: `<div [innerHTML]="userContent"></div>`,
})
export class UnsafeComponent {
  userContent = '<script>alert("XSS")</script>'; // Peligroso
}

// ✅ Seguro
@Component({
  template: `<div [textContent]="userContent"></div>`,
})
export class SafeComponent {
  userContent = this.sanitizer.sanitizeHtml(rawContent);
}
```

### 2. CSRF (Cross-Site Request Forgery)

```typescript
// ✅ Protección CSRF
@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== 'GET') {
      req = req.clone({
        setHeaders: {
          'X-CSRF-Token': this.getCsrfToken(),
        },
      });
    }
    return next.handle(req);
  }
}
```

### 3. Sensitive Data Exposure

```typescript
// ❌ Peligroso - datos sensibles en logs
console.log('User data:', { password: user.password });

// ✅ Seguro - filtrar datos sensibles
console.log('User data:', {
  id: user.id,
  email: user.email,
  // password omitido
});
```

## 📚 Recursos de Seguridad

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Angular Security Guide](https://angular.io/guide/security)
- [Mozilla Web Security](https://infosec.mozilla.org/guidelines/web_security)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

La seguridad es un proceso continuo. Esta guía debe actualizarse conforme evolucionen las amenazas y mejores prácticas.
