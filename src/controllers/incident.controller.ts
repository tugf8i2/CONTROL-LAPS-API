import type { Request, Response } from 'express';
import { incidentService } from '../container';

export class IncidentController {
  static getAll = (req: Request, res: Response): void => {
    const equipmentId = typeof req.query.equipmentId === 'string' ? req.query.equipmentId : undefined;
    const prioridad = typeof req.query.prioridad === 'string' ? req.query.prioridad : undefined;
    const estado = typeof req.query.estado === 'string' ? req.query.estado : undefined;
    res.status(200).json({
      success: true,
      data: incidentService.list({ equipmentId, prioridad, estado })
    });
  };

  static getById = (req: Request, res: Response): void => {
    res.status(200).json({ success: true, data: incidentService.getById(req.params.id) });
  };

  static create = (req: Request, res: Response): void => {
    res.status(201).json({ success: true, data: incidentService.create(req.body) });
  };

  static updateStatus = (req: Request, res: Response): void => {
    res.status(200).json({
      success: true,
      data: incidentService.updateStatus(req.params.id, req.body)
    });
  };
}