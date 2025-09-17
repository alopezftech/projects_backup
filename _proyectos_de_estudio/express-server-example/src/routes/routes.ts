import express, { Request, Response, NextFunction } from "express";
import * as reportServices from "../services/dataServices";
import toNewExampleReport from "../shared/validations";
import { AppError } from "../middlewares/appError";

const router = express.Router();

// Listar todos (sin info sensible)
router.get("/", (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.send(reportServices.getEntriesWithoutSensitiveInfo());
  } catch (err) {
    next(err);
  }
});

// Buscar por ID
router.get("/:id", (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new AppError("Missing parameter 'id'", 400);
    }

    const report = reportServices.findById(Number(id));
    if (!report) {
      throw new AppError("Report not found", 404);
    }

    res.send(report);
  } catch (err) {
    next(err);
  }
});

// Crear nuevo
router.post("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const newReport = toNewExampleReport(req.body);
    const addedReport = reportServices.addEntry(newReport);
    res.json(addedReport);
  } catch (err) {
    next(err);
  }
});

// Actualizar
router.put("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const parsedReport = toNewExampleReport(req.body);
    const updatedReport = reportServices.updateEntry(id, parsedReport);
    res.json(updatedReport);
  } catch (err) {
    next(err);
  }
});

// Eliminar
router.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    reportServices.deleteEntry(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
