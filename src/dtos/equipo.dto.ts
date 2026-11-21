import type { EquipmentStatus, EquipmentType } from '../models/entities';

export interface ICreateEquipoDTO {
  placaSena: string;
  codigoActivo: string;
  tipo: EquipmentType;
  roomId: string;
  estado?: EquipmentStatus;
}

export interface IUpdateEquipoDTO {
  placaSena?: string;
  codigoActivo?: string;
  tipo?: EquipmentType;
  roomId?: string;
  estado?: EquipmentStatus;
}