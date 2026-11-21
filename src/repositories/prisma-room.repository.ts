import { prisma } from "../db/prisma.js";
import type { ICreateAmbienteDTO, IUpdateAmbienteDTO } from "../dtos/ambiente.dto.js";
import type { Room, RoomFilters, RoomRepository } from "./room.repository.js";

type RoomRow = {
  id: string;
  nombre: string;
  bloque: string;
  capacidadPcs: number;
  estado: string;
};

export class PrismaRoomRepository implements RoomRepository {
  async create(input: ICreateAmbienteDTO): Promise<Room> {
    const row = await prisma.room.create({ data: input });
    return this.toDomain(row);
  }

  async findAll(filters: RoomFilters = {}): Promise<Room[]> {
    const rows = await prisma.room.findMany({
      where: {
        ...(filters.estado ? { estado: filters.estado } : {}),
        ...(filters.bloque ? { bloque: { contains: filters.bloque, mode: "insensitive" } } : {})
      },
      orderBy: { nombre: "asc" }
    });
    return rows.map((row) => this.toDomain(row));
  }

  async findById(id: string): Promise<Room | null> {
    const row = await prisma.room.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByName(nombre: string): Promise<Room | null> {
    const row = await prisma.room.findUnique({ where: { nombre } });
    return row ? this.toDomain(row) : null;
  }

  async update(id: string, changes: IUpdateAmbienteDTO): Promise<Room | null> {
    const exists = await prisma.room.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return null;
    const row = await prisma.room.update({ where: { id }, data: changes });
    return this.toDomain(row);
  }

  private toDomain(row: RoomRow): Room {
    return {
      id: row.id,
      nombre: row.nombre,
      bloque: row.bloque,
      capacidadPcs: row.capacidadPcs,
      estado: row.estado as Room["estado"]
    };
  }
}