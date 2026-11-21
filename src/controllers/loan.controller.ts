import type { Request, Response } from 'express';
import { loanService } from '../container';

export class LoanController {
  static createLoan = (req: Request, res: Response): void => {
    res.status(201).json({ success: true, data: loanService.create(req.body) });
  };

  static getLoansByFilter = (req: Request, res: Response): void => {
    const roomId = typeof req.query.roomId === 'string' ? req.query.roomId : undefined;
    res.status(200).json({ success: true, data: loanService.list({ roomId }) });
  };

  static getLoanById = (req: Request, res: Response): void => {
    res.status(200).json({ success: true, data: loanService.getById(req.params.id) });
  };

  static acceptLoanInventory = (req: Request, res: Response): void => {
    res.status(200).json({ success: true, data: loanService.accept(req.params.id) });
  };

  static returnLoanInventory = (req: Request, res: Response): void => {
    res.status(200).json({ success: true, data: loanService.returnAllEquipment(req.params.id) });
  };

  static returnEquipment = (req: Request, res: Response): void => {
    res.status(200).json({
      success: true,
      data: loanService.returnEquipment(req.params.id, req.params.equipmentId)
    });
  };
}