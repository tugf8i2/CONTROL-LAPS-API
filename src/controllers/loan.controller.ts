import type {Request,Response,NextFunction} from 'express';
import {loansDb} from '../services/loan.prisma.service';
const idParam=(v:string|string[]):string=>{if(typeof v!=="string"||!v.trim())throw new Error("Parámetro inválido");return v;};
export class LoanController {
 static createLoan=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{try{res.status(201).json({success:true,data:await loansDb.create(req.body)});}catch(e){next(e);}};
 static getLoansByFilter=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{try{res.status(200).json({success:true,data:await loansDb.list(typeof req.query.roomId==="string"?req.query.roomId:undefined)});}catch(e){next(e);}};
 static getLoanById=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{try{res.status(200).json({success:true,data:await loansDb.get(idParam(req.params.id))});}catch(e){next(e);}};
 static acceptLoanInventory=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{try{res.status(200).json({success:true,data:await loansDb.accept(idParam(req.params.id))});}catch(e){next(e);}};
}