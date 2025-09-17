// Importa los tipos JobType y JobPriority del modelo de trabajo, renombrados con prefijo _
import { JobType as _JobType, JobPriority as _JobPriority } from '../shared/models/job.model.js';

// Importa el decorador Controller para marcar clases como controladores
import { Controller } from '../decorators/controller.decorator.js';

// Importa todos los decoradores de rutas HTTP (GET, POST, PUT, DELETE, PATCH)
import { Get, Post, Put, Delete, Patch } from '../decorators/route.decorator.js';

// Importa el decorador Job para manejar trabajos asíncronos o en segundo plano
import { Job } from '../decorators/job.decorator.js';

// Define la clase base que exporta todos los decoradores y tipos como propiedades estáticas
export class BaseController {
    // Expone el enum JobType como propiedad estática de la clase
    static JobType = _JobType;
    
    // Expone el enum JobPriority como propiedad estática de la clase
    static JobPriority = _JobPriority;
    
    // Expone el decorador Controller como propiedad estática
    static Controller = Controller;
    
    // Expone el decorador Post como propiedad estática
    static Post = Post;
    
    // Expone el decorador Get como propiedad estática
    static Get = Get;
    
    // Expone el decorador Put como propiedad estática
    static Put = Put;
    
    // Expone el decorador Delete como propiedad estática
    static Delete = Delete;
    
    // Expone el decorador Patch como propiedad estática
    static Patch = Patch;
    
    // Expone el decorador Job como propiedad estática
    static Job = Job;
}

// Define una interfaz que extiende BaseController (actualmente vacía, pero permite extensiones futuras)
export interface IBaseController extends BaseController {}