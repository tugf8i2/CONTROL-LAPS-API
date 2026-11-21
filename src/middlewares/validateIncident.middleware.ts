import type { Request, Response, NextFunction } from "express";

const PRIORITIES = ["BAJA", "MEDIA", "ALTA"];
const STATUSES = ["PENDIENTE", "EN_PROCESO", "RESUELTA"];
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const isUuid = (value: unknown): value is string =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

export const validateIncidentPayload = (req: Request, res: Response, next: NextFunction): void => {
  const body: unknown = req.body;
  const valid = isRecord(body) &&
    Object.keys(body).length === 4 &&
    Object.keys(body).every((key) => ["equipmentId", "reportedBy", "descripcion", "prioridad"].includes(key)) &&
    isUuid(body.equipmentId) &&
    isUuid(body.reportedBy) &&
    typeof body.descripcion === "string" &&
    body.descripcion.trim().length > 0 &&
    typeof body.prioridad === "string" &&
    PRIORITIES.includes(body.prioridad);

  if (!valid) {
    res.status(400).json({
      success: false,
      code: "VALIDATION_ERROR",
      error: "Datos de la novedad inválidos."
    });
    return;
  }
  next();
};

export const validateIncidentStatusPayload = (req: Request, res: Response, next: NextFunction): void => {
  const body: unknown = req.body;
  const valid = isRecord(body) &&
    Object.keys(body).length === 1 &&
    typeof body.estado === "string" &&
    STATUSES.includes(body.estado);

  if (!valid) {
    res.status(400).json({
      success: false,
      code: "VALIDATION_ERROR",
      error: "El body debe contener un estado válido."
    });
    return;
  }
  next();
};