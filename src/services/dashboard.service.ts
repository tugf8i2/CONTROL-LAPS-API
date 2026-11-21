import { DomainError } from "../errors/domain.error.js";
import type {
  DashboardRepository,
  DashboardSummary,
  IncidentDashboardSummary,
  RoomDashboardSummary
} from "../repositories/dashboard.repository.js";

export class DashboardService {
  constructor(private readonly repository: DashboardRepository) {}

  getSummary(): Promise<DashboardSummary> {
    return this.repository.getSummary();
  }

  async getRoomSummary(roomId: string): Promise<RoomDashboardSummary> {
    const summary = await this.repository.getRoomSummary(roomId);
    if (!summary) throw new DomainError("NOT_FOUND", "No existe el ambiente solicitado.");
    return summary;
  }

  getIncidentSummary(): Promise<IncidentDashboardSummary> {
    return this.repository.getIncidentSummary();
  }
}