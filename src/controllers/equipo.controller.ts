import type { Request, Response, NextFunction } from "express";
import { equipmentService } from "../container.js";
import { getRouteParam } from "../utils/route-param.js";

export class EquipoController {
  static getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roomId = typeof req.query.roomId === "string" ? req.query.roomId : undefined;
      const estado = typeof req.query.estado === "string" ? req.query.estado : undefined;
      const tipo = typeof req.query.tipo === "string" ? req.query.tipo : undefined;
      res.status(200).json({ success: true, data: await equipmentService.list({ roomId, estado, tipo }) });
    } catch (error) {
      next(error);
    }
  };

  static getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRouteParam(req.params.id, "id");
      res.status(200).json({ success: true, data: await equipmentService.getById(id) });
    } catch (error) {
      next(error);
    }
  };

  static create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(201).json({ success: true, data: await equipmentService.create(req.body) });
    } catch (error) {
      next(error);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRouteParam(req.params.id, "id");
      res.status(200).json({ success: true, data: await equipmentService.update(id, req.body) });
    } catch (error) {
      next(error);
    }
  };

  static move = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRouteParam(req.params.id, "id");
      res.status(200).json({ success: true, data: await equipmentService.update(id, { roomId: req.body.roomId }) });
    } catch (error) {
      next(error);
    }
  };
}