import { isNonEmptyString, isRecord, validateBody } from './validation.middleware';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isValidIncident = (value: unknown): boolean => {
  if (!isRecord(value)) return false;
  return typeof value.equipmentId === 'string' && UUID_PATTERN.test(value.equipmentId) &&
    typeof value.reportedBy === 'string' && UUID_PATTERN.test(value.reportedBy) &&
    isNonEmptyString(value.descripcion) &&
    ['BAJA', 'MEDIA', 'ALTA'].includes(String(value.prioridad));
};

export const validateIncidentPayload = validateBody(
  isValidIncident,
  'Datos de novedad inválidos. Revisa equipmentId, reportedBy, descripcion y prioridad.'
);