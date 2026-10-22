import { Request, Response, NextFunction } from 'express';
import { ICreateEquipoDTO } from '../dtos/equipo.dto';

const isCreateEquipoDTO = (value: unknown): value is ICreateEquipoDTO => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const equipo = value as Record<string, unknown>;
  return (
    typeof equipo.aula === 'string' && equipo.aula.trim() !== '' &&
    typeof equipo.numeroPC === 'number' && equipo.numeroPC > 0 &&
    typeof equipo.nombreGuardaEntrega === 'string' && equipo.nombreGuardaEntrega.trim() !== '' &&
    typeof equipo.instructorRecibe === 'string' && equipo.instructorRecibe.trim() !== ''
  );
};

export const validateEquipoPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  if (!isCreateEquipoDTO(body)) {
    res.status(400).json({
      success: false,
      error: 'Datos de equipo inválidos. Todos los campos son obligatorios.'
    });
    return;
  }
  next();
};
