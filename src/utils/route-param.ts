import { DomainError } from '../errors/domain.error';

export const getRouteParam = (value: unknown, name: string): string => {
  let parameter: unknown = value;

  if (Array.isArray(parameter)) {
    parameter = parameter.length === 1 ? parameter[0] : undefined;
  }

  if (typeof parameter !== 'string' || parameter.trim().length === 0) {
    throw new DomainError('VALIDATION_ERROR', `El parámetro ${name} debe ser un texto válido.`);
  }

  return parameter;
}