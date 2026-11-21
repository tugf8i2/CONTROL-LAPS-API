import type { IncidentPriority, IncidentStatus } from '../models/entities';

export interface ICreateIncidentDTO {
  equipmentId: string;
  reportedBy: string;
  descripcion: string;
  prioridad: IncidentPriority;
}

export interface IUpdateIncidentStatusDTO {
  estado: IncidentStatus;
  resolvedBy?: string;
}