import { InMemoryRepository } from './repositories/in-memory.repository';
import { InMemoryLoanRepository } from './repositories/in-memory-loan.repository';
import type { User, Room, Equipment, Incident } from './models/entities';
import { UserService } from './services/user.service';
import { RoomService } from './services/room.service';
import { EquipmentService } from './services/equipment.service';
import { LoanService } from './services/loan.service';
import { IncidentService } from './services/incident.service';
import { DashboardService } from './services/dashboard.service';

const userRepository = new InMemoryRepository<User>();
const roomRepository = new InMemoryRepository<Room>();
const equipmentRepository = new InMemoryRepository<Equipment>();
const loanRepository = new InMemoryLoanRepository();
const incidentRepository = new InMemoryRepository<Incident>(true);

export const userService = new UserService(userRepository);
export const roomService = new RoomService(roomRepository, equipmentRepository);
export const equipmentService = new EquipmentService(equipmentRepository, roomRepository);
export const loanService = new LoanService(
  loanRepository,
  roomRepository,
  userRepository,
  equipmentRepository
);
export const incidentService = new IncidentService(
  incidentRepository,
  equipmentRepository,
  userRepository
);
export const dashboardService = new DashboardService(
  userRepository,
  roomRepository,
  equipmentRepository,
  loanRepository,
  incidentRepository
);