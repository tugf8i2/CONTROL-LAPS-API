import type { Request,Response,NextFunction } from 'express';
import { equipmentDb } from '../services/equipment.prisma.service';
const idParam=(v:string|string[]):string=>{if(typeof v!=="string"||!v.trim())throw new Error("Parámetro inválido");return v;};
export class EquipoController {
 static getAll=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{try{res.status(200).json({success:true,data:await equipmentDb.list({roomId:typeof req.query.roomId==="string"?req.query.roomId:undefined,estado:typeof req.query.estado==="string"?req.query.estado:undefined})});}catch(e){next(e);}};
 static getLoansByFilter=EquipoController.getAll;
 static create=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{try{res.status(201).json({success:true,data:await equipmentDb.create(req.body)});}catch(e){next(e);}};
 static update=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{try{res.status(200).json({success:true,data:await equipmentDb.update(idParam(req.params.id),req.body)});}catch(e){next(e);}};
}