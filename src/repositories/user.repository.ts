import type { ICreateUserDTO, IUpdateUserDTO, UserRole } from "../dtos/user.dto.js";

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  activo: boolean;
  createdAt: string;
}

export interface UserFilters {
  rol?: UserRole;
  activo?: boolean;
}

export interface UserRepository {
  create(input: ICreateUserDTO): Promise<User>;
  findAll(filters?: UserFilters): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, changes: IUpdateUserDTO): Promise<User | null>;
  setActive(id: string, activo: boolean): Promise<User | null>;
}