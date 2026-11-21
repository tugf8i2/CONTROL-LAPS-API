import type { Request, Response, NextFunction } from "express";

const TYPES = ["COMPUTADOR", "MOUSE", "TECLADO", "CARGADOR", "TELEVISOR", "CONTROL_TV"];
const STATUSES = ["OPERATIVO", "MANTENIMIENTO", "FUERA_DE_SERVICIO"];
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const isUuid = (value: unknown): value is string =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
const isType = (value: unknown): boolean => typeof value === "string" && TYPES.includes(value);
const isStatus = (value: unknown): boolean => typeof value === "string" && STATUSES.includes(value);

const isEquipmentPayload = (value: unknown, partial: boolean): boolean => {
  if (!isRecord(value)) return false;
  const allowed = new Set(["placaSena", "codigoActivo", "tipo", "roomId", "estado"]);
  if (Object.keys(value).some((key) => !allowed.has(key)) || Object.keys(value).length === 0) return false;
  const textField = (field: string): boolean =>
    value[field] === undefined ? partial : typeof value[field] === "string" && (value[field] as string).trim().length > 0;

  return textField("placaSena") && textField("codigoActivo") &&
    (value.tipo === undefined ? partial : isType(value.tipo)) &&
    (value.roomId === undefined ? partial : isUuid(value.roomId)) &&
    (value.estado === undefined || isStatus(value.estado));
};

export const validateEquipoPayload = (req: Request, res: Response, next: NextFunction): void => {
  if (!isEquipmentPayload(req.body, false)) {
    res.status(400).json({
      success: false,
      code: "VALIDATION_ERROR",
      error: "Datos inválidos. Se requieren placaSena, codigoActivo, tipo y roomId válidos."
    });
    return;
  }
  next();
};

export const validateEquipoUpdatePayload = (req: Request, res: Response, next: NextFunction): void => {
  if (!isEquipmentPayload(req.body, true)) {
    res.status(400).json({
      success: false,
      code: "VALIDATION_ERROR",
      error: "Envía al menos un campo válido para actualizar el equipo."
    });
    return;
  }
  next();
};