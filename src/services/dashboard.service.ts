import { DomainError } from '../errors/domain.error';
import type { EquipmentRepository } from '../repositories/equipment.repository';
import type { IncidentRepository } from '../repositories/incident.repository';
import type { LoanRepository } from '../repositories/loan.repository';
import type { RoomRepository } from '../repositories/room.repository';
import type { UserRepository } from '../repositories/user.repository';

export class DashboardService {
  constructor(
    private readonly users: UserRepository,
    private readonly rooms: RoomRepository,
    private readonly equipment: EquipmentRepository,
    private readonly loans: LoanRepository,
    private readonly incidents: IncidentRepository
  ) {}

  summary() {
    const users = this.users.findAll();
    const rooms = this.rooms.findAll();
    const equipment = this.equipment.findAll();
    const loans = this.loans.findAllWithEquipment();
    const incidents = this.incidents.findAll();
    return {
      users: {
        total: users.length,
        active: users.filter((item) => item.activo).length,
        inactive: users.filter((item) => !item.activo).length
      },
      rooms: {
        total: rooms.length,
        operational: rooms.filter((item) => item.estado === 'OPERATIVO').length,
        maintenance: rooms.filter((item) => item.estado === 'MANTENIMIENTO').length,
        inactive: rooms.filter((item) => item.estado === 'INACTIVO').length
      },
      equipment: {
        total: equipment.length,
        operational: equipment.filter((item) => item.estado === 'OPERATIVO').length,
        maintenance: equipment.filter((item) => item.estado === 'MANTENIMIENTO').length,
        outOfService: equipment.filter((item) => item.estado === 'FUERA_DE_SERVICIO').length
      },
      loans: {
        total: loans.length,
        pending: loans.filter((item) => item.estado === 'PENDIENTE_APROBACION').length,
        approved: loans.filter((item) => item.estado === 'APROBADO_Y_FIRMADO').length,
        equipmentOnLoan: this.loans.getActiveEquipmentIds().length
      },
      incidents: {
        total: incidents.length,
        pending: incidents.filter((item) => item.estado === 'PENDIENTE').length,
        inProcess: incidents.filter((item) => item.estado === 'EN_PROCESO').length,
        resolved: incidents.filter((item) => item.estado === 'RESUELTA').length
      },
      generatedAt: new Date().toISOString()
    };
  }

  roomSummary(id: string) {
    const room = this.rooms.findById(id);
    if (!room) throw new DomainError('NOT_FOUND', 'No existe el ambiente solicitado.');
    const items = this.equipment.findAll({ roomId: id });
    const computers = items.filter((item) => item.tipo === 'COMPUTADOR');
    const activeEquipment = new Set(this.loans.getActiveEquipmentIds());
    return {
      room,
      equipment: {
        total: items.length,
        computers: computers.length,
        availableComputers: computers.filter((item) =>
          item.estado === 'OPERATIVO' && !activeEquipment.has(item.id)
        ).length,
        maintenance: items.filter((item) => item.estado === 'MANTENIMIENTO').length,
        outOfService: items.filter((item) => item.estado === 'FUERA_DE_SERVICIO').length
      },
      loans: this.loans.findAllWithEquipment({ roomId: id }),
      incidents: this.incidents.findAll()
        .filter((incident) => incident.estado !== 'RESUELTA')
        .filter((incident) => items.some((item) => item.id === incident.equipmentId))
    };
  }

  incidentSummary() {
    return this.incidents.findAll().map((incident) => ({
      ...incident,
      equipment: this.equipment.findById(incident.equipmentId)
    }));
  }
}