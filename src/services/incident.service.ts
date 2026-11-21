import { DomainError } from "../errors/domain.error.js";
import type { ICreateIncidentDTO, IncidentPriority, IncidentStatus } from "../dtos/incident.dto.js";
import type { Incident, IncidentFilters, IncidentRepository } from "../repositories/incident.repository.js";

const PRIORITIES: IncidentPriority[] = ["BAJA", "MEDIA", "ALTA"];
const STATUSES: IncidentStatus[] = ["PENDIENTE", "EN_PROCESO", "RESUELTA"];

export class IncidentService {
  constructor(private readonly repository: IncidentRepository) {}

  async create(input: ICreateIncidentDTO): Promise<Incident> {
    const descripcion = this.requiredText(input.descripcion, "La descripción");
    this.validatePriority(input.prioridad);
    this.validateUuid(input.equipmentId, "equipmentId");
    this.validateUuid(input.reportedBy, "reportedBy");

    return this.repository.create({
      equipmentId: input.equipmentId.toLowerCase(),
      reportedBy: input.reportedBy.toLowerCase(),
      descripcion,
      prioridad: input.prioridad
    });
  }

  async list(filters: { equipmentId?: string; prioridad?: string; estado?: string } = {}): Promise<Incident[]> {
    const query: IncidentFilters = {};
    if (filters.equipmentId !== undefined) {
      this.validateUuid(filters.equipmentId, "equipmentId");
      query.equipmentId = filters.equipmentId.toLowerCase();
    }
    if (filters.prioridad !== undefined) {
      this.validatePriority(filters.prioridad);
      query.prioridad = filters.prioridad as IncidentPriority;
    }
    if (filters.estado !== undefined) {
      this.validateStatus(filters.estado);
      query.estado = filters.estado as IncidentStatus;
    }
    return this.repository.findAll(query);
  }

  async getById(id: string): Promise<Incident> {
    const incident = await this.repository.findById(id);
    if (!incident) throw new DomainError("NOT_FOUND", "No existe la novedad solicitada.");
    return incident;
  }

  async updateStatus(id: string, nextStatus: IncidentStatus): Promise<Incident> {
    this.validateStatus(nextStatus);
    const current = await this.getById(id);
    const allowed: Record<IncidentStatus, IncidentStatus[]> = {
      PENDIENTE: ["EN_PROCESO"],
      EN_PROCESO: ["RESUELTA"],
      RESUELTA: []
    };

    if (!allowed[current.estado].includes(nextStatus)) {
      throw new DomainError("CONFLICT", `No se permite cambiar una novedad de ${current.estado} a ${nextStatus}.`);
    }

    const updated = await this.repository.updateStatus(id, current.estado, nextStatus);
    if (updated) return updated;

    const latest = await this.repository.findById(id);
    if (!latest) throw new DomainError("NOT_FOUND", "No existe la novedad solicitada.");
    throw new DomainError("CONFLICT", "La novedad fue modificada por otra solicitud.");
  }

  private validatePriority(value: string): void {
    if (!PRIORITIES.includes(value as IncidentPriority)) {
      throw new DomainError("VALIDATION_ERROR", "La prioridad debe ser BAJA, MEDIA o ALTA.");
    }
  }

  private validateStatus(value: string): void {
    if (!STATUSES.includes(value as IncidentStatus)) {
      throw new DomainError("VALIDATION_ERROR", "El estado de la novedad no es válido.");
    }
  }

  private validateUuid(value: string, name: string): void {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
      throw new DomainError("VALIDATION_ERROR", `${name} debe ser un UUID válido.`);
    }
  }

  private requiredText(value: string, label: string): string {
    if (typeof value !== "string" || !value.trim()) {
      throw new DomainError("VALIDATION_ERROR", `${label} es obligatoria.`);
    }
    return value.trim();
  }
}