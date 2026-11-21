import { prisma } from "../db/prisma.js";
import type { ICreateEquipoDTO, IUpdateEquipoDTO } from "../dtos/equipo.dto.js";
import type { Equipment, EquipmentFilters, EquipmentRepository } from "./equipment.repository.js";

type EquipmentRow = {
  id: string;
  placaSena: string;
  codigoActivo: string;
  tipo: string;
  roomId: string;
  estado: string;
  room: {
    id: string;
    nombre: string;
    bloque: string;
    capacidadPcs: number;
    estado: string;
  };
};

export class PrismaEquipmentRepository implements EquipmentRepository {
  async create(input: ICreateEquipoDTO): Promise<Equipment> {
    const row = await prisma.equipment.create({
      data: input,
      include: { room: true }
    });
    return this.toDomain(row);
  }

  async findAll(filters: EquipmentFilters = {}): Promise<Equipment[]> {
    const rows = await prisma.equipment.findMany({
      where: {
        ...(filters.roomId ? { roomId: filters.roomId } : {}),
        ...(filters.estado ? { estado: filters.estado } : {}),
        ...(filters.tipo ? { tipo: filters.tipo } : {})
      },
      include: { room: true },
      orderBy: { placaSena: "asc" }
    });
    return rows.map((row) => this.toDomain(row));
  }

  async findById(id: string): Promise<Equipment | null> {
    const row = await prisma.equipment.findUnique({
      where: { id },
      include: { room: true }
    });
    return row ? this.toDomain(row) : null;
  }

  async findByPlaca(placaSena: string): Promise<Equipment | null> {
    const row = await prisma.equipment.findUnique({
      where: { placaSena },
      include: { room: true }
    });
    return row ? this.toDomain(row) : null;
  }

  async findByAssetCode(codigoActivo: string): Promise<Equipment | null> {
    const row = await prisma.equipment.findUnique({
      where: { codigoActivo },
      include: { room: true }
    });
    return row ? this.toDomain(row) : null;
  }

  countComputersInRoom(roomId: string): Promise<number> {
    return prisma.equipment.count({
      where: { roomId, tipo: "COMPUTADOR" }
    });
  }

  async update(id: string, changes: IUpdateEquipoDTO): Promise<Equipment | null> {
    const exists = await prisma.equipment.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return null;
    const row = await prisma.equipment.update({
      where: { id },
      data: changes,
      include: { room: true }
    });
    return this.toDomain(row);
  }

  private toDomain(row: EquipmentRow): Equipment {
    return {
      id: row.id,
      placaSena: row.placaSena,
      codigoActivo: row.codigoActivo,
      tipo: row.tipo as Equipment["tipo"],
      roomId: row.roomId,
      estado: row.estado as Equipment["estado"],
      room: {
        id: row.room.id,
        nombre: row.room.nombre,
        bloque: row.room.bloque,
        capacidadPcs: row.room.capacidadPcs,
        estado: row.room.estado
      }
    };
  }
}