import { DomainError } from '../errors/domain.error';
import type { ICreateUserDTO, IUpdateUserDTO } from '../dtos/user.dto';
import type { User, UserRole } from '../models/entities';
import type { UserRepository } from '../repositories/user.repository';

const ROLES: UserRole[] = ['ADMIN', 'GUARDA', 'INSTRUCTOR'];

export class UserService {
  constructor(private readonly repository: UserRepository) {}

  create(input: ICreateUserDTO): User {
    const email = this.normalizeEmail(input.email);
    const nombre = this.requiredText(input.nombre, 'El nombre');
    if (!ROLES.includes(input.rol)) {
      throw new DomainError('VALIDATION_ERROR', 'El rol debe ser ADMIN, GUARDA o INSTRUCTOR.');
    }
    if (this.repository.findAll().some((user) => user.email === email)) {
      throw new DomainError('CONFLICT', 'Ya existe un usuario con ese correo.');
    }
    return this.repository.create({
      email,
      nombre,
      rol: input.rol,
      activo: true,
      createdAt: new Date().toISOString()
    });
  }

  list(filters: { rol?: string; activo?: string } = {}): User[] {
    const query: { rol?: UserRole; activo?: boolean } = {};
    if (filters.rol !== undefined) {
      if (!ROLES.includes(filters.rol as UserRole)) {
        throw new DomainError('VALIDATION_ERROR', 'El filtro rol no es válido.');
      }
      query.rol = filters.rol as UserRole;
    }
    if (filters.activo !== undefined) {
      if (filters.activo !== 'true' && filters.activo !== 'false') {
        throw new DomainError('VALIDATION_ERROR', 'El filtro activo debe ser true o false.');
      }
      query.activo = filters.activo === 'true';
    }
    return this.repository.findAll(query);
  }

  getById(id: string): User {
    const user = this.repository.findById(id);
    if (!user) throw new DomainError('NOT_FOUND', 'No existe el usuario solicitado.');
    return user;
  }

  update(id: string, input: IUpdateUserDTO): User {
    const current = this.getById(id);
    const changes: IUpdateUserDTO = {};
    if (input.nombre !== undefined) changes.nombre = this.requiredText(input.nombre, 'El nombre');
    if (input.email !== undefined) {
      changes.email = this.normalizeEmail(input.email);
      if (this.repository.findAll().some((user) => user.id !== current.id && user.email === changes.email)) {
        throw new DomainError('CONFLICT', 'Ya existe un usuario con ese correo.');
      }
    }
    if (input.rol !== undefined) {
      if (!ROLES.includes(input.rol)) {
        throw new DomainError('VALIDATION_ERROR', 'El rol debe ser ADMIN, GUARDA o INSTRUCTOR.');
      }
      changes.rol = input.rol;
    }
    if (Object.keys(changes).length === 0) {
      throw new DomainError('VALIDATION_ERROR', 'No se recibieron campos editables.');
    }
    return this.repository.update(id, changes) as User;
  }

  setActive(id: string, activo: boolean): User {
    this.getById(id);
    if (typeof activo !== 'boolean') {
      throw new DomainError('VALIDATION_ERROR', 'activo debe ser booleano.');
    }
    return this.repository.update(id, { activo }) as User;
  }

  private normalizeEmail(value: string): string {
    if (typeof value !== 'string') {
      throw new DomainError('VALIDATION_ERROR', 'El correo es obligatorio.');
    }
    const email = value.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new DomainError('VALIDATION_ERROR', 'El correo no tiene un formato válido.');
    }
    return email;
  }

  private requiredText(value: string, label: string): string {
    if (typeof value !== 'string' || !value.trim()) {
      throw new DomainError('VALIDATION_ERROR', `${label} es obligatorio.`);
    }
    return value.trim();
  }
}