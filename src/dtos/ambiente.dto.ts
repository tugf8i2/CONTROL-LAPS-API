import type { RoomStatus } from '../models/entities';

export interface ICreateAmbienteDTO {
  nombre: string;
  bloque: string;
  capacidadPcs: number;
  estado?: RoomStatus;
}

export interface IUpdateAmbienteDTO {
  nombre?: string;
  bloque?: string;
  capacidadPcs?: number;
  estado?: RoomStatus;
}