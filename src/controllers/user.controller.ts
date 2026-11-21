import type { Request, Response, NextFunction } from "express";
import { userService } from "../container.js";
import { getRouteParam } from "../utils/route-param.js";

export class UserController {
  static getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rol = typeof req.query.rol === "string" ? req.query.rol : undefined;
      const activo = typeof req.query.activo === "string" ? req.query.activo : undefined;
      res.status(200).json({ success: true, data: await userService.list({ rol, activo }) });
    } catch (error) {
      next(error);
    }
  };

  static create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(201).json({ success: true, data: await userService.create(req.body) });
    } catch (error) {
      next(error);
    }
  };

  static getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRouteParam(req.params.id, "id");
      res.status(200).json({ success: true, data: await userService.getById(id) });
    } catch (error) {
      next(error);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRouteParam(req.params.id, "id");
      res.status(200).json({ success: true, data: await userService.update(id, req.body) });
    } catch (error) {
      next(error);
    }
  };

  static setActive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRouteParam(req.params.id, "id");
      res.status(200).json({ success: true, data: await userService.setActive(id, req.body.activo) });
    } catch (error) {
      next(error);
    }
  };

  static remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRouteParam(req.params.id, "id");
      res.status(200).json({ success: true, data: await userService.setActive(id, false) });
    } catch (error) {
      next(error);
    }
  };
}