// ---------------------------------------------------
// auth.middleware.ts - Middleware de autenticación JWT
//
// Este archivo define el middleware para verificar y validar tokens JWT en las rutas protegidas.
// Permite autorizar requests, extraer información del usuario y controlar acceso por roles.
// ---------------------------------------------------

// Importa los tipos de Express para definir el middleware
import { Request, Response, NextFunction } from 'express';
// Importa jsonwebtoken para verificar tokens
import jwt from 'jsonwebtoken';
// Importa la configuración global
import { config } from '../config/config.js';
// Importa el logger para registrar eventos de autenticación
import { logger } from '../utils/logger.js';

// Extiende la interfaz Request de Express para incluir información del usuario
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      userId: string;
      email: string;
      role: string;
    };
  }
}

// Middleware para verificar token JWT
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Extrae el token del header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  // Si no hay token, devuelve error 401
  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Token de acceso requerido',
    });
    return;
  }

  // Verifica el token
  jwt.verify(token, config.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      // Token inválido o expirado
      logger.warn('Invalid token attempt', { error: err.message, ip: req.ip });
      res.status(403).json({
        success: false,
        error: 'Token inválido o expirado',
      });
      return;
    }

    // Agrega la información del usuario al request
    req.user = decoded as { userId: string; email: string; role: string };
    next();
  });
};

// Middleware para verificar roles específicos
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Verifica que el usuario esté autenticado
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Autenticación requerida',
      });
      return;
    }

    // Verifica que el usuario tenga el rol requerido
    if (!roles.includes(req.user.role)) {
      logger.warn('Unauthorized role access attempt', {
        userId: req.user.userId,
        userRole: req.user.role,
        requiredRoles: roles,
        endpoint: req.path,
      });
      res.status(403).json({
        success: false,
        error: 'Permisos insuficientes',
      });
      return;
    }

    next();
  };
};
