export type EquipmentType =
  | "COMPUTADOR"
  | "MOUSE"
  | "TECLADO"
  | "CARGADOR"
  | "TELEVISOR"
  | "CONTROL_TV";

export type EquipmentStatus = "OPERATIVO" | "MANTENIMIENTO" | "FUERA_DE_SERVICIO";

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