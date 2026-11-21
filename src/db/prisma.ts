import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { createDatabaseUrl } from "./database-url.js";

const adapter = new PrismaPg({
  connectionString: createDatabaseUrl()
});

export const prisma = new PrismaClient({ adapter });