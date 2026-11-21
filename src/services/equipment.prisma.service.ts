import { prisma } from "../db/prisma";
export const equipmentDb={
 list:(filters:{roomId?:string;estado?:string}={})=>prisma.equipment.findMany({where:{...(filters.roomId?{roomId:filters.roomId}:{}),...(filters.estado?{estado:filters.estado as never}:{})},include:{room:true},orderBy:{placaSena:"asc"}}),
 create:(data:{placaSena:string;codigoActivo:string;tipo:any;roomId:string;estado?:any})=>prisma.equipment.create({data,include:{room:true}}),
 update:(id:string,data:Partial<{placaSena:string;codigoActivo:string;tipo:any;estado:any;roomId:string}>)=>prisma.equipment.update({where:{id},data,include:{room:true}})
};