import { DomainError } from '../errors/domain.error';
import type { ICreateIncidentDTO, IUpdateIncidentStatusDTO } from '../dtos/incident.dto';
import type { Incident, IncidentPriority, IncidentStatus, User } from '../models/entities';
import type { EquipmentRepository } from '../repositories/equipment.repository';
import type { IncidentRepository } from '../repositories/incident.repository';
import type { UserRepository } from '../repositories/user.repository';

const PRIORITIES: IncidentPriority[] = ['BAJA', 'MEDIA', 'ALTA'];
const STATUSES: IncidentStatus[] = ['PENDIENTE', 'EN_PROCESO', 'RESUELTA'];
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class IncidentService {
  constructor(
    private readonly repository: IncidentRepository,
    private readonly equipmentRepository: EquipmentRepository,
    private readonly userRepository: UserRepository
  ) {}

  create(input: ICreateIncidentDTO): Incident {
    this.validateUuid(input.equipmentId, 'equipmentId');
    this.validateUuid(input.reportedBy, 'reportedBy');
    const equipment = this.equipmentRepository.findById(input.equipmentId.toLowerCase());
    if (!equipment) throw new DomainError('NOT_FOUND', 'El equipo indicado no existe.');
    if (!PRIORITIES.includes(input.prioridad)) {
      throw new DomainError('VALIDATION_ERROR', 'La prioridad debe ser BAJA, MEDIA o ALTA.');
    }
    const reporter = this.activeUser(input.reportedBy);
    const descripcion = input.descripcion.trim();
    if (!descripcion) throw new DomainError('VALIDATION_ERROR', 'La descripción es obligatoria.');
    return this.repository.create({
      equipmentId: equipment.id,
      reportedBy: reporter.id,
      descripcion,
      prioridad: input.prioridad,
      estado: 'PENDIENTE',
      createdAt: new Date().toISOString(),
      resolvedAt: null,
      resolvedBy: null
    });
  }

  list(filters: { equipmentId?: string; prioridad?: string; estado?: string } = {}): Incident[] {
    const query: { equipmentId?: string; prioridad?: IncidentPriority; estado?: IncidentStatus } = {};
    if (filters.equipmentId !== undefined) {
      this.validateUuid(filters.equipmentId, 'equipmentId');
      query.equipmentId = filters.equipmentId.toLowerCase();
    }
    if (filters.prioridad !== undefined) {
      if (!PRIORITIES.includes(filters.prioridad as IncidentPriority)) {
        throw new DomainError('VALIDATION_ERROR', 'El filtro prioridad no es válido.');
      }
      query.prioridad = filters.prioridad as IncidentPriority;
    }
    if (filters.estado !== undefined) {
      if (!STATUSES.includes(filters.estado as IncidentStatus)) {
        throw new DomainError('VALIDATION_ERROR', 'El filtro estado no es válido.');
      }
      query.estado = filters.estado as IncidentStatus;
    }
    return this.repository.findAll(query);
  }

  getById(id: string): Incident {
    const incidentId = Number(id);
    if (!Number.isInteger(incidentId) || incidentId <= 0) {
      throw new DomainError('VALIDATION_ERROR', 'El identificador de la novedad debe ser positivo.');
    }
    const incident = this.repository.findById(incidentId);
    if (!incident) throw new DomainError('NOT_FOUND', 'No existe la novedad solicitada.');
    return incident;
  }

  updateStatus(id: string, input: IUpdateIncidentStatusDTO): Incident {
    const current = this.getById(id);
    if (!STATUSES.includes(input.estado)) {
      throw new DomainError('VALIDATION_ERROR', 'El estado de la novedad no es válido.');
    }
    const allowed =
      (current.estado === 'PENDIENTE' && input.estado === 'EN_PROCESO') ||
      (current.estado === 'EN_PROCESO' && input.estado === 'RESUELTA');
    if (!allowed) {
      throw new DomainError('CONFLICT', 'La transición de estado solicitada no está permitida.');
    }

    const changes: Partial<Omit<Incident, 'id'>> = { estado: input.estado };
    if (input.estado === 'RESUELTA') {
      if (!input.resolvedBy || !UUID_PATTERN.test(input.resolvedBy)) {
        throw new DomainError('VALIDATION_ERROR', 'resolvedBy debe identificar al usuario que resuelve la novedad.');
      }
      const resolver = this.activeUser(input.resolvedBy);
      changes.resolvedBy = resolver.id;
      changes.resolvedAt = new Date().toISOString();
    }
    return this.repository.update(current.id, changes) as Incident;
  }

  private activeUser(id: string): User {
    const user = this.userRepository.findById(id.toLowerCase());
    if (!user) throw new DomainError('NOT_FOUND', 'El usuario indicado no existe.');
    if (!user.activo) throw new DomainError('CONFLICT', 'El usuario indicado está inactivo.');
    return user;
  }

  private validateUuid(value: string, field: string): void {
    if (typeof value !== 'string' || !UUID_PATTERN.test(value)) {
      throw new DomainError('VALIDATION_ERROR', `${field} debe ser un UUID válido.`);
    }
  }
}