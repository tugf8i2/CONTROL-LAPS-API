import type { Request,Response,NextFunction } from 'express';
import { roomsDb } from '../services/room.prisma.service';
const idParam=(v:string|string[]):string=>{if(typeof v!=="string"||!v.trim())throw new Error("Parámetro inválido");return v;};
export class AmbienteController {
 static getAll=async(_req:Request,res:Response,next:NextFunction):Promise<void>=>{try{res.status(200).json({success:true,data:await roomsDb.list()});}catch(e){next(e);}};
 static getLoansByFilter=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{try{res.status(200).json({success:true,data:await roomsDb.get(idParam(req.params.id))});}catch(e){next(e);}};
 static create=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{try{res.status(201).json({success:true,data:await roomsDb.create(req.body)});}catch(e){next(e);}};
 static update=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{try{res.status(200).json({success:true,data:await roomsDb.update(idParam(req.params.id),req.body)});}catch(e){next(e);}};
}