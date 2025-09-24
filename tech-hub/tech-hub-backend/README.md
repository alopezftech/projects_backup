# Documentación funcional:

- TechHubBackend es una plantilla backend base para la gestión de entidades, autenticación, tareas asíncronas, logging, seguridad y comunicación en tiempo real para microfrontends Electron.  
  Incluye ejemplos completos de gestión de usuarios (registro, login, actualización, eliminación) y de creación/seguimiento de tareas asíncronas , en este ejémplo ,  asociadas a usuarios (importación masiva, exportación, envío de emails de bienvenida).

# Documentación técnica:

## Fuente de datos:

- Utiliza variables de entorno definidas en `src/config/config.ts` para configuración.
- Los datos de usuarios y jobs se almacenan temporalmente en memoria (Map), simulando el comportamiento de una base de datos.
- Opcionalmente puede conectarse a Azure Service Bus y Redis si se configuran las credenciales.
- No requiere base de datos en desarrollo, pero está preparado para integrarse con una en producción.

## Salida de datos:

- Expone una API REST bajo `/api` para operaciones sobre entidades (usuarios, jobs) y health check.
- Permite exportar usuarios y consultar el estado de trabajos asíncronos.
- Proporciona comunicación en tiempo real mediante WebSocket (Socket.IO) para actualizaciones de jobs.
- Los logs se almacenan según la configuración del logger (por defecto en consola).

## Ejecución:

- Modo de ejecución: Manual, ejecutando `npm start` o `node src/server.ts` desde la raíz del proyecto. Puede automatizarse en entornos cloud, contenedores o pipelines CI/CD.
- Recurrencia de ejecución: El servidor permanece activo y responde a peticiones mientras está en ejecución.

## Tecnología:

- Node.js, Express.js, TypeScript, Socket.IO, Azure Service Bus (opcional), Redis (opcional).

## Observaciones:

- Toda la lógica de usuarios, autenticación y tareas asíncronas está implementada como ejemplo funcional, con almacenamiento en memoria y sin persistencia real.
- El sistema de jobs permite simular procesos largos como importación/exportación masiva y envío de emails, mostrando cómo se gestionan y monitorizan tareas asíncronas en el backend.
- Incluye manejo global de errores, logging estructurado, rate limiting y seguridad HTTP.
- Preparado para escalar horizontalmente y servir múltiples microfrontends Electron.
- La configuración se realiza mediante variables de entorno.

## Persona de contacto:

- @alopezf

- @yzamora

## Enlace al repositorio:

- https://dev.azure.com/techtituteDevOps/PMO/_git/TechHubBackend

## Documentación extendida

-Para más detalles técnicos y ejemplos, consulta docs/docs.md
