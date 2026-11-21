import express, { Request, Response } from 'express';
import cors from 'cors';
import apiRoutes from './routes';
import { requestLogger } from './middlewares/logger.middleware';
import { globalErrorHandler } from './middlewares/errorHandler.middleware';

const app = express();

app.use(requestLogger);
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use('/api/v1', apiRoutes);

app.get('/api/v1/health', (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'success',
    message: 'ControlLabs API operando correctamente',
    timestamp: new Date().toISOString()
  });
});

app.use((req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    code: 'ROUTE_NOT_FOUND',
    error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

app.use(globalErrorHandler);

export default app;