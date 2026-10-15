import type { Request, Response } from 'express';

export class EquipoController {
  public static getAll = (_req: Request, res: Response): void => {
    res.status(501).json({
      success: false,
      message: 'La consulta de equipos todavía no está implementada.'
    });
  };

  public static getLoansByFilter = (req: Request, res: Response): void => {
    res.status(501).json({
      success: false,
      message: 'La consulta de equipos por filtro todavía no está implementada.'
    });
  };

  public static create = (req: Request, res: Response): void => {
    res.status(501).json({
      success: false,
      message: 'El registro de equipos todavía no está implementado.'
    });
  }

  public static update = (req: Request, res: Response): void => {
    const { id } = req.params;
    res.status(501).json({
      success: false,
      message: `La actualización del equipo ${id} todavía no está implementada.`
    });
  };
}