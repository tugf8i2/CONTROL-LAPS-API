import type { ICreateIncidentDTO, IncidentPriority, IncidentStatus } from "../dtos/incident.dto.js";

export interface Incident {
  id: string;
  equipmentId: string;
  reportedBy: string;
  descripcion: string;
  prioridad: IncidentPriority;
  estado: IncidentStatus;
  createdAt: string;
}

export interface IncidentFilters {
  equipmentId?: string;
  prioridad?: IncidentPriority;
  estado?: IncidentStatus;
}

export interface IncidentRepository {
  create(input: ICreateIncidentDTO): Promise<Incident>;
  findAll(filters?: IncidentFilters): Promise<Incident[]>;
  findById(id: string): Promise<Incident | null>;
  updateStatus(id: string, expectedStatus: IncidentStatus, status: IncidentStatus): Promise<Incident | null>;
}