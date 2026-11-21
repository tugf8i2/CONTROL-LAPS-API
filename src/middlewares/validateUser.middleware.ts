import type { Request, Response, NextFunction } from "express";
import type { ICreateUserDTO, IUpdateUserDTO } from "../dtos/user.dto.js";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isRole = (value: unknown): boolean =>
  value === "ADMIN" || value === "GUARDA" || value === "INSTRUCTOR";

const isEmail = (value: unknown): value is string =>
  typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const isCreateUserDTO = (value: unknown): value is ICreateUserDTO => {
  if (!isRecord(value)) return false;
  const allowed = new Set(["nombre", "email", "rol"]);
  return Object.keys(value).every((key) => allowed.has(key)) &&
    typeof value.nombre === "string" && value.nombre.trim().length > 0 &&
    isEmail(value.email) &&
    isRole(value.rol);
};

const isUpdateUserDTO = (value: unknown): value is IUpdateUserDTO => {
  if (!isRecord(value)) return false;
  const allowed = new Set(["nombre", "email", "rol"]);
  const keys = Object.keys(value);
  return keys.length > 0 && keys.every((key) => allowed.has(key)) &&
    (value.nombre === undefined || (typeof value.nombre === "string" && value.nombre.trim().length > 0)) &&
    (value.email === undefined || isEmail(value.email)) &&
    (value.rol === undefined || isRole(value.rol));
};

export const validateUserPayload = (req: Request, res: Response, next: NextFunction): void => {
  if (!isCreateUserDTO(req.body)) {
    res.status(400).json({
      success: false,
      code: "VALIDATION_ERROR",
      error: "Datos de usuario inválidos. Se requieren nombre, email válido y rol permitido."
    });
    return;
  }
  next();
};

export const validateUserUpdatePayload = (req: Request, res: Response, next: NextFunction): void => {
  if (!isUpdateUserDTO(req.body)) {
    res.status(400).json({
      success: false,
      code: "VALIDATION_ERROR",
      error: "Envía al menos un campo editable: nombre, email o rol."
    });
    return;
  }
  next();
};

export const validateUserActivePayload = (req: Request, res: Response, next: NextFunction): void => {
  if (!isRecord(req.body) || typeof req.body.activo !== "boolean" || Object.keys(req.body).some((key) => key !== "activo")) {
    res.status(400).json({
      success: false,
      code: "VALIDATION_ERROR",
      error: "El campo activo debe ser booleano."
    });
    return;
  }
  next();
};