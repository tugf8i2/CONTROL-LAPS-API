import type { Request, Response } from 'express';
import { equipmentService } from '../container';

export class EquipoController {
  static getAll = (req: Request, res: Response): void => {
    const roomId = typeof req.query.roomId === 'string' ? req.query.roomId : undefined;
    const estado = typeof req.query.estado === 'string' ? req.query.estado : undefined;
    const tipo = typeof req.query.tipo === 'string' ? req.query.tipo : undefined;
    res.status(200).json({ success: true, data: equipmentService.list({ roomId, estado, tipo }) });
  };

  static getById = (req: Request, res: Response): void => {
    res.status(200).json({ success: true, data: equipmentService.getById(req.params.id) });
  };

  static create = (req: Request, res: Response): void => {
    res.status(201).json({ success: true, data: equipmentService.create(req.body) });
  };

  static update = (req: Request, res: Response): void => {
    res.status(200).json({ success: true, data: equipmentService.update(req.params.id, req.body) });
  };

  static move = (req: Request, res: Response): void => {
    res.status(200).json({ success: true, data: equipmentService.move(req.params.id, req.body.roomId) });
  };
}