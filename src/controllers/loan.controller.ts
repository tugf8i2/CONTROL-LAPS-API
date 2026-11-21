import type { Request, Response } from 'express';
import { loanService } from '../container';
import { getRouteParam } from '../utils/route-param';

export class LoanController {
  static createLoan = (req: Request, res: Response): void => {
    res.status(201).json({ success: true, data: loanService.create(req.body) });
  };

  static getLoansByFilter = (req: Request, res: Response): void => {
    const roomId = typeof req.query.roomId === 'string' ? req.query.roomId : undefined;
    res.status(200).json({ success: true, data: loanService.list({ roomId }) });
  };

  static getLoanById = (req: Request, res: Response): void => {
    const id = getRouteParam(req.params.id, 'id');
    res.status(200).json({ success: true, data: loanService.getById(id) });
  };

  static acceptLoanInventory = (req: Request, res: Response): void => {
    const id = getRouteParam(req.params.id, 'id');
    res.status(200).json({ success: true, data: loanService.accept(id) });
  };

  static returnLoanInventory = (req: Request, res: Response): void => {
    const id = getRouteParam(req.params.id, 'id');
    res.status(200).json({ success: true, data: loanService.returnAllEquipment(id) });
  };

  static returnEquipment = (req: Request, res: Response): void => {
    const id = getRouteParam(req.params.id, 'id');
    const equipmentId = getRouteParam(req.params.equipmentId, 'equipmentId');
    res.status(200).json({
      success: true,
      data: loanService.returnEquipment(id, equipmentId)
    });
  };
}