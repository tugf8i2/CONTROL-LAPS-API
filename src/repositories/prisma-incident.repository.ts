import type { PrismaClient } from "../generated/prisma/client.js";
import type { ICreateIncidentDTO, IncidentStatus } from "../dtos/incident.dto.js";
import type { Incident, IncidentFilters, IncidentRepository } from "./incident.repository.js";

type IncidentRow = {
  id: bigint;
  equipmentId: string;
  reportedBy: string;
  descripcion: string;
  prioridad: string;
  estado: string;
  createdAt: Date;
};

export class PrismaIncidentRepository implements IncidentRepository {
  constructor(private readonly database: PrismaClient) {}

  async create(input: ICreateIncidentDTO): Promise<Incident> {
    const row = await this.database.incident.create({
      data: {
        equipmentId: input.equipmentId,
        reportedBy: input.reportedBy,
        descripcion: input.descripcion,
        prioridad: input.prioridad
      }
    });
    return this.toDomain(row);
  }

  async findAll(filters: IncidentFilters = {}): Promise<Incident[]> {
    const rows = await this.database.incident.findMany({
      where: {
        ...(filters.equipmentId ? { equipmentId: filters.equipmentId } : {}),
        ...(filters.prioridad ? { prioridad: filters.prioridad } : {}),
        ...(filters.estado ? { estado: filters.estado } : {})
      },
      orderBy: { createdAt: "desc" }
    });
    return rows.map((row) => this.toDomain(row));
  }

  async findById(id: string): Promise<Incident | null> {
    const row = await this.database.incident.findUnique({
      where: { id: BigInt(id) }
    });
    return row ? this.toDomain(row) : null;
  }

  async updateStatus(
    id: string,
    expectedStatus: IncidentStatus,
    status: IncidentStatus
  ): Promise<Incident | null> {
    const changed = await this.database.incident.updateMany({
      where: { id: BigInt(id), estado: expectedStatus },
      data: { estado: status }
    });
    if (changed.count === 0) return null;
    return this.findById(id);
  }

  private toDomain(row: IncidentRow): Incident {
    return {
      id: row.id.toString(),
      equipmentId: row.equipmentId,
      reportedBy: row.reportedBy,
      descripcion: row.descripcion,
      prioridad: row.prioridad as Incident["prioridad"],
      estado: row.estado as Incident["estado"],
      createdAt: row.createdAt.toISOString()
    };
  }
}