import type { RequestHandler } from 'express';

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export const validateBody = (
  predicate: (value: unknown) => boolean,
  message: string
): RequestHandler => (req, res, next): void => {
  if (!predicate(req.body)) {
    res.status(400).json({ success: false, code: 'VALIDATION_ERROR', error: message });
    return;
  }
  next();
};