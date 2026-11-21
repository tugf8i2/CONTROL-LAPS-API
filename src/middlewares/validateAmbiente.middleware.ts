import type { Request, Response, NextFunction } from "express";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isStatus = (value: unknown): boolean =>
  value === "OPERATIVO" || value === "MANTENIMIENTO" || value === "INACTIVO";

const isRoomPayload = (value: unknown, partial: boolean): boolean => {
  if (!isRecord(value)) return false;
  const allowed = new Set(["nombre", "bloque", "capacidadPcs", "estado"]);
  if (Object.keys(value).some((key) => !allowed.has(key))) return false;

  const validNombre = value.nombre === undefined
    ? partial
    : typeof value.nombre === "string" && value.nombre.trim().length > 0;
  const validBloque = value.bloque === undefined
    ? partial
    : typeof value.bloque === "string" && value.bloque.trim().length > 0;
  const validCapacity = value.capacidadPcs === undefined
    ? partial
    : typeof value.capacidadPcs === "number" && Number.isInteger(value.capacidadPcs);
  const validStatus = value.estado === undefined ? true : isStatus(value.estado);

  return Object.keys(value).length > 0 && validNombre && validBloque && validCapacity && validStatus;
};

export const validateAmbientePayload = (req: Request, res: Response, next: NextFunction): void => {
  if (!isRoomPayload(req.body, false)) {
    res.status(400).json({
      success: false,
      code: "VALIDATION_ERROR",
      error: "Datos del ambiente inválidos. Revisa nombre, bloque, capacidadPcs y estado."
    });
    return;
  }
  next();
};

export const validateAmbienteUpdatePayload = (req: Request, res: Response, next: NextFunction): void => {
  if (!isRoomPayload(req.body, true)) {
    res.status(400).json({
      success: false,
      code: "VALIDATION_ERROR",
      error: "Envía al menos un campo válido para actualizar el ambiente."
    });
    return;
  }
  next();
};