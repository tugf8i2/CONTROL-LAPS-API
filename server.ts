import "dotenv/config";
import type { Server } from "node:http";
import app from "./src/app.js";
import { prisma } from "./src/db/prisma.js";

const PORT = Number(process.env.PORT ?? 5000);

const startServer = async (): Promise<void> => {
  await prisma.$connect();

  const server: Server = app.listen(PORT, () => {
    console.log(`ControlLabs API disponible en http://localhost:${PORT}`);
  });

  const shutdown = (signal: NodeJS.Signals): void => {
    console.log(`Señal ${signal} recibida. Cerrando ControlLabs API.`);
    server.close((error) => {
      void prisma.$disconnect().finally(() => {
        if (error) {
          console.error("Error cerrando el servidor HTTP:", error);
          process.exitCode = 1;
        }
      });
    });
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
};

startServer().catch(async (error: unknown) => {
  console.error("No fue posible iniciar ControlLabs API o conectar PostgreSQL:", error);
  await prisma.$disconnect();
  process.exitCode = 1;
});