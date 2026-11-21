import { isNonEmptyString, isRecord, validateBody } from './validation.middleware';

const isValidUser = (value: unknown): boolean => {
  if (!isRecord(value)) return false;
  return isNonEmptyString(value.nombre) &&
    typeof value.email === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim()) &&
    ['ADMIN', 'GUARDA', 'INSTRUCTOR'].includes(String(value.rol));
};

export const validateUserPayload = validateBody(
  isValidUser,
  'Datos de usuario inválidos. Se requieren nombre, email válido y rol permitido.'
);