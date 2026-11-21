import type { PrismaClient } from "../generated/prisma/client.js";
import type {
  DashboardRepository,
  DashboardSummary,
  IncidentDashboardSummary,
  RoomDashboardSummary
} from "./dashboard.repository.js";

export class PrismaDashboardRepository implements DashboardRepository {
  constructor(private readonly database: PrismaClient) {}

  async getSummary(): Promise<DashboardSummary> {
    const [
      usersTotal, usersActive,
      roomsTotal, roomsOperational, roomsMaintenance, roomsInactive,
      equipmentTotal, equipmentOperational, equipmentMaintenance, equipmentOut,
      loansTotal, loansPending, loansAccepted,
      incidentsTotal, incidentsPending, incidentsProgress, incidentsResolved
    ] = await Promise.all([
      this.database.user.count(),
      this.database.user.count({ where: { activo: true } }),
      this.database.room.count(),
      this.database.room.count({ where: { estado: "OPERATIVO" } }),
      this.database.room.count({ where: { estado: "MANTENIMIENTO" } }),
      this.database.room.count({ where: { estado: "INACTIVO" } }),
      this.database.equipment.count(),
      this.database.equipment.count({ where: { estado: "OPERATIVO" } }),
      this.database.equipment.count({ where: { estado: "MANTENIMIENTO" } }),
      this.database.equipment.count({ where: { estado: "FUERA_DE_SERVICIO" } }),
      this.database.loan.count(),
      this.database.loan.count({ where: { estado: "PENDIENTE_APROBACION" } }),
      this.database.loan.count({ where: { estado: "APROBADO_Y_FIRMADO" } }),
      this.database.incident.count(),
      this.database.incident.count({ where: { estado: "PENDIENTE" } }),
      this.database.incident.count({ where: { estado: "EN_PROCESO" } }),
      this.database.incident.count({ where: { estado: "RESUELTA" } })
    ]);

    return {
      users: { total: usersTotal, active: usersActive, inactive: usersTotal - usersActive },
      rooms: {
        total: roomsTotal,
        operational: roomsOperational,
        maintenance: roomsMaintenance,
        inactive: roomsInactive
      },
      equipment: {
        total: equipmentTotal,
        operational: equipmentOperational,
        maintenance: equipmentMaintenance,
        outOfService: equipmentOut
      },
      loans: {
        total: loansTotal,
        pendingApproval: loansPending,
        approvedAndSigned: loansAccepted
      },
      incidents: {
        total: incidentsTotal,
        pending: incidentsPending,
        inProgress: incidentsProgress,
        resolved: incidentsResolved
      }
    };
  }

  async getRoomSummary(roomId: string): Promise<RoomDashboardSummary | null> {
    const room = await this.database.room.findUnique({ where: { id: roomId } });
    if (!room) return null;

    const [
      equipmentTotal, computers, equipmentOperational,
      loansTotal, loansPending, loansAccepted,
      incidentsTotal, incidentsPending, incidentsProgress, incidentsResolved
    ] = await Promise.all([
      this.database.equipment.count({ where: { roomId } }),
      this.database.equipment.count({ where: { roomId, tipo: "COMPUTADOR" } }),
      this.database.equipment.count({ where: { roomId, estado: "OPERATIVO" } }),
      this.database.loan.count({ where: { roomId } }),
      this.database.loan.count({ where: { roomId, estado: "PENDIENTE_APROBACION" } }),
      this.database.loan.count({ where: { roomId, estado: "APROBADO_Y_FIRMADO" } }),
      this.database.incident.count({ where: { equipment: { roomId } } }),
      this.database.incident.count({ where: { equipment: { roomId }, estado: "PENDIENTE" } }),
      this.database.incident.count({ where: { equipment: { roomId }, estado: "EN_PROCESO" } }),
      this.database.incident.count({ where: { equipment: { roomId }, estado: "RESUELTA" } })
    ]);

    return {
      room: {
        id: room.id,
        nombre: room.nombre,
        bloque: room.bloque,
        capacidadPcs: room.capacidadPcs,
        estado: room.estado
      },
      equipment: { total: equipmentTotal, computers, operational: equipmentOperational },
      loans: { total: loansTotal, pendingApproval: loansPending, approvedAndSigned: loansAccepted },
      incidents: {
        total: incidentsTotal,
        pending: incidentsPending,
        inProgress: incidentsProgress,
        resolved: incidentsResolved
      }
    };
  }

  async getIncidentSummary(): Promise<IncidentDashboardSummary> {
    const [
      total,
      pending, inProgress, resolved,
      low, medium, high
    ] = await Promise.all([
      this.database.incident.count(),
      this.database.incident.count({ where: { estado: "PENDIENTE" } }),
      this.database.incident.count({ where: { estado: "EN_PROCESO" } }),
      this.database.incident.count({ where: { estado: "RESUELTA" } }),
      this.database.incident.count({ where: { prioridad: "BAJA" } }),
      this.database.incident.count({ where: { prioridad: "MEDIA" } }),
      this.database.incident.count({ where: { prioridad: "ALTA" } })
    ]);

    return {
      total,
      byStatus: { pending, inProgress, resolved },
      byPriority: { low, medium, high }
    };
  }
}