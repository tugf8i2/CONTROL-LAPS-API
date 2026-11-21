export type EntityId = string | number;

export interface Entity {
  id: EntityId;
}

export type UserRole = 'ADMIN' | 'GUARDA' | 'INSTRUCTOR';
export type RoomStatus = 'OPERATIVO' | 'MANTENIMIENTO' | 'INACTIVO';
export type EquipmentType = 'COMPUTADOR' | 'MOUSE' | 'TECLADO' | 'CARGADOR' | 'TELEVISOR' | 'CONTROL_TV';
export type EquipmentStatus = 'OPERATIVO' | 'MANTENIMIENTO' | 'FUERA_DE_SERVICIO';
export type LoanStatus = 'PENDIENTE_APROBACION' | 'APROBADO_Y_FIRMADO';
export type IncidentPriority = 'BAJA' | 'MEDIA' | 'ALTA';
export type IncidentStatus = 'PENDIENTE' | 'EN_PROCESO' | 'RESUELTA';

export interface User extends Entity {
  id: string;
  email: string;
  nombre: string;
  rol: UserRole;
  activo: boolean;
  createdAt: string;
}

export interface Room extends Entity {
  id: string;
  nombre: string;
  bloque: string;
  capacidadPcs: number;
  estado: RoomStatus;
}

export interface Equipment extends Entity {
  id: string;
  placaSena: string;
  codigoActivo: string;
  tipo: EquipmentType;
  roomId: string;
  estado: EquipmentStatus;
}

export interface Loan extends Entity {
  id: number;
  roomId: string;
  instructorId: string;
  guardaId: string;
  numeroPc: number;
  estado: LoanStatus;
  createdAt: string;
  acceptedAt: string | null;
}

export interface LoanEquipment {
  loanId: number;
  equipmentId: string;
  assignedAt: string;
  returnedAt: string | null;
}

export interface LoanWithEquipment extends Loan {
  equipment: LoanEquipment[];
}

export interface Incident extends Entity {
  id: number;
  equipmentId: string;
  reportedBy: string;
  descripcion: string;
  prioridad: IncidentPriority;
  estado: IncidentStatus;
  createdAt: string;
  resolvedAt: string | null;
  resolvedBy: string | null;
}