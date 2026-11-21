import { DomainError } from "../errors/domain.error.js";
import type { ICreateUserDTO, IUpdateUserDTO, UserRole } from "../dtos/user.dto.js";
import type { User, UserRepository } from "../repositories/user.repository.js";

const ROLES: UserRole[] = ["ADMIN", "GUARDA", "INSTRUCTOR"];

export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async create(input: ICreateUserDTO): Promise<User> {
    const nombre = this.requiredText(input.nombre, "El nombre");
    const email = this.normalizeEmail(input.email);
    this.validateRole(input.rol);

    if (await this.repository.findByEmail(email)) {
      throw new DomainError("CONFLICT", "Ya existe un usuario con ese correo.");
    }

    return this.repository.create({ nombre, email, rol: input.rol });
  }

  async list(filters: { rol?: string; activo?: string } = {}): Promise<User[]> {
    const query: { rol?: UserRole; activo?: boolean } = {};

    if (filters.rol !== undefined) {
      this.validateRole(filters.rol);
      query.rol = filters.rol as UserRole;
    }

    if (filters.activo !== undefined) {
      if (filters.activo !== "true" && filters.activo !== "false") {
        throw new DomainError("VALIDATION_ERROR", "El filtro activo debe ser true o false.");
      }
      query.activo = filters.activo === "true";
    }

    return this.repository.findAll(query);
  }

  async getById(id: string): Promise<User> {
    const user = await this.repository.findById(id);
    if (!user) throw new DomainError("NOT_FOUND", "No existe el usuario solicitado.");
    return user;
  }

  async update(id: string, input: IUpdateUserDTO): Promise<User> {
    await this.getById(id);
    const changes: IUpdateUserDTO = {};

    if (input.nombre !== undefined) {
      changes.nombre = this.requiredText(input.nombre, "El nombre");
    }
    if (input.email !== undefined) {
      changes.email = this.normalizeEmail(input.email);
      const existing = await this.repository.findByEmail(changes.email);
      if (existing && existing.id !== id) {
        throw new DomainError("CONFLICT", "Ya existe un usuario con ese correo.");
      }
    }
    if (input.rol !== undefined) {
      this.validateRole(input.rol);
      changes.rol = input.rol;
    }
    if (Object.keys(changes).length === 0) {
      throw new DomainError("VALIDATION_ERROR", "No se recibieron campos editables.");
    }

    const updated = await this.repository.update(id, changes);
    if (!updated) throw new DomainError("NOT_FOUND", "No existe el usuario solicitado.");
    return updated;
  }

  async setActive(id: string, activo: boolean): Promise<User> {
    if (typeof activo !== "boolean") {
      throw new DomainError("VALIDATION_ERROR", "activo debe ser booleano.");
    }
    const updated = await this.repository.setActive(id, activo);
    if (!updated) throw new DomainError("NOT_FOUND", "No existe el usuario solicitado.");
    return updated;
  }

  private normalizeEmail(value: string): string {
    if (typeof value !== "string") {
      throw new DomainError("VALIDATION_ERROR", "El correo es obligatorio.");
    }
    const email = value.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new DomainError("VALIDATION_ERROR", "El correo no tiene un formato válido.");
    }
    return email;
  }

  private requiredText(value: string, label: string): string {
    if (typeof value !== "string" || !value.trim()) {
      throw new DomainError("VALIDATION_ERROR", `${label} es obligatorio.`);
    }
    return value.trim();
  }

  private validateRole(value: string): void {
    if (!ROLES.includes(value as UserRole)) {
      throw new DomainError("VALIDATION_ERROR", "El rol debe ser ADMIN, GUARDA o INSTRUCTOR.");
    }
  }
}