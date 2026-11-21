import type { Request, Response, NextFunction } from "express";
import { roomService } from "../container.js";
import { getRouteParam } from "../utils/route-param.js";

export class AmbienteController {
  static getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const estado = typeof req.query.estado === "string" ? req.query.estado : undefined;
      const bloque = typeof req.query.bloque === "string" ? req.query.bloque : undefined;
      res.status(200).json({ success: true, data: await roomService.list({ estado, bloque }) });
    } catch (error) {
      next(error);
    }
  };

  static getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRouteParam(req.params.id, "id");
      res.status(200).json({ success: true, data: await roomService.getById(id) });
    } catch (error) {
      next(error);
    }
  };

  static create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(201).json({ success: true, data: await roomService.create(req.body) });
    } catch (error) {
      next(error);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRouteParam(req.params.id, "id");
      res.status(200).json({ success: true, data: await roomService.update(id, req.body) });
    } catch (error) {
      next(error);
    }
  };

  static setStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRouteParam(req.params.id, "id");
      res.status(200).json({ success: true, data: await roomService.setStatus(id, req.body.estado) });
    } catch (error) {
      next(error);
    }
  };
}