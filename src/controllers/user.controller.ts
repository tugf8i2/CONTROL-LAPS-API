import { Request, Response, NextFunction } from 'express';
import { usersDb } from '../services/user.prisma.service';

const param = (value: string | string[]): string => {
  if (typeof value !== 'string' || !value.trim()) throw new Error('Parámetro inválido');
  return value;
};

export class UserController {
  static getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { res.status(200).json({ success: true, data: await usersDb.list() }); } catch (e) { next(e); }
  };
  static create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { res.status(201).json({ success: true, data: await usersDb.create(req.body) }); } catch (e) { next(e); }
  };
  static getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { res.status(200).json({ success: true, data: await usersDb.get(param(req.params.id)) }); } catch (e) { next(e); }
  };
  static update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { res.status(200).json({ success: true, data: await usersDb.update(param(req.params.id), req.body) }); } catch (e) { next(e); }
  };
  static remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { res.status(200).json({ success: true, data: await usersDb.deactivate(param(req.params.id)) }); } catch (e) { next(e); }
  };
}