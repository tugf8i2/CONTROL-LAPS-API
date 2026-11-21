import type { ICreateEquipoDTO, IUpdateEquipoDTO, EquipmentStatus, EquipmentType } from "../dtos/equipo.dto.js";

export interface EquipmentRoom {
  id: string;
  nombre: string;
  bloque: string;
  capacidadPcs: number;
  estado: string;
}

export interface Equipment {
  id: string;
  placaSena: string;
  codigoActivo: string;
  tipo: EquipmentType;
  roomId: string;
  estado: EquipmentStatus;
  room: EquipmentRoom;
}

export interface EquipmentFilters {
  roomId?: string;
  estado?: EquipmentStatus;
  tipo?: EquipmentType;
}

export interface EquipmentRepository {
  create(input: ICreateEquipoDTO): Promise<Equipment>;
  findAll(filters?: EquipmentFilters): Promise<Equipment[]>;
  findById(id: string): Promise<Equipment | null>;
  findByPlaca(placaSena: string): Promise<Equipment | null>;
  findByAssetCode(codigoActivo: string): Promise<Equipment | null>;
  countComputersInRoom(roomId: string): Promise<number>;
  update(id: string, changes: IUpdateEquipoDTO): Promise<Equipment | null>;
}