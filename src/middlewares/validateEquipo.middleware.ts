import { isNonEmptyString, isRecord, validateBody } from './validation.middleware';

const isValidEquipment = (value: unknown): boolean => {
  if (!isRecord(value)) return false;
  return isNonEmptyString(value.placaSena) &&
    isNonEmptyString(value.codigoActivo) &&
    isNonEmptyString(value.roomId) &&
    ['COMPUTADOR', 'MOUSE', 'TECLADO', 'CARGADOR', 'TELEVISOR', 'CONTROL_TV'].includes(String(value.tipo)) &&
    (value.estado === undefined || ['OPERATIVO', 'MANTENIMIENTO', 'FUERA_DE_SERVICIO'].includes(String(value.estado)));
};

export const validateEquipoPayload = validateBody(
  isValidEquipment,
  'Datos de equipo inválidos. Revisa placaSena, codigoActivo, tipo y roomId.'
);