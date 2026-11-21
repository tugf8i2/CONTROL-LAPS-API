import type { Request, Response } from 'express';
import { roomService } from '../container';
import { getRouteParam } from '../utils/route-param';

export class AmbienteController {
  static getAll = (req: Request, res: Response): void => {
    const estado = typeof req.query.estado === 'string' ? req.query.estado : undefined;
    const bloque = typeof req.query.bloque === 'string' ? req.query.bloque : undefined;
    res.status(200).json({ success: true, data: roomService.list({ estado, bloque }) });
  };

  static getById = (req: Request, res: Response): void => {
    const id = getRouteParam(req.params.id, 'id');
    res.status(200).json({ success: true, data: roomService.getById(id) });
  };

  static create = (req: Request, res: Response): void => {
    res.status(201).json({ success: true, data: roomService.create(req.body) });
  };

  static update = (req: Request, res: Response): void => {
    const id = getRouteParam(req.params.id, 'id');
    res.status(200).json({ success: true, data: roomService.update(id, req.body) });
  };

  static setStatus = (req: Request, res: Response): void => {
    const id = getRouteParam(req.params.id, 'id');
    res.status(200).json({ success: true, data: roomService.setStatus(id, req.body.estado) });
  };
}