import { Request, Response, NextFunction } from 'express';
import { ICreateAmbienteDTO } from '../dtos/ambiente.dto';

const isCreateAmbienteDTO = (value: unknown): value is ICreateAmbienteDTO => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const ambiente = value as Record<string, unknown>;
  return (
    typeof ambiente.aula === 'string' && ambiente.aula.trim() !== '' &&
    typeof ambiente.numeroPC === 'string' && /^\d+$/.test(ambiente.numeroPC) &&
    Number(ambiente.numeroPC) > 0 &&
    typeof ambiente.nombreGuardaEntrega === 'string' && ambiente.nombreGuardaEntrega.trim() !== '' &&
    typeof ambiente.instructorRecibe === 'string' && ambiente.instructorRecibe.trim() !== ''
  );
};

export const validateAmbientePayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;

  if (!isCreateAmbienteDTO(body)) {
    res.status(400).json({
      success: false,
      error: 'Datos del ambiente inválidos. Revisa aula, numeroPC, nombreGuardaEntrega e instructorRecibe.'
    });
    return;
  }

  next();
};