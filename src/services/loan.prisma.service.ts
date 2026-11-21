import { prisma } from "../db/prisma";
export const loansDb={
 list:(roomId?:string)=>prisma.loan.findMany({where:roomId?{roomId}:undefined,include:{room:true,instructor:true,guarda:true},orderBy:{createdAt:"desc"}}),
 get:(id:string)=>prisma.loan.findUniqueOrThrow({where:{id},include:{room:true,instructor:true,guarda:true}}),
 create:async(data:{roomId:string;instructorId:string;guardaId:string;numeroPc:number})=>{
  if(!Number.isInteger(data.numeroPc)||data.numeroPc<1)throw new Error("numeroPc debe ser un entero positivo");
  const [room,instructor,guarda,available]=await Promise.all([
   prisma.room.findUnique({where:{id:data.roomId}}),
   prisma.user.findUnique({where:{id:data.instructorId}}),
   prisma.user.findUnique({where:{id:data.guardaId}}),
   prisma.equipment.count({where:{roomId:data.roomId,estado:"OPERATIVO"}})
  ]);
  if(!room||room.estado!=="OPERATIVO")throw new Error("Ambiente inexistente o no operativo");
  if(!instructor||!instructor.activo||instructor.rol!=="INSTRUCTOR")throw new Error("Instructor inválido o inactivo");
  if(!guarda||!guarda.activo||guarda.rol!=="GUARDA")throw new Error("Guarda inválido o inactivo");
  if(data.numeroPc>available)throw new Error("Cantidad de computadores operativos insuficiente");
  return prisma.loan.create({data,include:{room:true,instructor:true,guarda:true}});
 },
 accept:async(id:string)=>prisma.loan.update({where:{id},data:{estado:"APROBADO_Y_FIRMADO",acceptedAt:new Date()},include:{room:true,instructor:true,guarda:true}})
};