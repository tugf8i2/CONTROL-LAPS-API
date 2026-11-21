import { prisma } from "../db/prisma";
export const roomsDb={
 list:()=>prisma.room.findMany({orderBy:{nombre:"asc"}}),
 get:(id:string)=>prisma.room.findUniqueOrThrow({where:{id},include:{loans:true,equipment:true}}),
 create:(data:{nombre:string;bloque:string;capacidadPcs:number;estado?:"OPERATIVO"|"MANTENIMIENTO"|"INACTIVO"})=>prisma.room.create({data}),
 update:(id:string,data:Partial<{nombre:string;bloque:string;capacidadPcs:number;estado:"OPERATIVO"|"MANTENIMIENTO"|"INACTIVO"}>)=>prisma.room.update({where:{id},data})
};