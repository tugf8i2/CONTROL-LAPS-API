import type { Request, Response } from 'express';

export class AmbienteController {
  public static getAll = (_req: Request, res: Response): void => {
    res.status(501).json({
      success: false,
      message: 'La consulta de ambientes todavía no está implementada.'
    });
  };

  public static getLoansByFilter = (req: Request, res: Response): void => {
    const { id } = req.params;
    res.status(501).json({
      success: false,
      message: `La consulta del ambiente ${id} todavía no está implementada.`
    });
  };

  public static create = (req: Request, res: Response): void => {
    res.status(501).json({
      success: false,
      message: 'El registro de ambientes todavía no está implementado.'
    });
  };

  public static update = (req: Request, res: Response): void => {
    const { id } = req.params;
    res.status(501).json({
      success: false,
      message: `La actualización del ambiente ${id} todavía no está implementada.`
    });
  };
}