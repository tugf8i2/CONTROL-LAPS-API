import { Request, Response } from 'express';

export class UserController {
  public static getAll = (req: Request, res: Response): void => {
    // TODO: llamar al servicio y responder con todos los usuarios.
    res.status(501).json({
      success: false,
      message: 'El registro de usuarios todavía no está implementado.'
    });
  };

  public static create = (req: Request, res: Response): void => {
    // TODO: llamar al servicio con req.body y responder 201 con el usuario creado.
    res.status(501).json({
      success: false,
      message: 'La creación de usuarios todavía no está implementada.'
    });
  };

  public static getUserById = (req: Request, res: Response): void => {
    const { id } = req.params;
    // TODO: pasar id a la operación de consulta y responder con el usuario encontrado.
    res.status(501).json({
      success: false,
      message: `La consulta del usuario ${id} todavía no está implementada.`
    });
  };

  public static update = (req: Request, res: Response): void => {
    const { id } = req.params;
    // TODO: llamar al servicio con id y req.body para actualizar parcialmente el usuario.
    res.status(501).json({
      success: false,
      message: `La actualización del usuario ${id} todavía no está implementada.`
    });
  };

  public static remove = (req: Request, res: Response): void => {
    const { id } = req.params;
    // TODO: marcar el usuario como inactivo en el servicio, sin borrar el registro.
    res.status(501).json({
      success: false,
      message: `La eliminación lógica del usuario ${id} todavía no está implementada.`
    });
  };
}