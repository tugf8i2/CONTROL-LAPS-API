export interface DashboardSummary {
  users: {
    total: number;
    active: number;
    inactive: number;
  };
  rooms: {
    total: number;
    operational: number;
    maintenance: number;
    inactive: number;
  };
  equipment: {
    total: number;
    operational: number;
    maintenance: number;
    outOfService: number;
  };
  loans: {
    total: number;
    pendingApproval: number;
    approvedAndSigned: number;
  };
  incidents: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
  };
}

export interface RoomDashboardSummary {
  room: {
    id: string;
    nombre: string;
    bloque: string;
    capacidadPcs: number;
    estado: string;
  };
  equipment: {
    total: number;
    computers: number;
    operational: number;
  };
  loans: {
    total: number;
    pendingApproval: number;
    approvedAndSigned: number;
  };
  incidents: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
  };
}

export interface IncidentDashboardSummary {
  total: number;
  byStatus: {
    pending: number;
    inProgress: number;
    resolved: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface DashboardRepository {
  getSummary(): Promise<DashboardSummary>;
  getRoomSummary(roomId: string): Promise<RoomDashboardSummary | null>;
  getIncidentSummary(): Promise<IncidentDashboardSummary>;
}