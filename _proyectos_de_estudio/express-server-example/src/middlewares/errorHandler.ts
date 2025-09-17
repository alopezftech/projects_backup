import { Request, Response, NextFunction } from "express";
import { AppError } from "./appError";

const errors: any[] = [];

/**
 * Middleware centralizado de errores
 * - Captura errores de Express (req/res definidos)
 * - También puede registrar errores globales (sin req/res)
 */
export const errorHandler = (
  err: Error | AppError,
  req?: Request | null,
  res?: Response | null,
  _next?: NextFunction
) => {
  console.error("🔥 Error capturado:", err.message);

  const statusCode = err instanceof AppError ? err.statusCode : 500;

  // Registramos en memoria
  errors.push({
    mensaje: err.message,
    stack: err.stack,
    ruta: req ? req.originalUrl : "N/A (global error)",
    metodo: req ? req.method : "N/A",
    fecha: new Date().toISOString(),
    status: statusCode,
  });

  // Si hay response (caso Express), devolvemos al cliente
  if (res) {
    res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Ha ocurrido un error inesperado",
    });
  }
};

export const getLoggedErrors = () => errors;
