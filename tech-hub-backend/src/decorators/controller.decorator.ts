import 'reflect-metadata';
import { JobManager } from '../services/job.manager.js';

const CONTROLLER_METADATA = Symbol('controller');

export function Controller(path: string) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    Reflect.defineMetadata(CONTROLLER_METADATA, { path }, constructor);
    
    // Interceptar el constructor para registrar la instancia en JobManager
    const originalConstructor = constructor;
    
    const newConstructor = class extends originalConstructor {
      constructor(...args: any[]) {
        super(...args);
        // Registrar la instancia en JobManager
        JobManager.registerControllerInstance(constructor.name, this);
        
        // Ejecutar registros de jobs pendientes
        if ((constructor as any)._jobRegistrations) {
          (constructor as any)._jobRegistrations.forEach((registerFn: Function) => {
            registerFn(this);
          });
        }
      }
    };
    
    // Copiar metadatos del constructor original
    Object.defineProperty(newConstructor, 'name', { value: constructor.name });
    
    return newConstructor as any;
  };
}

export function getControllerMetadata(target: any) {
  return Reflect.getMetadata(CONTROLLER_METADATA, target);
}