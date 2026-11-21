import { Request, Response, NextFunction } from 'express';
export const globalErrorHandler=(err:unknown,_req:Request,res:Response,next:NextFunction):void=>{
 if(res.headersSent){next(err);return;}
 if(typeof err==="object"&&err!==null&&"type" in err&&err.type==="entity.parse.failed"){res.status(400).json({success:false,error:"El cuerpo JSON está malformado."});return;}
 if(typeof err==="object"&&err!==null&&"code" in err){
  const code=(err as {code?:string}).code;
  if(code==="P2002"){res.status(409).json({success:false,code:"CONFLICT",error:"El registro ya existe."});return;}
  if(code==="P2025"){res.status(404).json({success:false,code:"NOT_FOUND",error:"El registro solicitado no existe."});return;}
  if(code==="P2003"){res.status(400).json({success:false,code:"INVALID_REFERENCE",error:"La referencia indicada no existe."});return;}
 }
 console.error(err);
 res.status(500).json({success:false,code:"INTERNAL_ERROR",error:"Error interno del servidor en ControlLabs"});
};