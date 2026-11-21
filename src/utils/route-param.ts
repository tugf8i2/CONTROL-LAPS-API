import { DomainError } from "../errors/domain.error.js";

export const getRouteParam = (value: unknown, name: string): string => {
  if (typeof value !== "string" || !value.trim()) {
    throw new DomainError("VALIDATION_ERROR", `El parámetro ${name} debe ser un texto válido.`);
  }
  return value;
};