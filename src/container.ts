import { prisma } from "./db/prisma.js";
import { PrismaUserRepository } from "./repositories/prisma-user.repository.js";
import { PrismaRoomRepository } from "./repositories/prisma-room.repository.js";
import { PrismaEquipmentRepository } from "./repositories/prisma-equipment.repository.js";
import { PrismaLoanRepository } from "./repositories/prisma-loan.repository.js";
import { UserService } from "./services/user.service.js";
import { RoomService } from "./services/room.service.js";
import { EquipmentService } from "./services/equipment.service.js";
import { LoanService } from "./services/loan.service.js";

const userRepository = new PrismaUserRepository(prisma);
const roomRepository = new PrismaRoomRepository(prisma);
const equipmentRepository = new PrismaEquipmentRepository(prisma);
const loanRepository = new PrismaLoanRepository(prisma);

export const userService = new UserService(userRepository);
export const roomService = new RoomService(roomRepository);
export const equipmentService = new EquipmentService(equipmentRepository, roomRepository);
export const loanService = new LoanService(loanRepository);