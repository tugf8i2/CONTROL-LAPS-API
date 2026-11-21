import type { Request, Response } from 'express';
import { dashboardService } from '../container';

export class DashboardController {
  static getSummary = (_req: Request, res: Response): void => {
    res.status(200).json({ success: true, data: dashboardService.summary() });
  };

  static getRoomSummary = (req: Request, res: Response): void => {
    res.status(200).json({ success: true, data: dashboardService.roomSummary(req.params.id) });
  };

  static getIncidents = (_req: Request, res: Response): void => {
    res.status(200).json({ success: true, data: dashboardService.incidentSummary() });
  };
}