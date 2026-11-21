import type { NextFunction, Request, Response } from "express";
import type { ICreateLoanDTO } from "../dtos/loan.dto.js";
import { loanService } from "../container.js";
import { getRouteParam } from "../utils/route-param.js";

export class LoanController {
  static createLoan = async (
    req: Request<Record<string, string>, unknown, ICreateLoanDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const loan = await loanService.createLoan(req.body);
      res.status(201).json({ success: true, data: loan });
    } catch (error) {
      next(error);
    }
  };

  static getLoansByFilter = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const roomId = typeof req.query.roomId === "string" ? req.query.roomId : undefined;
      const loans = await loanService.getLoans({ roomId });
      res.status(200).json({ success: true, data: loans });
    } catch (error) {
      next(error);
    }
  };

  static getLoanById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = getRouteParam(req.params.id, "id");
      const loan = await loanService.getLoanDetail(id);
      res.status(200).json({ success: true, data: loan });
    } catch (error) {
      next(error);
    }
  };

  static acceptLoanInventory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = getRouteParam(req.params.id, "id");
      const loan = await loanService.acceptLoan(id);
      res.status(200).json({ success: true, data: loan });
    } catch (error) {
      next(error);
    }
  };
}