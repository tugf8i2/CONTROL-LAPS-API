import { prisma } from "./db/prisma.js";
import { PrismaUserRepository } from "./repositories/prisma-user.repository.js";
import { PrismaRoomRepository } from "./repositories/prisma-room.repository.js";
import { PrismaEquipmentRepository } from "./repositories/prisma-equipment.repository.js";
import { UserService } from "./services/user.service.js";
import { RoomService } from "./services/room.service.js";
import { EquipmentService } from "./services/equipment.service.js";

const userRepository = new PrismaUserRepository();
const roomRepository = new PrismaRoomRepository();
const equipmentRepository = new PrismaEquipmentRepository();

export const userService = new UserService(userRepository);
export const roomService = new RoomService(roomRepository);
export const equipmentService = new EquipmentService(equipmentRepository, roomRepository);

void prisma;