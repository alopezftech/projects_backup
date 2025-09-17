# Tabla de Contenidos

1. [Introducción y potencial](#introducción-y-potencial)
2. [Instalación y configuración](#instalación-y-configuración)
3. [Comandos principales](#comandos-principales)
4. [Estructura del proyecto](#estructura-del-proyecto)
5. [Sistema de roles y niveles de acceso](#sistema-de-roles-y-niveles-de-acceso)
6. [Elementos estructurales reutilizables](#elementos-estructurales-reutilizables)
   - [Middlewares](#middlewares)
   - [Schemas de validación](#schemas-de-validación)
   - [Modelos y servicios](#modelos-y-servicios)
   - [Protección de rutas y roles](#protección-de-rutas-y-roles)
   - [Jobs asíncronos](#jobs-asíncronos)
   - [Configuración centralizada](#configuración-centralizada)
7. [Ejemplo de aplicación a nuevas entidades](#ejemplo-de-aplicación-a-nuevas-entidades)
8. [Endpoints y ejemplos](#endpoints-y-ejemplos)
9. [Gestión de errores](#gestión-de-errores)
10. [Guía de uso y pruebas](#guía-de-pruebas-de-la-api-con-thunder-client)

---

## Introducción y potencial

¿Qué es TechHub Backend?

TechHub Backend es una aplicación de servidor desarrollada con **Node.js** y el framework **Express**.  
Su objetivo es servir como API REST base para uno o varios proyectos. En este ejemplo, gestiona usuarios, autenticación y procesamiento de tareas asíncronas, integrando servicios externos como **Azure** y **Redis** para almacenamiento, colas y caché.

El diseño modular permite separar responsabilidades y reutilizar componentes clave como middlewares, validaciones, modelos y servicios.  
La autenticación JWT, la protección por roles, el sistema de jobs asíncronos y la configuración centralizada son **transversales** y pueden aplicarse a cualquier entidad, no solo a usuarios.

Esta aplicación está pensada como ejemplo y base para proyectos reales, por lo que algunos servicios (usuarios, autenticación) son casuísticas de ejemplo y pueden adaptarse a necesidades reales.

## Instalación y configuración

1. **Clona el repositorio**

   ```bash
   git clone <URL-del-repositorio>
   cd TechHubBackend
   ```

   - La URL en el momento de la creación de esta documentación: [https://dev.azure.com/techtituteDevOps/PMO/_git/TechHubBackend]

2. **Instala las dependencias**

   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   - Copia `.env.example` a `.env.development` y rellena los valores necesarios.
   - Haz lo mismo para `.env.production` si vas a desplegar en producción.
   - **Nota:** Los archivos `.env` nunca deben subirse al repositorio, a excepción de `.env.example`.

---

## Comandos principales

```bash
npm run dev     # Arranca el servidor en modo desarrollo con recarga automática
npm run build   # Compila el proyecto para produccion
npm start       # Arranca el servidor en modo producción
npm run lint    # Analiza la calidad del código
npm test        # Ejecuta los tests automáticos
```

---

## Estructura del proyecto

```
TechHubBackend/
│
├── src/
│ ├── config/
│ │ └── config.js              # Configuración centralizada de variables de entorno
│ ├── controllers/
│ │ ├── job.controller.js      # Controlador para procesos asíncronos (jobs)
│ │ ├── user.controller.js     # Controlador para gestión de usuarios y autenticación
│ │ └── health.controller.js   # Controlador para health check (estado del servidor)
│ ├── middleware/
│ │ ├── error.middleware.js    # Manejo global de errores
│ │ ├── logging.middleware.js  # Logging de peticiones HTTP
│ │ └── rateLimit.middleware.js# Rate limiting por IP
│ ├── routes/
│ │ ├── job.routes.js          # Rutas para gestión de tareas (jobs)
│ │ ├── user.routes.js         # Rutas para gestión de usuarios y autenticación
│ │ ├── health.routes.js       # Ruta para health check
│ │ └── error.routes.js        # Ruta para pruebas de errores (solo desarrollo)
│ ├── schemas/
│ │ ├── job.schema.js          # Esquema de validación para jobs
│ │ └── user.schema.js         # Esquema de validación para usuarios
│ ├── services/                # Servicios reutilizables (usuarios, jobs)
│ ├── shared/                  # Modelos de datos compartidos (tipos y entidades)
│ ├── utils/
│ │ └── logger.js              # Logger estructurado para logs de la aplicación
│ └── server.js                # Punto de entrada principal del servidor Express
│
├── .env.development           # Variables de entorno para desarrollo
├── .env.production            # Variables de entorno para producción
├── package.json               # Dependencias y scripts de npm
├── docs.md                    # Documentación detallada de la app
└── README.md                  # Documentación rápida y guía de uso
```

**Anexo: Uso de extensiones .js en los imports**

Debido al cambio de CommonJS a NodeNext (ES Modules) , para seguir la evolucion de los estándares de Node.js , es obligatorio especificar la extensión .js en las rutas de los imports, incluso cuando se está trabajando con archivos TypeScript (.ts). Esto se debe a que Node.js, al ejecutar el código transpilado, espera rutas de importación que coincidan exactamente con los archivos generados, los cuales tienen extensión .js. Omitir la extensión puede causar errores de importación en tiempo de ejecución.

Por lo tanto, aunque el archivo fuente sea .ts, siempre debe usarse la extensión .js en los imports para asegurar la compatibilidad y el correcto funcionamiento tanto en desarrollo como en producción.

## Sistema de roles y niveles de acceso

TechHubBackend implementa un sistema de roles para controlar el acceso a los recursos y operaciones de la API. Los roles se definen y validan en los esquemas de usuario (`src/schemas/user.schemas.ts`) y se aplican mediante middlewares en las rutas protegidas.

### Roles disponibles

- **admin**: Acceso total. Puede crear, actualizar, eliminar y gestionar usuarios y jobs. Tiene permisos para operaciones críticas como importación/exportación masiva y eliminación de usuarios.
- **user**: Acceso limitado. Puede consultar y actualizar su propio perfil, listar usuarios y acceder a operaciones básicas.
- **viewer**: Acceso de solo lectura. Puede consultar información pero no modificar ni crear recursos.

### Control de acceso y aplicación en rutas

El middleware `requireRole` protege rutas según el rol del usuario autenticado. Se utiliza junto con `authenticateToken` para asegurar que solo usuarios con el rol adecuado puedan acceder a ciertas operaciones.

**Ejemplo de protección de rutas:**

```typescript
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

router.delete(
  '/users/:userId',
  authenticateToken,
  requireRole(['admin']),
  userController.deleteUser
);
```

**Referencia técnica:**

- Los roles están definidos en los esquemas Zod (`role: z.enum(['admin', 'user', 'viewer'])`) y en los modelos compartidos.
- El middleware de autorización se encuentra en `src/middleware/auth.middleware.ts`.

**Resumen de acceso por rol:**

| Operación                         | admin | user | viewer |
| --------------------------------- | :---: | :--: | :----: |
| Crear usuario                     |  ✔   | ✔\* |   ✖   |
| Eliminar usuario                  |  ✔   |  ✖  |   ✖   |
| Actualizar usuario                |  ✔   | ✔\* |   ✖   |
| Consultar usuarios                |  ✔   |  ✔  |   ✔   |
| Importar/exportar usuarios (jobs) |  ✔   |  ✖  |   ✖   |
| Enviar email de bienvenida        |  ✔   |  ✖  |   ✖   |

\* Solo sobre su propio perfil.

---

## Elementos estructurales reutilizables

### Middlewares

**Express** es un framework minimalista para Node.js que permite crear servidores HTTP de forma sencilla y modular.  
En Express, defines rutas (endpoints) que responden a peticiones HTTP (GET, POST, etc.), y puedes añadir middlewares para procesar datos, autenticar usuarios, manejar errores, etc.

**Ejemplo básico de Express:**

```typescript
import express from 'express';
const app = express();
app.get('/hello', (req, res) => res.send('Hola mundo'));
app.listen(3000);
```

Los **middleware** son funciones que se ejecutan antes de llegar a los controladores y permiten procesar, modificar o validar las peticiones y respuestas.  
En TechHub Backend se utilizan varios middleware para mejorar la seguridad, el rendimiento y la trazabilidad.

### Principales middleware implementados

- **Autenticación JWT:**  
  Verifica el token JWT en las rutas protegidas y añade el usuario autenticado al objeto `req` mediante `authenticateToken` en el endpoint.

- **Autorización por roles:**  
  Permite restringir el acceso a ciertas rutas según el rol del usuario (`admin`, `user`, etc.).

- **Validación de datos:**  
  Usa schemas Zod para validar el cuerpo, parámetros y query de las peticiones antes de procesarlas, sea cual sea la entidad a la que queremos aplicarlo.

- **Logging de peticiones:**  
  Registra cada petición HTTP (método, ruta, usuario, tiempo de respuesta) usando el logger centralizado.

- **Manejo global de errores:**  
  Captura y responde de forma uniforme a los errores que ocurren en cualquier parte de la API.

- **Rate limiting:**  
  Limita el número de peticiones por IP en un periodo de tiempo para evitar abusos y proteger el servidor.

- **CORS:**  
  Configura los orígenes permitidos para acceder a la API, mejorando la seguridad en entornos web.

- **Circuit breaker:**  
  Implementa tolerancia a fallos en servicios externos, evitando sobrecarga y mejorando la resiliencia.

> Estos middleware se configuran en el archivo principal del servidor (`server.ts`) y en los archivos de la carpeta `middleware/`.  
> Su correcta configuración es clave para la seguridad, estabilidad y trazabilidad del backend.

### Schemas de validación

- Define la estructura y reglas de los datos de entrada/salida.
- Crea schemas para cualquier entidad siguiendo el patrón de `user.schema.ts`.
- El middleware de validación rechaza datos inválidos antes de llegar a la lógica de negocio.

Los **schemas** definen la validación de los datos que entran y salen de la API, usando librerías como **Zod**.

- **`user.schema.ts`:**  
  Define cómo debe ser el objeto usuario, qué campos son obligatorios y sus restricciones (por ejemplo, formato de email, longitud mínima de la contraseña, valores permitidos para el status).

  ```typescript
  import { z } from 'zod';
  export const UserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    status: z.enum(['active', 'inactive', 'pending', 'blocked', 'deleted']),
    role: z.enum(['admin', 'user']),
  });
  ```

- **`job.schema.ts`:**  
  Valida los datos relacionados con los procesos asíncronos (jobs), asegurando que los parámetros y estados sean correctos.

Los schemas se usan en los controladores y servicios para validar los datos antes de procesarlos, evitando errores y asegurando la integridad.

### Modelos y servicios

En TechHub Backend, la lógica y la estructura de los datos se organizan en **servicios**, **schemas** y **modelos**.  
Cada uno cumple una función específica para mantener el código modular, seguro y fácil de mantener.

#### Servicio de ejemplo (`services/user.service.ts`)

Actualmente, el proyecto incluye **un único servicio de ejemplo**:  
**`user.service.ts`**, que gestiona todas las operaciones relacionadas con los usuarios.

**Funciones principales en `user.service.ts`:**

- **Crear usuario:** Valida los datos y registra un nuevo usuario.
- **Autenticar usuario (login):** Verifica credenciales y genera el token JWT.
- **Obtener usuario por ID:** Recupera los datos de un usuario específico.
- **Actualizar usuario:** Permite modificar los datos de un usuario existente.
- **Eliminar usuario:** Elimina o desactiva un usuario.
- **Listar usuarios:** Devuelve una lista filtrada de usuarios.
- **Importar y exportar usuarios:** Procesa operaciones masivas de usuarios.

Este servicio se utiliza desde los controladores para separar la lógica de negocio de la gestión de rutas y peticiones HTTP.  
La estructura permite añadir más servicios en el futuro para otras entidades o funcionalidades.

#### Modelos de datos (`shared/`)

Los **modelos** en la carpeta `shared/` definen los **tipos y entidades** que se usan en todo el proyecto.  
No validan datos, sino que describen la estructura y los tipos para TypeScript.

- **Ejemplo de modelo de usuario (`shared/user.model.ts`):**

  ```typescript
  export interface User {
    userId: string;
    name: string;
    email: string;
    password: string;
    status: 'active' | 'inactive' | 'pending' | 'blocked' | 'deleted';
    role: 'admin' | 'user';
    createdAt: Date;
    updatedAt: Date;
  }
  ```

- **Ejemplo de modelo de job (`shared/job.model.ts`):**
  ```typescript
  export interface JobResponse {
    jobId: string;
    status: string;
    createdAt: Date;
    completedAt?: Date;
    progress?: number;
    estimatedDuration?: string;
    resultUrl?: string;
    error?: string;
  }
  ```

Estos modelos permiten que todo el código esté tipado y que los servicios, controladores y rutas trabajen con estructuras coherentes.

**Resumen:**

- **Servicio de ejemplo:** Lógica de negocio para usuarios (`user.service.ts`)
- **Schemas:** Validación de datos (`user.schema.ts`, `job.schema.ts`)
- **Modelos:** Tipos y entidades compartidas (`shared/user.model.ts`, `shared/job.model.ts`)

Esta separación mejora la calidad, seguridad y mantenibilidad.

### Protección de rutas y roles

La protección de rutas es fundamental para asegurar que solo los usuarios autenticados y con los permisos adecuados puedan acceder a ciertos recursos de la API. En TechHub Backend, esto se logra mediante dos middlewares principales:

- **`authenticateToken`**: Verifica que la petición incluya un token JWT válido. Si el token es correcto, añade la información del usuario autenticado al objeto `req.user`. Si no, responde con un error 401 (no autorizado).
- **`requireRole`**: Comprueba que el usuario autenticado tenga uno de los roles permitidos para la ruta. Si el usuario no tiene el rol requerido, responde con un error 403 (prohibido).

#### Ejemplo de uso en rutas

Supongamos que quieres proteger la ruta de eliminación de usuarios para que solo los administradores puedan acceder:

```typescript
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import * as userController from '../controllers/user.controller';

router.delete(
  '/users/:userId',
  authenticateToken, // Verifica que el usuario esté autenticado
  requireRole(['admin']), // Solo permite acceso a usuarios con rol 'admin'
  userController.deleteUser // Controlador que ejecuta la lógica de borrado
);
```

Para permitir que tanto administradores como usuarios puedan actualizar su propio perfil, pero solo los administradores puedan actualizar cualquier usuario:

```typescript
router.put(
  '/users/:userId',
  authenticateToken,
  requireRole(['admin', 'user']),
  userController.updateUser
);
```

En el controlador puedes comprobar si el usuario autenticado es el mismo que el del parámetro `userId` o si tiene rol `admin` para permitir la operación.

#### Cómo funcionan los middlewares

- **authenticateToken**:
  - Busca el token JWT en el header `Authorization: Bearer <token>`.
  - Si el token es válido, decodifica la información del usuario y la añade a `req.user`.
  - Si falta el token o es inválido, responde con un error 401.

- **requireRole**:
  - Recibe un array de roles permitidos (por ejemplo, `['admin']`).
  - Comprueba que `req.user.role` esté incluido en la lista.
  - Si el rol no está permitido, responde con un error 403.

#### Ejemplo de protección en otras entidades

Puedes aplicar estos middlewares a cualquier entidad, por ejemplo, para productos:

```typescript
router.post(
  '/products',
  authenticateToken,
  requireRole(['admin']),
  productController.createProduct
);
```

#### Resumen

- Usa siempre `authenticateToken` en rutas que requieran autenticación.
- Añade `requireRole` para restringir el acceso según el rol del usuario.
- Puedes combinar ambos middlewares para proteger cualquier recurso sensible de la API.

> Consulta el archivo `src/middleware/auth.middleware.ts` para ver la implementación de estos middlewares y personalizarlos según tus necesidades.

### Jobs asíncronos

Permiten ejecutar tareas asíncronas para cualquier entidad.
Los jobs se gestionan en memoria o con Redis/Azure, y su estado puede consultarse vía API.

En TechHub Backend, un **job** no es una entidad persistente ni un recurso almacenado en base de datos.  
Un job representa un proceso o tarea asíncrona que el backend ejecuta bajo demanda, como la importación masiva de usuarios, la exportación de datos o el envío de emails.

Cuando se solicita una operación asíncrona, el backend genera un objeto del tipo `JobResponse` que contiene información sobre el estado y resultado de esa tarea.  
Este objeto se mantiene en memoria durante el ciclo de vida del proceso y permite al usuario consultar el avance y el resultado final.

#### ¿Cómo funciona un job?

1. El usuario inicia una tarea asíncrona (por ejemplo, exportar usuarios).
2. El backend responde inmediatamente con un objeto `JobResponse` que incluye:
   - `jobId`: identificador único de la tarea
   - `status`: estado actual (`queued`, `started`, `progress`, `completed`, `failed`, etc.)
   - `createdAt`: fecha de inicio
   - `completedAt`: fecha de finalización (si aplica)
   - `progress`: porcentaje de avance
   - `estimatedDuration`: duración estimada
   - `resultUrl`: URL del resultado (si aplica)
   - `error`: mensaje de error (si aplica)
3. El usuario puede consultar el estado del job usando el `jobId` y obtener el resultado cuando esté disponible.

#### ¿Por qué usar jobs?

- Permite gestionar tareas largas o pesadas sin bloquear la respuesta HTTP.
- Facilita el seguimiento y la consulta del estado de procesos asíncronos.
- Es útil para operaciones como reportes, importaciones, exportaciones y procesamiento avanzado.

#### Importante

- Los jobs **no son entidades** almacenadas en base de datos, sino procesos temporales gestionados en memoria y representados por el modelo `JobResponse`.
- El ciclo de vida y el estado de los jobs solo existe mientras el backend está en ejecución.

> **En resumen:**  
> Un job en TechHub Backend es un proceso asíncrono representado por un objeto `JobResponse`, que permite consultar el estado y resultado de tareas como importaciones, exportaciones y envíos de email, pero no es una entidad persistente.

### Configuración centralizada

- El archivo `config.ts` carga todas las variables de entorno y parámetros globales.
- Permite adaptar el backend a diferentes entornos (desarrollo, producción) sin modificar el código fuente.

Toda la configuración (puertos, claves, conexiones externas) se gestiona en un solo archivo.  
Esto permite cambiar parámetros según el entorno (desarrollo, producción) y acceder a ellos de forma segura y tipada.

#### Parámetros de configuración

- **NODE_ENV:**  
  Define el entorno de ejecución (`development`, `production`).  
  Ejemplo:  
  `NODE_ENV=development`

- **Puerto del servidor (`PORT`):**  
  Define el puerto en el que el servidor Express escucha las peticiones HTTP.  
  Ejemplo:  
  `PORT=3000`

- **Claves JWT para autenticación (`JWT_SECRET`, `JWT_EXPIRES_IN`):**  
  Clave secreta para firmar y verificar los tokens JWT, y tiempo de expiración de los tokens.  
  Ejemplo:  
  `JWT_SECRET=your-secret-key`  
  `JWT_EXPIRES_IN=1h`

- **Conexión a Azure Service Bus (`AZURE_SERVICE_BUS_CONNECTION_STRING`, `AZURE_SERVICE_BUS_QUEUE_NAME`):**  
  Parámetros para conectar con el servicio de colas asíncronas de Azure, usado para trabajos (jobs).  
  Ejemplo:  
  `AZURE_SERVICE_BUS_CONNECTION_STRING=Endpoint=sb://...`  
  `AZURE_SERVICE_BUS_QUEUE_NAME=jobs`

- **Conexión a Azure Blob Storage (`AZURE_STORAGE_CONNECTION_STRING`, `AZURE_STORAGE_CONTAINER_NAME`):**  
  Parámetros para almacenar archivos/resultados grandes en Azure Blob Storage.  
  Ejemplo:  
  `AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=...`  
  `AZURE_STORAGE_CONTAINER_NAME=results`

- **Configuración de Redis (`REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`):**  
  Parámetros para conectar con Redis, usado para caché y mejora de performance.  
  Ejemplo:  
  `REDIS_HOST=localhost`  
  `REDIS_PORT=6379`  
  `REDIS_PASSWORD=`

- **Parámetros de rate limiting (`RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`):**  
  Limita el número de peticiones por IP en un periodo de tiempo para proteger el backend.  
  Ejemplo:  
  `RATE_LIMIT_WINDOW_MS=900000` (15 minutos)  
  `RATE_LIMIT_MAX_REQUESTS=100`

- **Parámetros de resiliencia (circuit breaker) (`CIRCUIT_BREAKER_TIMEOUT`, `CIRCUIT_BREAKER_ERROR_THRESHOLD`, `CIRCUIT_BREAKER_RESET_TIMEOUT`):**  
  Configura el patrón circuit breaker para evitar sobrecarga y mejorar la tolerancia a fallos.  
  Ejemplo:  
  `CIRCUIT_BREAKER_TIMEOUT=3000` (ms)  
  `CIRCUIT_BREAKER_ERROR_THRESHOLD=50` (%)  
  `CIRCUIT_BREAKER_RESET_TIMEOUT=30000` (ms)

- **Nivel de logging (`LOG_LEVEL`):**  
  Define el nivel de detalle de los logs (`info`, `debug`, `error`).  
  Ejemplo:  
  `LOG_LEVEL=info`

- **Origen permitido para CORS (`CORS_ORIGIN`):**  
  Permite definir qué dominios pueden acceder a la API.  
  Ejemplo:  
  `CORS_ORIGIN=*` (todos los orígenes)

> Todos estos parámetros deben definirse en los archivos `.env.development` y `.env.production` según el entorno.  
> **Nunca subas tus archivos `.env` con datos sensibles al repositorio.**

---

## Ejemplo de aplicación a nuevas entidades

A continuación se muestra cómo añadir una nueva entidad (por ejemplo, **productos**) siguiendo el patrón modular y reutilizable de TechHub Backend. Además, se explica el propósito de los modelos y tipos usados en usuarios, para que puedas aplicarlos a cualquier entidad.

---

### 1. Modelo de datos

Define la estructura de la entidad en `shared/product.model.ts`.  
Esto permite tipar correctamente los datos en todo el proyecto.

```typescript
// filepath: src/shared/product.model.ts
export type ProductStatus = 'active' | 'inactive';

export interface ProductCreateRequest {
  name: string;
  price: number;
  status?: ProductStatus;
}

export interface ProductUpdateRequest {
  name?: string;
  price?: number;
  status?: ProductStatus;
}

export interface ProductResponse {
  id: string;
  name: string;
  price: number;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductQueryParams {
  limit: number;
  offset: number;
  status?: ProductStatus;
  search?: string;
}
```

**¿Por qué este patrón?**  
Separar los modelos en tipos de entrada (Create/Update), salida (Response) y consulta (QueryParams) mejora la claridad, la validación y la seguridad.  
Este enfoque es aplicable a cualquier entidad (usuarios, productos, pedidos, etc.).

---

### 2. Schema de validación

Crea el esquema de validación en `schemas/product.schema.ts` usando Zod.  
Esto asegura que los datos recibidos y enviados cumplen las reglas de negocio.

```typescript
// filepath: src/schemas/product.schema.ts
import { z } from 'zod';

export const ProductSchema = z.object({
  name: z.string().min(2),
  price: z.number().positive(),
  status: z.enum(['active', 'inactive']).default('active'),
});
```

---

### 3. Servicio

Implementa la lógica de negocio en `services/product.service.ts`.  
Aquí se gestionan las operaciones CRUD y cualquier lógica específica de productos.

```typescript
// filepath: src/services/product.service.ts
import { Product } from '../shared/product.model';

export class ProductService {
  // Métodos: createProduct, getProductById, updateProduct, deleteProduct, listProducts, etc.
}
```

---

### 4. Controlador

Gestiona las peticiones HTTP en `controllers/product.controller.ts`.  
El controlador valida los datos, llama a los servicios y responde al cliente.

```typescript
// filepath: src/controllers/product.controller.ts
import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

export const createProduct = async (req: Request, res: Response) => {
  // Validar datos, llamar a ProductService, devolver respuesta
};
```

---

### 5. Rutas

Expón los endpoints en `routes/product.routes.ts`, aplicando los middlewares de autenticación, roles y validación.  
Esto garantiza que solo usuarios autorizados puedan acceder a las operaciones sensibles.

```typescript
// filepath: src/routes/product.routes.ts
import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { ProductSchema } from '../schemas/product.schema';
import * as productController from '../controllers/product.controller';

const router = Router();

router.post(
  '/',
  authenticateToken,
  requireRole(['admin']),
  validateBody(ProductSchema),
  productController.createProduct
);

router.get(
  '/',
  authenticateToken,
  requireRole(['admin', 'user', 'viewer']),
  productController.listProducts
);

// ...otros endpoints (get by id, update, delete)

export default router;
```

---

### 6. Jobs asíncronos (opcional)

Si necesitas operaciones masivas (importar/exportar productos), implementa endpoints de jobs siguiendo el patrón de usuarios:

- Crea un esquema de job específico si es necesario.
- Añade endpoints como `/products/bulk-import` o `/products/export` que creen un job y devuelvan un `jobId`.
- Usa el sistema de jobs para procesar estas tareas en segundo plano y permitir al usuario consultar el estado.

---

### 7. Integración en el servidor

No olvides importar y montar las nuevas rutas en el archivo principal del servidor (`server.ts`):

```typescript
// filepath: src/server.ts
import productRoutes from './routes/product.routes';

app.use('/api/products', productRoutes);
```

---

### Ejemplo de modelos y tipos para usuarios (aplicable a cualquier entidad)

A continuación se explica el propósito de cada tipo e interfaz del modelo de usuario, con ejemplos y comentarios para clarificar su uso y aplicabilidad en otras entidades.

```typescript
// filepath: src/shared/models/user.ts

// 1. Definición de roles y estados posibles para los usuarios.
// Esto permite restringir los valores válidos y facilita la validación y control de acceso.
export type UserRole = 'admin' | 'user' | 'viewer';
export type UserStatus = 'active' | 'inactive' | 'suspended';

// 2. Interfaz para la petición de creación de usuario.
// Solo incluye los campos necesarios para crear un usuario.
export interface UserCreateRequest {
  email: string;
  name: string;
  password: string;
  role: UserRole;
}
// Ejemplo de uso:
const newUser: UserCreateRequest = {
  email: 'juan@ejemplo.com',
  name: 'Juan Pérez',
  password: 'secreto123',
  role: 'user',
};

// 3. Interfaz para la actualización de usuario.
// Todos los campos son opcionales para permitir actualizaciones parciales.
export interface UserUpdateRequest {
  name?: string;
  role?: UserRole;
  status?: UserStatus;
}
// Ejemplo de uso:
const updateUser: UserUpdateRequest = {
  name: 'Juan Actualizado',
  status: 'active',
};

// 4. Interfaz para la respuesta de usuario.
// Define los campos que se devuelven al cliente tras operaciones de usuario.
export interface UserResponse {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  status?: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  message?: string;
}
// Ejemplo de uso:
const userResponse: UserResponse = {
  id: 'u123',
  email: 'juan@ejemplo.com',
  name: 'Juan Pérez',
  role: 'user',
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLoginAt: new Date(),
  message: 'Usuario creado correctamente',
};

// 5. Interfaz para la petición de login.
// Solo requiere email y contraseña.
export interface UserLoginRequest {
  email: string;
  password: string;
}
// Ejemplo de uso:
const loginRequest: UserLoginRequest = {
  email: 'juan@ejemplo.com',
  password: 'secreto123',
};

// 6. Interfaz para la respuesta de login.
// Incluye el usuario autenticado y el token JWT.
export interface UserLoginResponse {
  user: UserResponse;
  token: string;
  expiresIn: string;
}
// Ejemplo de uso:
const loginResponse: UserLoginResponse = {
  user: userResponse,
  token: 'jwt.token.aqui',
  expiresIn: '1h',
};

// 7. Interfaz para los parámetros de consulta de usuarios.
// Permite paginación y filtrado por rol, estado o búsqueda.
export interface UserQueryParams {
  limit: number;
  offset: number;
  role?: UserRole;
  status?: UserStatus;
  search?: string;
}
// Ejemplo de uso:
const queryParams: UserQueryParams = {
  limit: 10,
  offset: 0,
  role: 'admin',
  search: 'juan',
};
```

**¿Son necesarios estos patrones en otras entidades?**  
Sí, este enfoque es recomendable para cualquier entidad de la API.  
Por ejemplo, para una entidad **Producto** podrías tener los mismos patrones: tipos de estado, interfaces de creación, actualización, respuesta y parámetros de consulta.

**Ventajas de este patrón:**

- Claridad y separación entre datos de entrada, salida y consulta.
- Facilita la validación y el control de acceso.
- Mejora la mantenibilidad y escalabilidad del código.

---

**Resumen del flujo para nuevas entidades:**

1. **Modelo:** Define la interfaz TypeScript.
2. **Schema:** Valida los datos de entrada/salida.
3. **Servicio:** Implementa la lógica de negocio.
4. **Controlador:** Gestiona las peticiones HTTP.
5. **Rutas:** Expón los endpoints y aplica middlewares.
6. **Jobs:** Añade soporte para operaciones masivas si es necesario.
7. **Servidor:** Integra las rutas en el servidor principal.

> Siguiendo este patrón, puedes añadir cualquier entidad (pedidos, clientes, facturas, etc.) de forma segura, escalable y consistente, reutilizando los middlewares y utilidades del proyecto.

## Endpoints y ejemplos

### ¿Qué es un endpoint?

Un **endpoint** es una URL específica de la API a la que los clientes pueden enviar peticiones HTTP (GET, POST, PUT, DELETE, etc.) para interactuar con los recursos del backend.  
Cada endpoint representa una operación concreta sobre una entidad o funcionalidad (por ejemplo, crear un usuario, obtener la lista de productos, iniciar sesión, etc.).

En TechHub Backend, los endpoints se definen en los archivos de rutas (`routes/`), donde se asocian URLs y métodos HTTP a funciones de los controladores.  
Los endpoints suelen aplicar middlewares para autenticación, autorización y validación antes de ejecutar la lógica de negocio.

---

### ¿Cómo crear un endpoint?

1. **Define la ruta y el método HTTP** en el archivo de rutas correspondiente (por ejemplo, `user.routes.ts`).
2. **Aplica los middlewares necesarios** (autenticación, roles, validación).
3. **Asocia la ruta a una función del controlador** que implementa la lógica de negocio.

#### Ejemplo: Crear un endpoint para registrar usuarios

```typescript
// filepath: src/routes/user.routes.ts
import { Router } from 'express';
import { validateBody } from '../middleware/validation.middleware';
import { UserSchema } from '../schemas/user.schema';
import * as userController from '../controllers/user.controller';

const router = Router();

router.post(
  '/',
  validateBody(UserSchema), // Valida el cuerpo de la petición
  userController.createUser // Llama al controlador que crea el usuario
);

export default router;
```

- **Ruta:** `/api/users`
- **Método:** POST
- **Middlewares:** `validateBody` para validar los datos recibidos.
- **Controlador:** `createUser` gestiona la lógica de creación.

#### Ejemplo: Endpoint protegido para eliminar usuarios

```typescript
router.delete(
  '/:userId',
  authenticateToken, // Requiere autenticación JWT
  requireRole(['admin']), // Solo admins pueden eliminar usuarios
  userController.deleteUser // Lógica de borrado
);
```

- **Ruta:** `/api/users/:userId`
- **Método:** DELETE
- **Middlewares:** `authenticateToken`, `requireRole`
- **Controlador:** `deleteUser`

---

### Lista de endpoints principales

#### Usuarios

- **POST** `/api/users` - Crear usuario
- **POST** `/api/users/login` - Login
- **GET** `/api/users/{userId}` - Obtener usuario por ID (protegido)
- **PUT** `/api/users/{userId}` - Actualizar usuario (protegido)
- **DELETE** `/api/users/{userId}` - Eliminar usuario (solo admin)
- **GET** `/api/users` - Listar usuarios (protegido)
- **POST** `/api/users/bulk-import` - Importación masiva (job, solo admin)
- **POST** `/api/users/export` - Exportación masiva (job, solo admin)
- **POST** `/api/users/{userId}/send-welcome-email` - Enviar email (job, solo admin)

#### Jobs (procesos asíncronos)

- **POST** `/api/jobs` - Crear job personalizado
- **GET** `/api/jobs/{jobId}` - Consultar estado de job

#### Health Check

- **GET** `/api/health` - Verificar estado del servidor

---

### ¿Cómo se estructura un endpoint en TechHub Backend?

1. **Archivo de rutas**: Define la URL, el método HTTP y los middlewares.
2. **Middlewares**: Validan, autentican y autorizan la petición.
3. **Controlador**: Implementa la lógica de negocio.
4. **Servicio**: Realiza la operación sobre los datos o entidades.

**Ejemplo completo de endpoint protegido y validado:**

```typescript
// filepath: src/routes/product.routes.ts
import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { ProductSchema } from '../schemas/product.schema';
import * as productController from '../controllers/product.controller';

const router = Router();

router.post(
  '/',
  authenticateToken, // Protege la ruta (requiere login)
  requireRole(['admin']), // Solo admin puede crear productos
  validateBody(ProductSchema), // Valida el cuerpo de la petición
  productController.createProduct // Lógica de creación
);

export default router;
```

---

### Resumen

- Un **endpoint** es una URL de la API asociada a un método HTTP y una función de controlador.
- Se crean en los archivos de rutas, aplicando middlewares para seguridad y validación.
- Los endpoints permiten a los clientes interactuar con los recursos del backend de forma estructurada y segura.
- La estructura modular de TechHub Backend facilita la creación, protección y validación de nuevos endpoints para cualquier entidad.

## Gestión de errores

TechHubBackend implementa un sistema de errores centralizado que garantiza la trazabilidad y el registro de cualquier error relevante, tanto dentro como fuera del ciclo de Express.

### Enfoque y funcionamiento

- **Errores operacionales (esperados):**
  - Los errores operacionales (por ejemplo, validaciones, permisos, recursos no encontrados) **no** pasan por la clase `AppError`.
  - Estos errores se notifican directamente al frontend mediante respuestas HTTP estándar (por ejemplo, `res.status(404).json({ success: false, error: 'No encontrado' })`), permitiendo que el cliente gestione estas casuísticas de forma autónoma.

- **Errores técnicos/críticos (`AppError`):**
  - La clase `AppError` se utiliza para errores que requieren intervención o revisión técnica, como fallos internos, excepciones inesperadas o problemas que deben ser gestionados por el equipo de backend.
  - Estos errores se lanzan explícitamente en controladores y servicios cuando se detecta una situación que debe ser registrada y analizada por el equipo técnico.
  - El middleware `errorHandler` detecta instancias de `AppError` y les asigna el código de estado y mensaje correspondiente, registrando el error para trazabilidad.

- **Listeners globales de Node.js:**
  - Para garantizar que ningún error quede sin registrar, se configuran listeners globales que capturan errores fuera del ciclo de Express:

    ```typescript
    process.on('unhandledRejection', (reason: Error) => {
      errorHandler(
        reason instanceof Error ? reason : new Error(String(reason)),
        null,
        null
      );
    });

    process.on('uncaughtException', (error: Error) => {
      errorHandler(error, null, null);
    });
    ```

  - Esto permite capturar y registrar errores de promesas no gestionadas y excepciones no atrapadas, incluso si ocurren fuera del flujo habitual de la aplicación.

- **Formato de respuesta:**
  - Todas las respuestas gestionadas por el middleware tienen el formato:
    ```json
    {
      "success": false,
      "error": "Descripción del error"
    }
    ```
    En desarrollo se incluye el stacktrace:
    ```json
    {
      "success": false,
      "error": "Descripción del error",
      "stack": "Stacktrace detallado"
    }
    ```

- **Consulta y trazabilidad:**
  - Los errores capturados por el sistema se almacenan en memoria y pueden consultarse mediante la función `getLoggedErrors` (solo en desarrollo).

### Resumen

El sistema de errores centralizado de TechHubBackend diferencia entre errores operacionales (notificados directamente al frontend) y errores técnicos/críticos (gestionados por el equipo backend mediante `AppError` y el middleware `errorHandler`). Además, listeners globales aseguran la captura de errores fuera del ciclo de Express, proporcionando máxima trazabilidad y fiabilidad.

## Rutas y controladores

En TechHub Backend, las **rutas** y **controladores** organizan la comunicación entre los clientes y la lógica del backend.  
Cada uno cumple una función específica para mantener el código modular y fácil de mantener.

### Rutas (`routes/`)

Las rutas definen los **endpoints HTTP** disponibles para los clientes.  
Cada archivo de rutas agrupa endpoints relacionados por entidad o funcionalidad.

**Ejemplos:**

- **`user.routes.ts`:**  
  Define rutas para crear, autenticar, consultar, actualizar, eliminar, importar y exportar usuarios, así como enviar emails de bienvenida.
- **`job.routes.ts`:**  
  Define rutas para crear y consultar el estado de jobs asíncronos.
- **`health.routes.ts`:**  
  Ruta para verificar el estado del servidor (health check).
- **`error.routes.ts`:**  
  Ruta para pruebas de manejo de errores (solo en desarrollo).

Las rutas suelen incluir middlewares de autenticación, autorización y validación antes de invocar el controlador correspondiente.

### Controladores (`controllers/`)

Los controladores implementan la **lógica de negocio** que se ejecuta cuando se accede a cada ruta, reciben la petición, validan los datos, llaman a los servicios (donde reside la lógica de negocio) y devuelven la respuesta al cliente. De este modo, los controladores solo orquestan el flujo de la petición y mantienen la lógica de negocio centralizada y reutilizable en los servicios.

**Ejemplos:**

- **`user.controller.ts`:**  
  Contiene funciones para registrar usuarios, iniciar sesión, obtener, actualizar y eliminar usuarios, importar/exportar usuarios y enviar emails de bienvenida.
- **`job.controller.ts`:**  
  Gestiona la creación y consulta de jobs asíncronos.
- **`health.controller.ts`:**  
  Responde al health check del servidor.

**Flujo típico de una petición:**

1. El cliente realiza una petición HTTP a una ruta (por ejemplo, `POST /api/users`).
2. La ruta aplica los middlewares necesarios (autenticación, validación, etc.).
3. La ruta invoca la función correspondiente del controlador.
4. El controlador valida los datos, utiliza los servicios y responde al cliente.

**Ventajas de esta estructura:**

- Mantiene el código organizado y modular.
- Facilita la escalabilidad y el mantenimiento.
- Permite reutilizar lógica en los controladores y servicios.
- Facilita la aplicación de middlewares y validaciones por endpoint.

## Autenticación y autorización (ejemplo)

El backend implementa un sistema de autenticación JWT como ejemplo.  
Esto permite proteger rutas y asegurar que solo usuarios autenticados accedan a ciertos recursos.

**Flujo típico:**

1. El usuario se registra (`POST /api/users`)
2. El usuario inicia sesión (`POST /api/users/login`) y recibe un token JWT
3. El usuario usa el token en el header `Authorization: Bearer {TOKEN}` para acceder a rutas protegidas

> **Nota:**  
> Este sistema es un ejemplo y puede adaptarse a otros métodos de autenticación

## Utilidades (`utils/`)

La carpeta **`utils/`** contiene funciones y módulos auxiliares que facilitan tareas comunes y mejoran la calidad del código en TechHub Backend.

### Ejemplo destacado: Logger centralizado

- **`logger.ts`:**  
  Implementa un logger estructurado usando Winston.  
  Permite registrar logs con distintos niveles (`info`, `debug`, `error`), incluir timestamps y stacktrace, y formatear la salida en JSON para facilitar la trazabilidad y el monitoreo.

  **Ventajas del logger:**
  - Centraliza el registro de eventos y errores.
  - Facilita la depuración en todos los ambientes.
  - Permite configurar el nivel de log según el entorno (desarrollo, producción).

### Otras utilidades

- Puedes añadir aquí funciones de ayuda, conversión de datos, manejo de fechas, generación de identificadores únicos, etc.
- Mantener utilidades en esta carpeta ayuda a evitar duplicidad de código y mejora la organización del proyecto.

**Resumen:**  
La carpeta `utils/` agrupa módulos reutilizables y transversales, como el logger, que aportan valor a todo el backend y favorecen buenas prácticas.

## Punto de entrada principal (`server.ts`)

El archivo **`server.ts`** es el punto de entrada de TechHub Backend y el responsable de inicializar y configurar toda la aplicación.  
Aquí se orquesta el arranque del servidor Express, la carga de middlewares, rutas, configuración y la gestión de errores globales.

### Estructura y responsabilidades

- **Carga de configuración:**  
  Importa la configuración centralizada desde `config/config.ts`, asegurando que variables de entorno y parámetros estén disponibles antes de iniciar el servidor.

- **Inicialización de Express:**  
  Crea la instancia principal de la aplicación Express (`const app = express();`).

- **Middlewares globales:**  
  Aplica middlewares esenciales para el funcionamiento y seguridad:
  - **Body parser:** Para procesar JSON y datos de formularios.
  - **CORS:** Para controlar los orígenes permitidos.
  - **Logging:** Para registrar todas las peticiones y respuestas.
  - **Rate limiting:** Para limitar el abuso de la API.
  - **Autenticación y autorización:** Para proteger rutas sensibles.
  - **Validación:** Para asegurar la integridad de los datos recibidos.
  - **Circuit breaker:** Para tolerancia a fallos en servicios externos.

- **Carga de rutas:**  
  Importa y monta los archivos de rutas (`routes/`) que definen los endpoints de la API.  
  Ejemplo:

  ```typescript
  app.use('/api/users', userRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/health', healthRoutes);
  ```

- **Manejo global de errores:**  
  Aplica el middleware de errores para capturar y responder uniformemente a cualquier excepción que ocurra en la aplicación.

- **Arranque del servidor:**  
  Inicia el servidor en el puerto definido en la configuración y muestra un mensaje en consola indicando que el backend está listo para recibir peticiones.

  ```typescript
  app.listen(config.PORT, () => {
    logger.info(`Servidor iniciado en puerto ${config.PORT}`);
  });
  ```

- **Integración con servicios externos:**  
  Si la aplicación requiere conectarse a Azure, Redis u otros servicios, la inicialización y comprobación de conexión se realiza aquí, asegurando que el backend no arranque si hay problemas críticos.

### Detalles clave

- **Modularidad:**  
  El punto de entrada no contiene lógica de negocio, solo orquesta la inicialización y delega responsabilidades a controladores, servicios y middlewares.

- **Escalabilidad:**  
  Permite añadir nuevas rutas, middlewares o servicios sin modificar la estructura principal.

- **Seguridad y resiliencia:**  
  Todos los aspectos críticos (autenticación, rate limiting, circuit breaker) se configuran antes de exponer la API.

- **Mantenibilidad:**  
  La separación clara de responsabilidades y la carga modular facilitan la actualización y depuración del backend.

**Resumen:**  
El archivo `server.ts` es el núcleo de arranque de TechHub Backend.  
Se encarga de configurar el entorno, inicializar Express, aplicar todos los middlewares, montar las rutas, gestionar los errores y arrancar el servidor, garantizando que la API esté lista, segura y escalable desde el primer momento.

## Resumen

TechHub Backend es una plantilla **modular, segura y escalable**.  
Sus elementos estructurales (middlewares, validaciones, modelos, servicios, jobs y configuración) están diseñados para ser **reutilizables y adaptables** a cualquier caso de uso, más allá de los ejemplos de usuarios.  
La documentación y el código te permiten construir rápidamente nuevos servicios, proteger rutas, validar datos y gestionar operaciones complejas, siguiendo buenas prácticas y manteniendo la calidad del backend.

# Guía de pruebas de la API con Thunder Client

Esta guía te ayudará a probar el flujo completo de la API usando **Thunder Client** en VS Code.

> **Importante:**  
> Para probar el flujo completo (incluyendo eliminar usuarios, importación/exportación masiva y envío de emails), debes crear y autenticarte con un usuario que tenga el rol `admin`.  
> Si creas un usuario normal, no tendrás permisos suficientes para estas operaciones protegidas.

## 1. Instala Thunder Client

1. Abre VS Code.
2. Ve a la pestaña de extensiones y busca **Thunder Client**.
3. Instálala.

---

## 2. Flujo básico de pruebas

### 0. Health check

- **Método:** `GET`
- **URL:** `http://localhost:3000/api/health`

### 1. Crear usuario (admin recomendado)

- **Método:** `POST`
- **URL:** `http://localhost:3000/api/users`
- **Body (JSON):**
  ```json
  {
    "name": "Admin",
    "email": "admin@example.com",
    "password": "12345678",
    "role": "admin"
  }
  ```
- Si solo quieres probar el flujo básico, puedes omitir el campo `"role": "admin"` y crear un usuario normal.

### 2. Login

- **Método:** `POST`
- **URL:** `http://localhost:3000/api/users/login`
- **Body (JSON):**
  ```json
  {
    "email": "admin@example.com",
    "password": "12345678"
  }
  ```
- **Guarda el token** que recibes en la respuesta.

### 3. Obtener usuario

- **Método:** `GET`
- **URL:** `http://localhost:3000/api/users/{userId}`
- **Header:**
  ```
  Authorization: Bearer {TOKEN}
  ```
- Reemplaza `{userId}` y `{TOKEN}` por los valores reales.

### 4. Actualizar usuario

- **Método:** `PUT`
- **URL:** `http://localhost:3000/api/users/{userId}`
- **Header:**
  ```
  Authorization: Bearer {TOKEN}
  ```
- **Body (JSON):**
  ```json
  {
    "name": "Admin Actualizado"
  }
  ```

### 5. Eliminar usuario (solo admin)

- **Método:** `DELETE`
- **URL:** `http://localhost:3000/api/users/{userId}`
- **Header:**
  ```
  Authorization: Bearer {TOKEN}
  ```
- **Nota:** Si no usas un usuario admin, recibirás un error de permisos insuficientes.

### 6. Listar usuarios

- **Método:** `GET`
- **URL:** `http://localhost:3000/api/users`
- **Header:**
  ```
  Authorization: Bearer {TOKEN}
  ```

### 7. Importación masiva de usuarios (solo admin)

- **Método:** `POST`
- **URL:** `http://localhost:3000/api/users/bulk-import`
- **Header:**
  ```
  Authorization: Bearer {TOKEN}
  ```
- **Body (JSON):**
  ```json
  {
    "users": [
      { "name": "Ana", "email": "ana@example.com", "password": "12345678" },
      { "name": "Luis", "email": "luis@example.com", "password": "12345678" },
      { "name": "Maria", "email": "maria@example.com", "password": "12345678" },
      {
        "name": "Carlos",
        "email": "carlos@example.com",
        "password": "12345678"
      },
      { "name": "Sofia", "email": "sofia@example.com", "password": "12345678" },
      {
        "name": "Javier",
        "email": "javier@example.com",
        "password": "12345678"
      },
      { "name": "Lucia", "email": "lucia@example.com", "password": "12345678" },
      { "name": "Pedro", "email": "pedro@example.com", "password": "12345678" },
      { "name": "Elena", "email": "elena@example.com", "password": "12345678" },
      {
        "name": "Miguel",
        "email": "miguel@example.com",
        "password": "12345678"
      }
    ],
    "notifyUsers": true
  }
  ```

### 8. Exportar usuarios (solo admin)

- **Método:** `POST`
- **URL:** `http://localhost:3000/api/users/export`
- **Header:**
  ```
  Authorization: Bearer {TOKEN}
  ```
- **Body (JSON):**
  ```json
  {
    "status": "active"
  }
  ```

### 9. Enviar email de bienvenida (solo admin)

- **Método:** `POST`
- **URL:** `http://localhost:3000/api/users/{userId}/send-welcome-email`
- **Header:**
  ```
  Authorization: Bearer {TOKEN}
  ```

### 10. Crear job

- **Método:** `POST`
- **URL:** `http://localhost:3000/api/jobs`
- **Header:**
  ```
  Authorization: Bearer {TOKEN}
  ```
- **Body (JSON):**
  ```json
  {
    "title": "Backend Developer",
    "description": "Node.js y TypeScript",
    "type": "report_generation",
    "parameters": {
      "reportType": "monthly",
      "includeCharts": true
    }
  }
  ```
- Guarda el `jobId` que recibas.

### 11. Consultar estado de job

- **Método:** `GET`
- **URL:** `http://localhost:3000/api/jobs/{jobId}`
- **Header:**
  ```
  Authorization: Bearer {TOKEN}
  ```
- Reemplaza `{jobId}` por el id del job creado.

---

## Consejos

- Usa variables de entorno para el token si lo deseas.
- Revisa las respuestas para entender el formato y los datos retornados.

---

> Esta guía te permite validar el flujo principal de la API y sirve como referencia
