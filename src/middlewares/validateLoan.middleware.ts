import type { Request, Response, NextFunction } from "express";
import type { ICreateLoanDTO } from "../dtos/loan.dto.js";

const isUuid = (value: unknown): value is string =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

const isCreateLoanDTO = (value: unknown): value is ICreateLoanDTO => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const loan = value as Record<string, unknown>;
  const allowedFields = new Set(["roomId", "instructorId", "guardaId", "numeroPc"]);

  return (
    Object.keys(loan).length === allowedFields.size &&
    Object.keys(loan).every((key) => allowedFields.has(key)) &&
    isUuid(loan.roomId) &&
    isUuid(loan.instructorId) &&
    isUuid(loan.guardaId) &&
    typeof loan.numeroPc === "number" &&
    Number.isInteger(loan.numeroPc)
  );
};

export const validateLoanPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;

  if (!isCreateLoanDTO(body)) {
    res.status(400).json({
      success: false,
      code: "VALIDATION_ERROR",
      error: "Datos del préstamo inválidos."
    });
    return;
  }

  next();
};

export const validateLoanIdParameter = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const rawId: unknown = req.params.id;
  if (
    typeof rawId !== "string" ||
    !/^[1-9]\d*$/.test(rawId) ||
    rawId.length > 19 ||
    BigInt(rawId) > 9223372036854775807n
  ) {
    res.status(400).json({
      success: false,
      code: "VALIDATION_ERROR",
      error: "El identificador del préstamo debe ser un entero BIGINT positivo."
    });
    return;
  }
  next();
};

export const validateLoanSearchQuery = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const roomId: unknown = req.query.roomId;
  if (roomId !== undefined && !isUuid(roomId)) {
    res.status(400).json({
      success: false,
      code: "VALIDATION_ERROR",
      error: "El filtro roomId debe ser un UUID válido."
    });
    return;
  }
  next();
};