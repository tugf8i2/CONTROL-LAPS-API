import type { Request, Response } from 'express';
import { equipmentService } from '../container';
import { getRouteParam } from '../utils/route-param';

export class EquipoController {
  static getAll = (req: Request, res: Response): void => {
    const roomId = typeof req.query.roomId === 'string' ? req.query.roomId : undefined;
    const estado = typeof req.query.estado === 'string' ? req.query.estado : undefined;
    const tipo = typeof req.query.tipo === 'string' ? req.query.tipo : undefined;
    res.status(200).json({ success: true, data: equipmentService.list({ roomId, estado, tipo }) });
  };

  static getById = (req: Request, res: Response): void => {
    const id = getRouteParam(req.params.id, 'id');
    res.status(200).json({ success: true, data: equipmentService.getById(id) });
  };

  static create = (req: Request, res: Response): void => {
    res.status(201).json({ success: true, data: equipmentService.create(req.body) });
  };

  static update = (req: Request, res: Response): void => {
    const id = getRouteParam(req.params.id, 'id');
    res.status(200).json({ success: true, data: equipmentService.update(id, req.body) });
  };

  static move = (req: Request, res: Response): void => {
    const id = getRouteParam(req.params.id, 'id');
    res.status(200).json({ success: true, data: equipmentService.move(id, req.body.roomId) });
  };
}