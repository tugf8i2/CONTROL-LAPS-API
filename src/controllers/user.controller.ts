import type { Request, Response } from 'express';
import { userService } from '../container';
import { getRouteParam } from '../utils/route-param';

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
    const id = getRouteParam(req.params.id, 'id');
    res.status(200).json({ success: true, data: userService.getById(id) });
  };

  static update = (req: Request, res: Response): void => {
    const id = getRouteParam(req.params.id, 'id');
    res.status(200).json({ success: true, data: userService.update(id, req.body) });
  };

  static setActive = (req: Request, res: Response): void => {
    const id = getRouteParam(req.params.id, 'id');
    res.status(200).json({ success: true, data: userService.setActive(id, req.body.activo) });
  };

  static remove = (req: Request, res: Response): void => {
    const id = getRouteParam(req.params.id, 'id');
    res.status(200).json({ success: true, data: userService.setActive(id, false) });
  };
}