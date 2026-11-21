import {Request,Response,NextFunction} from 'express';
export const validateLoanPayload=(req:Request,res:Response,next:NextFunction):void=>{
 const b=req.body as Record<string,unknown>;
 if(!b||typeof b.roomId!=="string"||typeof b.instructorId!=="string"||typeof b.guardaId!=="string"||typeof b.numeroPc!=="number"||!Number.isInteger(b.numeroPc)||b.numeroPc<1){
  res.status(400).json({success:false,error:"Se requiere roomId, instructorId, guardaId y numeroPc entero positivo."});return;
 }
 next();
};