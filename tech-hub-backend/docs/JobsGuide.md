# Guía del Sistema de Jobs Asíncronos - TechHub Backend

## Índice
1. [Arquitectura General](#arquitectura-general)
2. [Componentes del Sistema](#componentes-del-sistema)
3. [Implementación de Nuevos Controllers](#implementación-de-nuevos-controllers)
4. [Creación de Procesadores de Jobs](#creación-de-procesadores-de-jobs)
5. [Uso de Jobs en Endpoints](#uso-de-jobs-en-endpoints)
6. [Monitoreo y Gestión de Jobs](#monitoreo-y-gestión-de-jobs)
7. [Ejemplos Prácticos](#ejemplos-prácticos)
8. [Mejores Prácticas](#mejores-prácticas)
9. [Solución de Problemas](#solución-de-problemas)

---

## Arquitectura General

El sistema de jobs asíncronos de TechHub Backend está diseñado para ejecutar procesos largos sin bloquear el hilo principal del servidor. Utiliza **Worker Threads** de Node.js para garantizar un rendimiento óptimo.

### Flujo de Ejecución

```
Cliente → Controller → BaseController.createAsyncJob → JobService → Worker Thread → Procesadores Específicos
   ↑                                                                        ↓
   └── Respuesta Inmediata (202)                           Progress/Complete/Error ──┘
```

### Principios de Diseño

- **Separación de Responsabilidades**: Cada controller maneja sus propios procesadores
- **Escalabilidad**: Worker Threads permiten procesamiento paralelo
- **Extensibilidad**: Fácil agregar nuevos tipos de jobs
- **Consistencia**: API unificada para todos los jobs
- **Observabilidad**: Logging y monitoreo completo

---

## Componentes del Sistema

### 1. JobService (`src/services/job.service.ts`)

**Responsabilidad**: Gestión central de jobs y Worker Threads.

**Métodos principales**:
- `createJob(config)`: Crea y ejecuta un nuevo job
- `getJob(jobId)`: Obtiene el estado de un job
- `cancelJob(jobId)`: Cancela un job en ejecución
- `listJobs(options)`: Lista jobs con filtros

**Configuración de Job**:
```typescript
interface JobConfig {
  type: JobType;           // 'data_processing' | 'report_generation' | 'ml_training'
  priority: JobPriority;   // 'high' | 'normal' | 'low'
  parameters: any;         // Datos específicos del job
  userId?: string;         // Usuario que ejecuta el job
}
```

### 2. BaseController (`src/controllers/base.controller.ts`)

**Responsabilidad**: Clase padre que proporciona herramientas para manejar jobs en controllers.

**Métodos principales**:
- `registerJobProcessor(key, processor)`: Registra un procesador
- `createAsyncJob(config, req, res, next)`: Crea un job asíncrono
- `validateJobParameters(payload, fields)`: Valida parámetros requeridos
- `handleJobError(error, type, res, next)`: Maneja errores de jobs

### 3. Worker Genérico (`src/services/job.worker.ts`)

**Responsabilidad**: Ejecuta jobs en threads separados sin lógica de negocio específica.

**Funciones de reporte**:
- `reportProgress(progress, message)`: Reporta progreso (0-100%)
- `reportCompleted(resultUrl?)`: Indica finalización exitosa
- `reportError(error)`: Reporta errores

### 4. Job Controller (`src/controllers/job.controller.ts`)

**Responsabilidad**: Endpoints para gestionar jobs (consultar estado, cancelar, listar).

**Endpoints**:
- `GET /jobs/:jobId`: Consultar estado de un job
- `DELETE /jobs/:jobId`: Cancelar un job
- `GET /jobs`: Listar jobs con filtros

---

## Implementación de Nuevos Controllers

### Paso 1: Extender BaseController

```typescript
// src/controllers/example.controller.ts
import { BaseController } from './base.controller.js';
import { Request, Response, NextFunction } from 'express';

class ExampleControllerClass extends BaseController {
  
  protected registerProcessors(): void {
    // Registrar procesadores específicos
    ExampleControllerClass.registerJobProcessor('process_data', this.processData);
    ExampleControllerClass.registerJobProcessor('generate_report', this.generateReport);
  }

  // Procesadores específicos (ver siguiente sección)
  private async processData(payload: any, context: any): Promise<void> {
    // Implementación del procesador
  }

  private async generateReport(payload: any, context: any): Promise<void> {
    // Implementación del procesador
  }
}

// Crear instancia y registrar procesadores
const exampleControllerInstance = new ExampleControllerClass();
exampleControllerInstance['initialize']();
```

### Paso 2: Exportar Funciones para Endpoints

```typescript
// Funciones exportadas para usar en las rutas
export async function createAsyncProcess(req: Request, res: Response, next: NextFunction) {
  try {
    // Validaciones específicas
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({
        success: false,
        error: 'Datos requeridos'
      });
    }

    // Crear job usando BaseController
    await exampleControllerInstance['createAsyncJob']({
      type: 'data_processing',
      priority: 'normal',
      subType: 'process_data',
      payload: { data },
      estimatedDuration: '5-10 minutes'
    }, req, res, next);

  } catch (error) {
    return next(error);
  }
}
```

---

## Creación de Procesadores de Jobs

### Estructura de un Procesador

```typescript
private async processorName(payload: any, context: any): Promise<void> {
  const { reportProgress, reportCompleted, reportError, jobId, userId } = context;
  
  try {
    // 1. Validar datos de entrada
    if (!payload.requiredField) {
      throw new Error('Campo requerido faltante');
    }

    // 2. Inicializar progreso
    reportProgress(0, 'Iniciando procesamiento...');

    // 3. Procesar datos en chunks
    const items = payload.items;
    for (let i = 0; i < items.length; i++) {
      // Procesar item
      await processItem(items[i]);
      
      // Reportar progreso periódicamente
      if ((i + 1) % 10 === 0 || i === items.length - 1) {
        const progress = Math.round(((i + 1) / items.length) * 90);
        reportProgress(progress, `Procesados ${i + 1}/${items.length} elementos`);
      }
    }

    // 4. Generar resultado
    reportProgress(95, 'Generando resultado...');
    const resultUrl = await generateResult();

    // 5. Completar job
    reportProgress(100, 'Proceso completado');
    reportCompleted(resultUrl);

  } catch (error) {
    reportError(error instanceof Error ? error.message : 'Error desconocido');
  }
}
```

### Patrones Comunes

#### Procesamiento por Lotes
```typescript
// Procesar en chunks para manejar grandes volúmenes
const chunkSize = 100;
for (let i = 0; i < items.length; i += chunkSize) {
  const chunk = items.slice(i, i + chunkSize);
  await processChunk(chunk);
  
  const progress = Math.min(((i + chunkSize) / items.length) * 90, 90);
  reportProgress(progress, `Procesados ${Math.min(i + chunkSize, items.length)}/${items.length}`);
}
```

#### Manejo de Errores Parciales
```typescript
let successCount = 0;
let errorCount = 0;
const errors: string[] = [];

for (const item of items) {
  try {
    await processItem(item);
    successCount++;
  } catch (error) {
    errorCount++;
    errors.push(`Item ${item.id}: ${error.message}`);
  }
}

// Incluir resumen en el resultado
const resultUrl = generateResultWithSummary({
  total: items.length,
  success: successCount,
  errors: errorCount,
  errorDetails: errors.slice(0, 100) // Limitar errores
});
```

#### Generación de URLs de Resultado
```typescript
// Para datos pequeños (< 1MB) - Data URL
const resultUrl = `data:application/json;base64,${Buffer.from(JSON.stringify(data)).toString('base64')}`;

// Para archivos grandes - URL de Azure Blob Storage (en producción)
const resultUrl = await uploadToAzureBlob(data, `results/${jobId}.json`);
```

---

## Uso de Jobs en Endpoints

### Patrón Estándar para Endpoints Asíncronos

```typescript
export async function asyncEndpoint(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. Validar entrada
    const validatedData = ValidationSchema.parse(req.body);
    
    // 2. Validaciones de negocio
    if (await someBusinessValidation(validatedData)) {
      return res.status(400).json({
        success: false,
        error: 'Validación de negocio falló'
      });
    }

    // 3. Crear job asíncrono
    await controllerInstance['createAsyncJob']({
      type: 'data_processing',           // Tipo de job
      priority: 'normal',                // Prioridad
      subType: 'specific_processor',     // Procesador específico
      payload: validatedData,            // Datos para el procesador
      estimatedDuration: '5-10 minutes'  // Duración estimada
    }, req, res, next);

  } catch (error) {
    return next(error);
  }
}
```

### Respuesta Estándar

El cliente recibe inmediatamente una respuesta **202 Accepted**:

```json
{
  "success": true,
  "data": {
    "jobId": "uuid-del-job",
    "status": "queued",
    "type": "data_processing",
    "createdAt": "2025-09-11T10:00:00.000Z",
    "estimatedDuration": "5-10 minutes",
    "progress": 0
  },
  "message": "Proceso specific_processor iniciado. Use el jobId para consultar el progreso."
}
```

---

## Monitoreo y Gestión de Jobs

### Consultar Estado de Job

```typescript
// GET /jobs/:jobId
{
  "jobId": "uuid-del-job",
  "status": "progress",        // queued | started | progress | completed | failed | cancelled
  "type": "data_processing",
  "progress": 45,              // 0-100
  "createdAt": "2025-09-11T10:00:00.000Z",
  "estimatedDuration": "5-10 minutes",
  "resultUrl": null           // URL cuando se complete
}
```

### Estados de Job

- **queued**: Job creado, esperando ejecución
- **started**: Job iniciado en worker thread
- **progress**: Job en progreso (con porcentaje)
- **completed**: Job completado exitosamente
- **failed**: Job falló con error
- **cancelled**: Job cancelado por usuario

### Cancelar Job

```typescript
// DELETE /jobs/:jobId
// Respuesta: 204 No Content (si se cancela exitosamente)
```

### Listar Jobs

```typescript
// GET /jobs?status=progress&limit=20&offset=0
{
  "success": true,
  "data": [/* array de jobs */],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

---

## Ejemplos Prácticos

### Ejemplo 1: Importación Masiva de Usuarios

**Endpoint**: `POST /users/bulk-import`

```typescript
// Payload
{
  "users": [
    { "name": "Usuario 1", "email": "user1@example.com", "role": "user" },
    { "name": "Usuario 2", "email": "user2@example.com", "role": "user" }
  ],
  "notifyUsers": true
}

// Procesador
private async processBulkImportUsers(payload: any, context: any): Promise<void> {
  const { users, notifyUsers } = payload;
  const { reportProgress, reportCompleted } = context;
  
  reportProgress(5, 'Iniciando importación...');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < users.length; i++) {
    try {
      const user = await UserService.createUser(users[i]);
      successCount++;
      
      if (notifyUsers) {
        await UserService.sendWelcomeEmail(user.email);
      }
      
      // Progreso 5-95%
      const progress = 5 + Math.round((i + 1) / users.length * 90);
      reportProgress(progress, `Procesados ${i + 1}/${users.length} usuarios`);
      
    } catch (error) {
      errorCount++;
    }
  }
  
  const resultUrl = `data:application/json;base64,${Buffer.from(JSON.stringify({
    summary: { total: users.length, success: successCount, errors: errorCount }
  })).toString('base64')}`;
  
  reportProgress(100, 'Importación completada');
  reportCompleted(resultUrl);
}
```

### Ejemplo 2: Generación de Reporte

**Endpoint**: `POST /products/inventory-report`

```typescript
// Payload
{
  "filters": {
    "category": "electronics",
    "minStock": 10,
    "dateRange": {
      "start": "2025-01-01",
      "end": "2025-09-11"
    }
  }
}

// Procesador
private async processGenerateInventoryReport(payload: any, context: any): Promise<void> {
  const { filters } = payload;
  const { reportProgress, reportCompleted } = context;
  
  reportProgress(10, 'Obteniendo datos...');
  const products = await ProductService.getFilteredProducts(filters);
  
  reportProgress(40, 'Calculando métricas...');
  const metrics = await calculateInventoryMetrics(products);
  
  reportProgress(70, 'Generando reporte...');
  const report = await generateReportDocument(products, metrics);
  
  reportProgress(90, 'Subiendo archivo...');
  const resultUrl = await uploadReportToStorage(report);
  
  reportProgress(100, 'Reporte completado');
  reportCompleted(resultUrl);
}
```

---

## Mejores Prácticas

### 1. Diseño de Procesadores

- **Granularidad**: Reportar progreso cada 10-100 elementos procesados
- **Manejo de errores**: Capturar errores específicos y continuar procesamiento
- **Timeouts**: Implementar timeouts para operaciones externas
- **Idempotencia**: Los procesadores deben ser idempotentes cuando sea posible

### 2. Validación de Datos

```typescript
// Validar en el endpoint antes de crear el job
const validatedData = ValidationSchema.parse(req.body);

// Validar también en el procesador
private async processor(payload: any, context: any): Promise<void> {
  const requiredFields = ['field1', 'field2'];
  const errors = this.validateJobParameters(payload, requiredFields);
  
  if (errors.length > 0) {
    throw new Error(`Campos requeridos: ${errors.join(', ')}`);
  }
  
  // Continuar procesamiento...
}
```

### 3. Logging y Monitoreo

```typescript
// En el procesador
private async processor(payload: any, context: any): Promise<void> {
  const { jobId, userId } = context;
  
  logger.info('Job started', { jobId, userId, type: 'bulk_import' });
  
  try {
    // Procesamiento...
    logger.info('Job completed successfully', { jobId, itemsProcessed: count });
  } catch (error) {
    logger.error('Job failed', { jobId, error: error.message });
    throw error;
  }
}
```

### 4. Gestión de Memoria

```typescript
// Procesar en chunks para grandes volúmenes
const CHUNK_SIZE = 1000;
for (let i = 0; i < items.length; i += CHUNK_SIZE) {
  const chunk = items.slice(i, i + CHUNK_SIZE);
  await processChunk(chunk);
  
  // Permitir que el garbage collector actúe
  if (i % (CHUNK_SIZE * 10) === 0) {
    await new Promise(resolve => setImmediate(resolve));
  }
}
```

### 5. Configuración de Prioridades

```typescript
// Alta prioridad: Procesos críticos de usuario
priority: 'high'    // Emails de bienvenida, notificaciones urgentes

// Normal: Operaciones estándar
priority: 'normal'  // Importaciones, exportaciones

// Baja: Procesos de mantenimiento
priority: 'low'     // Limpieza de datos, reportes programados
```

---

## Solución de Problemas

### Problemas Comunes

#### 1. Job se queda en estado "queued"

**Causas**:
- Worker thread no puede inicializarse
- Error en la importación del procesador
- Procesador no registrado

**Solución**:
```typescript
// Verificar que el procesador esté registrado
console.log(BaseController.getRegisteredProcessors());

// Verificar logs del worker
logger.error('Worker error details', { error });
```

#### 2. Job falla inmediatamente

**Causas**:
- Error en validación de datos
- Dependencias no disponibles
- Error en el procesador

**Solución**:
```typescript
// Agregar validación robusta
private async processor(payload: any, context: any): Promise<void> {
  try {
    // Validar todos los datos requeridos
    if (!payload || !payload.requiredField) {
      throw new Error('Datos de entrada inválidos');
    }
    
    // Verificar dependencias
    await checkDependencies();
    
    // Procesamiento...
  } catch (error) {
    logger.error('Processor error', { error, payload });
    throw error;
  }
}
```

#### 3. Progreso no se actualiza

**Causas**:
- No se llama a `reportProgress`
- Worker thread terminado inesperadamente

**Solución**:
```typescript
// Asegurar llamadas regulares a reportProgress
for (let i = 0; i < items.length; i++) {
  await processItem(items[i]);
  
  // Reportar progreso cada 10 elementos
  if (i % 10 === 0 || i === items.length - 1) {
    reportProgress(calculateProgress(i, items.length), `Procesados ${i + 1}/${items.length}`);
  }
}
```

### Debugging

#### Logs Importantes

```typescript
// JobService
logger.info('Job created', { jobId, type, priority });
logger.info('Worker started', { jobId, workerPath });
logger.error('Worker error', { jobId, error });

// Worker
logger.debug('Processing job', { jobId, subType });
logger.info('Job progress', { jobId, progress });
logger.info('Job completed', { jobId, resultUrl });
```

#### Monitoreo de Worker Threads

```typescript
// En JobService - agregar monitoreo
worker.on('message', (message) => {
  logger.debug('Worker message', { jobId, messageType: message.type });
});

worker.on('exit', (code) => {
  logger.info('Worker exited', { jobId, exitCode: code });
});
```

---

## Extensiones Futuras

### Integración con Azure Service Bus

Para entornos de producción, se puede integrar con Azure Service Bus:

```typescript
// En lugar de setTimeout, usar Azure Service Bus
const message = {
  jobId,
  type: config.type,
  parameters: config.parameters
};

await serviceBusClient.createSender('job-queue').sendMessages(message);
```

### Persistencia de Jobs

Agregar base de datos para persistir jobs:

```typescript
// Guardar job en base de datos
await JobRepository.create({
  jobId,
  status: 'queued',
  type: config.type,
  parameters: config.parameters,
  createdAt: new Date()
});
```

### Métricas y Alertas

Implementar métricas para monitoreo:

```typescript
// Métricas de jobs
metrics.increment('jobs.created', { type: config.type });
metrics.timing('jobs.duration', duration, { type: config.type });
metrics.gauge('jobs.active', activeJobsCount);
```

---

Esta guía cubre todos los aspectos del sistema de jobs asíncronos. Para implementaciones específicas, consultar los ejemplos en `UserController` y `ProductController`.