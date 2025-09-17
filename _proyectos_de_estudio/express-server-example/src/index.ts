import express from "express";
import reportRouter from "./routes/routes"; // renombrado
import { errorHandler, getLoggedErrors } from "./middlewares/errorHandler";
import { AppError } from "./middlewares/appError";
import dotenvFlow from 'dotenv-flow';

dotenvFlow.config();

const app = express();
app.use(express.json());

// Healthcheck
app.get("/ping", (_req, res) => {
  res.send("pong");
});

// API genérica para reports
app.use("/api/reports", reportRouter);

// Endpoint para consultar errores registrados
app.get("/api/errors", (_req, res) => {
  res.json(getLoggedErrors());
});

// Endpoint para probar error inesperado
app.get("/api/force-error", () => {
  throw new Error("❌ Bug inesperado!");
});

// Endpoint para probar un error controlado con AppError
app.get("/api/force-app-error", () => {
  throw new AppError("⚠️ Error esperado (bad request)", 400);
});

// Middleware de errores (al final SIEMPRE)
app.use(errorHandler);

// Captura errores no manejados en promesas
process.on("unhandledRejection", (reason: any) => {
  errorHandler(
    reason instanceof Error ? reason : new Error(String(reason)),
    null,
    null
  );
});

// Captura errores no manejados a nivel global
process.on("uncaughtException", (error: Error) => {
  errorHandler(error, null, null);
});

// TODO: Configurar el puerto en una variable de entorno para producción y local.

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);