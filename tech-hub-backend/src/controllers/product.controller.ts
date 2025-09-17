// Importa los tipos de Express para manejar peticiones, respuestas y middleware
import { Request, Response, NextFunction } from 'express';

// Importa la clase base y su interfaz para heredar funcionalidad común
import { IBaseController, BaseController } from './base.controller.js';

// Importa el tipo y esquema de validación para la creación de productos
import {
  ProductCreate,
  ProductCreateSchema,
} from '../schemas/product.schema.js';

// Importa el servicio que contiene la lógica de negocio para productos
import { ProductService } from '../services/product.service.js';

// Aplica el decorador Controller para definir la ruta base '/products' para este controlador
@BaseController.Controller('/products')
export class ProductController implements IBaseController {

  // Aplica el decorador Post para manejar peticiones POST a la ruta '/'
  @BaseController.Post('/')
  // Aplica el decorador Job para configurar este método como un trabajo con prioridad normal y tipo de procesamiento de datos
  @BaseController.Job({ priority: BaseController.JobPriority.NORMAL, type: BaseController.JobType.DATA_PROCESSING })
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      // Valida los datos del cuerpo de la petición usando el esquema ProductCreateSchema
      // y los asigna al tipo ProductCreate (omite id y fechas automáticas)
      const validatedData: ProductCreate = ProductCreateSchema.parse(req.body);

      // Llama al servicio para crear el producto con los datos validados
      const createdProduct = await ProductService.createProduct(validatedData);
      
      // Devuelve una respuesta exitosa con código 201 (Created) y los datos del producto creado
      return res.status(201).json({ success: true, data: createdProduct });
    } catch (error) {
      // Si ocurre un error, lo pasa al siguiente middleware (manejador de errores)
      next(error);
      return; // Asegura que todos los caminos de código retornen algo
    }
  }
}