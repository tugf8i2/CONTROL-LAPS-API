import { prisma } from "../db/prisma";

export const usersDb = {
  list: () => prisma.user.findMany({ orderBy: { nombre: "asc" } }),
  get: (id: string) => prisma.user.findUniqueOrThrow({ where: { id } }),
  create: (data: { nombre: string; email: string; rol: "ADMIN" | "GUARDA" | "INSTRUCTOR" }) =>
    prisma.user.create({ data }),
  update: (id: string, data: Partial<{ nombre: string; email: string; rol: "ADMIN" | "GUARDA" | "INSTRUCTOR"; activo: boolean }>) =>
    prisma.user.update({ where: { id }, data }),
  deactivate: (id: string) => prisma.user.update({ where: { id }, data: { activo: false } })
};