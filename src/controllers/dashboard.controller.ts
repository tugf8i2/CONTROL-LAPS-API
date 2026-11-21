import type { Request, Response } from 'express';
import { dashboardService } from '../container';
import { getRouteParam } from '../utils/route-param';

export class DashboardController {
  static getSummary = (_req: Request, res: Response): void => {
    res.status(200).json({ success: true, data: dashboardService.summary() });
  };

  static getRoomSummary = (req: Request, res: Response): void => {
    const id = getRouteParam(req.params.id, 'id');
    res.status(200).json({ success: true, data: dashboardService.roomSummary(id) });
  };

  static getIncidents = (_req: Request, res: Response): void => {
    res.status(200).json({ success: true, data: dashboardService.incidentSummary() });
  };
}