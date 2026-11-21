import "dotenv/config";
import { defineConfig } from "prisma/config";
import { createDatabaseUrl } from "./src/db/database-url.js";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: createDatabaseUrl()
  }
});