import { Router } from 'express';
import { Express } from 'express';
import { getControllerMetadata } from '../decorators/controller.decorator.js';
import { getRouteMetadata } from '../decorators/route.decorator.js';
import { BaseController } from 'controllers/base.controller.js';
import { DRoute } from '../shared/models/dRoutes.model.js';

interface ControllerClass {
  new (): BaseController;
  name: string;
}
export class MetadataService {
  static registerController(ControllerClass: ControllerClass): Router {
    const router = Router();
    const controllerMetadata = getControllerMetadata(ControllerClass);
    const routeMetadata: DRoute[] = getRouteMetadata(ControllerClass);

    if (!controllerMetadata) {
      throw new Error(`Controller ${ControllerClass.name} must have @Controller decorator`);
    }

    const controllerInstance = new ControllerClass();

    routeMetadata.forEach((route: DRoute) => {
      
      const controllerAsRecord = controllerInstance as Record<string, Function>;

      if (typeof controllerAsRecord[route.handlerName] !== 'function') {
        throw new Error(`Handler '${route.handlerName}' is not a function in controller ${ControllerClass.name}`);
      }
      const handler = (controllerAsRecord[route.handlerName] as Function).bind(controllerInstance);

      switch (route.method) {
        case 'GET':
          router.get(route.path, handler);
          break;
        case 'POST':
          router.post(route.path, handler);
          break;
        case 'PUT':
          router.put(route.path, handler);
          break;
        case 'DELETE':
          router.delete(route.path, handler);
          break;
        case 'PATCH':
          router.patch(route.path, handler);
          break;
      }
    });

    return router;
  }

  static registerControllers(app: Express, controllers: any[]) {
    controllers.forEach(ControllerClass => {
      const controllerMetadata = getControllerMetadata(ControllerClass);
      const router = this.registerController(ControllerClass);
      app.use(controllerMetadata.path, router);
    });
  }
}