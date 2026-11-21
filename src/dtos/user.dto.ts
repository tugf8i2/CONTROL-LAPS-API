import type { UserRole } from '../models/entities';

export interface ICreateUserDTO {
  email: string;
  nombre: string;
  rol: UserRole;
}

export interface IUpdateUserDTO {
  email?: string;
  nombre?: string;
  rol?: UserRole;
}