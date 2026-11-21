import { isNonEmptyString, isRecord, validateBody } from './validation.middleware';

const isValidRoom = (value: unknown): boolean => {
  if (!isRecord(value)) return false;
  return isNonEmptyString(value.nombre) &&
    isNonEmptyString(value.bloque) &&
    typeof value.capacidadPcs === 'number' &&
    Number.isInteger(value.capacidadPcs) &&
    value.capacidadPcs >= 0 &&
    (value.estado === undefined || ['OPERATIVO', 'MANTENIMIENTO', 'INACTIVO'].includes(String(value.estado)));
};

export const validateAmbientePayload = validateBody(
  isValidRoom,
  'Datos del ambiente inválidos. Revisa nombre, bloque, capacidadPcs y estado.'
);