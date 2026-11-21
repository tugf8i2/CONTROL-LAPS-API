import { isRecord, validateBody } from './validation.middleware';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isValidLoan = (value: unknown): boolean => {
  if (!isRecord(value)) return false;
  const equipmentIdsValid = value.equipmentIds === undefined ||
    (Array.isArray(value.equipmentIds) && value.equipmentIds.every((id) =>
      typeof id === 'string' && UUID_PATTERN.test(id)
    ));
  return typeof value.roomId === 'string' && UUID_PATTERN.test(value.roomId) &&
    typeof value.instructorId === 'string' && UUID_PATTERN.test(value.instructorId) &&
    typeof value.guardaId === 'string' && UUID_PATTERN.test(value.guardaId) &&
    typeof value.numeroPc === 'number' && Number.isInteger(value.numeroPc) &&
    value.numeroPc > 0 && equipmentIdsValid;
};

export const validateLoanPayload = validateBody(
  isValidLoan,
  'Datos del préstamo inválidos. Se requieren UUID válidos y numeroPc entero positivo.'
);