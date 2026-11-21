import type { Request, Response, NextFunction } from "express";
import { DomainError } from "../errors/domain.error.js";

const domainErrorStatus: Record<DomainError["code"], number> = {
  VALIDATION_ERROR: 400,
  NOT_FOUND: 404,
  CONFLICT: 409
};

const prismaCode = (error: unknown): string | undefined => {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return undefined;
  }
  const code = (error as { code?: unknown }).code;
  return typeof code === "string" ? code : undefined;
};

export const globalErrorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof DomainError) {
    res.status(domainErrorStatus[error.code]).json({
      success: false,
      code: error.code,
      error: error.message
    });
    return;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    error.type === "entity.parse.failed"
  ) {
    res.status(400).json({
      success: false,
      code: "INVALID_JSON",
      error: "El cuerpo JSON está malformado."
    });
    return;
  }

  const code = prismaCode(error);
  if (code === "P2002") {
    res.status(409).json({
      success: false,
      code: "CONFLICT",
      error: "Ya existe un registro con uno de los valores únicos enviados."
    });
    return;
  }
  if (code === "P2003") {
    res.status(404).json({
      success: false,
      code: "NOT_FOUND",
      error: "Una de las referencias indicadas no existe."
    });
    return;
  }
  if (code === "P2004") {
    res.status(400).json({
      success: false,
      code: "VALIDATION_ERROR",
      error: "Los datos incumplen una restricción de integridad de PostgreSQL."
    });
    return;
  }

  console.error(error);
  res.status(500).json({
    success: false,
    code: "INTERNAL_SERVER_ERROR",
    error: "Error interno del servidor en ControlLabs",
    timestamp: new Date().toISOString()
  });
};