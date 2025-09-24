// ============================================================================
// ROUTE DECORATOR - Sistema de decoradores para rutas HTTP
// 
// Este archivo implementa el sistema de decoradores que permite definir
// rutas HTTP de manera declarativa usando annotations como @Get(), @Post(), etc.
// Los decoradores almacenan metadata que posteriormente es utilizada por
// el framework para configurar automáticamente las rutas de Express.
// ============================================================================

// Importa la biblioteca reflect-metadata que habilita el sistema de metadata
// Necesario para usar Reflect.defineMetadata() y Reflect.getMetadata()
import 'reflect-metadata';

// Importa la interfaz que define la estructura de los metadatos de ruta
// DRoute especifica qué información se almacena: method, path, handlerName
import { DRoute } from '../shared/models/dRoutes.model.js';

// Crea un Symbol único para identificar los metadatos de rutas
// Symbol evita colisiones con otras propiedades y garantiza unicidad
const ROUTE_METADATA = Symbol('routes');

// Factory function que crea decoradores específicos para cada método HTTP
// Retorna una función que puede ser usada como decorador (@Get, @Post, etc.)
function createRouteDecorator(method: string) {
  
  // Primera función: recibe el path del endpoint (ej: '/users', '/products/:id')
  return function (path: string) {
    
    // Segunda función: el decorador real que recibe los metadatos del método decorado
    // target: la clase que contiene el método
    // propertyKey: nombre del método siendo decorado
    // _descriptor: descriptor del método (no usado, por eso el underscore)
    return function (target: any, propertyKey: string, _descriptor: PropertyDescriptor) {
      
      // Obtiene los metadatos de rutas existentes para esta clase
      // Si no existen, inicializa como array vacío
      // target.constructor se usa porque queremos metadatos a nivel de clase
      const existingRoutes: DRoute[] = Reflect.getMetadata(ROUTE_METADATA, target.constructor) || [];

      // Agrega la nueva ruta al array de rutas existentes
      // Crea un objeto DRoute con la información del endpoint
      existingRoutes.push({
        method: method.toUpperCase(), // Convierte a mayúsculas: 'get' -> 'GET'
        path,                        // Path del endpoint: '/', '/users/:id'
        handlerName: propertyKey     // Nombre del método: 'getUsers', 'createProduct'
      });
      
      // Guarda el array actualizado de rutas en los metadatos de la clase
      // Esto persiste la información para uso posterior del framework
      Reflect.defineMetadata(ROUTE_METADATA, existingRoutes, target.constructor);
    };
  };
}

// Crea el decorador @Get usando la factory function
// Ejemplo de uso: @Get('/users') async getUsers() {}
export const Get = createRouteDecorator('GET');

// Crea el decorador @Post usando la factory function  
// Ejemplo de uso: @Post('/users') async createUser() {}
export const Post = createRouteDecorator('POST');

// Crea el decorador @Put usando la factory function
// Ejemplo de uso: @Put('/users/:id') async updateUser() {}
export const Put = createRouteDecorator('PUT');

// Crea el decorador @Delete usando la factory function
// Ejemplo de uso: @Delete('/users/:id') async deleteUser() {}
export const Delete = createRouteDecorator('DELETE');

// Crea el decorador @Patch usando la factory function
// Ejemplo de uso: @Patch('/users/:id') async patchUser() {}
export const Patch = createRouteDecorator('PATCH');

// Función utilitaria para recuperar todos los metadatos de rutas de una clase
// Utilizada por el framework para obtener las rutas definidas y configurar Express
// target: la clase controlador de la cual obtener las rutas
// Retorna: array de objetos DRoute con todas las rutas definidas en la clase
export function getRouteMetadata(target: any): DRoute[] {
  // Recupera los metadatos almacenados, retorna array vacío si no existen
  return Reflect.getMetadata(ROUTE_METADATA, target) || [];
}