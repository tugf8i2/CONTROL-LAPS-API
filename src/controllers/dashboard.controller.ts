import type { Request, Response, NextFunction } from "express";
import { dashboardService } from "../container.js";
import { getRouteParam } from "../utils/route-param.js";

export class DashboardController {
  static getSummary = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({ success: true, data: await dashboardService.getSummary() });
    } catch (error) {
      next(error);
    }
  };

  static getRoomSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRouteParam(req.params.id, "id");
      res.status(200).json({ success: true, data: await dashboardService.getRoomSummary(id) });
    } catch (error) {
      next(error);
    }
  };

  static getIncidents = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({ success: true, data: await dashboardService.getIncidentSummary() });
    } catch (error) {
      next(error);
    }
  };
}