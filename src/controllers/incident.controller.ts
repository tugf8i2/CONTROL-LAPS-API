import type { Request, Response, NextFunction } from "express";
import { incidentService } from "../container.js";
import { getRouteParam } from "../utils/route-param.js";

export class IncidentController {
  static getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const equipmentId = typeof req.query.equipmentId === "string" ? req.query.equipmentId : undefined;
      const prioridad = typeof req.query.prioridad === "string" ? req.query.prioridad : undefined;
      const estado = typeof req.query.estado === "string" ? req.query.estado : undefined;
      res.status(200).json({ success: true, data: await incidentService.list({ equipmentId, prioridad, estado }) });
    } catch (error) {
      next(error);
    }
  };

  static getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRouteParam(req.params.id, "id");
      res.status(200).json({ success: true, data: await incidentService.getById(id) });
    } catch (error) {
      next(error);
    }
  };

  static create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(201).json({ success: true, data: await incidentService.create(req.body) });
    } catch (error) {
      next(error);
    }
  };

  static updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRouteParam(req.params.id, "id");
      res.status(200).json({ success: true, data: await incidentService.updateStatus(id, req.body.estado) });
    } catch (error) {
      next(error);
    }
  };
}