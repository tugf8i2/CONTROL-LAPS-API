import type { Request, Response } from 'express';
import { userService } from '../container';

export class UserController {
  static getAll = (req: Request, res: Response): void => {
    const rol = typeof req.query.rol === 'string' ? req.query.rol : undefined;
    const activo = typeof req.query.activo === 'string' ? req.query.activo : undefined;
    res.status(200).json({ success: true, data: userService.list({ rol, activo }) });
  };

  static create = (req: Request, res: Response): void => {
    res.status(201).json({ success: true, data: userService.create(req.body) });
  };

  static getUserById = (req: Request, res: Response): void => {
    res.status(200).json({ success: true, data: userService.getById(req.params.id) });
  };

  static update = (req: Request, res: Response): void => {
    res.status(200).json({ success: true, data: userService.update(req.params.id, req.body) });
  };

  static setActive = (req: Request, res: Response): void => {
    res.status(200).json({ success: true, data: userService.setActive(req.params.id, req.body.activo) });
  };

  static remove = (req: Request, res: Response): void => {
    res.status(200).json({ success: true, data: userService.setActive(req.params.id, false) });
  };
}