import express, { type Request, type Response } from "express";
import cors from "cors";
import apiRoutes from "./routes/index.js";
import { requestLogger } from "./middlewares/logger.middleware.js";
import { globalErrorHandler } from "./middlewares/errorHandler.middleware.js";

const app = express();

app.use(requestLogger);
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/v1/health", (_req: Request, res: Response): void => {
  res.status(200).json({
    status: "success",
    message: "ControlLabs API operando correctamente",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/v1", apiRoutes);

if (process.env.NODE_ENV !== "production") {
  app.get("/__test/error", (_req, _res, next) => {
    next(new Error("Error de prueba"));
  });
}

app.use((_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    code: "ROUTE_NOT_FOUND",
    error: "Ruta no encontrada."
  });
});

app.use(globalErrorHandler);

export default app;