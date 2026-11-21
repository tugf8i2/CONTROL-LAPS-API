import type { ICreateAmbienteDTO, IUpdateAmbienteDTO, RoomStatus } from "../dtos/ambiente.dto.js";

export interface Room {
  id: string;
  nombre: string;
  bloque: string;
  capacidadPcs: number;
  estado: RoomStatus;
}

export interface RoomFilters {
  estado?: RoomStatus;
  bloque?: string;
}

export interface RoomRepository {
  create(input: ICreateAmbienteDTO): Promise<Room>;
  findAll(filters?: RoomFilters): Promise<Room[]>;
  findById(id: string): Promise<Room | null>;
  findByName(nombre: string): Promise<Room | null>;
  update(id: string, changes: IUpdateAmbienteDTO): Promise<Room | null>;
}