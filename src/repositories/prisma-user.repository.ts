import { prisma } from "../db/prisma.js";
import type { ICreateUserDTO, IUpdateUserDTO } from "../dtos/user.dto.js";
import type { User, UserFilters, UserRepository } from "./user.repository.js";

type UserRow = {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
  createdAt: Date;
};

export class PrismaUserRepository implements UserRepository {
  async create(input: ICreateUserDTO): Promise<User> {
    const row = await prisma.user.create({ data: input });
    return this.toDomain(row);
  }

  async findAll(filters: UserFilters = {}): Promise<User[]> {
    const rows = await prisma.user.findMany({
      where: {
        ...(filters.rol ? { rol: filters.rol } : {}),
        ...(filters.activo === undefined ? {} : { activo: filters.activo })
      },
      orderBy: { nombre: "asc" }
    });
    return rows.map((row) => this.toDomain(row));
  }

  async findById(id: string): Promise<User | null> {
    const row = await prisma.user.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await prisma.user.findUnique({ where: { email } });
    return row ? this.toDomain(row) : null;
  }

  async update(id: string, changes: IUpdateUserDTO): Promise<User | null> {
    const exists = await prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return null;
    const row = await prisma.user.update({ where: { id }, data: changes });
    return this.toDomain(row);
  }

  async setActive(id: string, activo: boolean): Promise<User | null> {
    const exists = await prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return null;
    const row = await prisma.user.update({ where: { id }, data: { activo } });
    return this.toDomain(row);
  }

  private toDomain(row: UserRow): User {
    return {
      id: row.id,
      nombre: row.nombre,
      email: row.email,
      rol: row.rol as User["rol"],
      activo: row.activo,
      createdAt: row.createdAt.toISOString()
    };
  }
}