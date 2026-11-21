import { prisma } from "./db/prisma.js";
import { PrismaUserRepository } from "./repositories/prisma-user.repository.js";
import { PrismaRoomRepository } from "./repositories/prisma-room.repository.js";
import { PrismaEquipmentRepository } from "./repositories/prisma-equipment.repository.js";
import { PrismaLoanRepository } from "./repositories/prisma-loan.repository.js";
import { PrismaIncidentRepository } from "./repositories/prisma-incident.repository.js";
import { PrismaDashboardRepository } from "./repositories/prisma-dashboard.repository.js";
import { UserService } from "./services/user.service.js";
import { RoomService } from "./services/room.service.js";
import { EquipmentService } from "./services/equipment.service.js";
import { LoanService } from "./services/loan.service.js";
import { IncidentService } from "./services/incident.service.js";
import { DashboardService } from "./services/dashboard.service.js";

const userRepository = new PrismaUserRepository(prisma);
const roomRepository = new PrismaRoomRepository(prisma);
const equipmentRepository = new PrismaEquipmentRepository(prisma);
const loanRepository = new PrismaLoanRepository(prisma);
const incidentRepository = new PrismaIncidentRepository(prisma);
const dashboardRepository = new PrismaDashboardRepository(prisma);

export const userService = new UserService(userRepository);
export const roomService = new RoomService(roomRepository);
export const equipmentService = new EquipmentService(equipmentRepository, roomRepository);
export const loanService = new LoanService(loanRepository);
export const incidentService = new IncidentService(incidentRepository);
export const dashboardService = new DashboardService(dashboardRepository);