export interface RouteMetadata {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  handlerName: string;
}

export interface ControllerMetadata {
  path: string;
  target: any;
  routes: RouteMetadata[];
}

export interface JobMetadata {
  methodName: string;
  target: any;
  jobType?: string;
  priority?: 'low' | 'normal' | 'high';
}