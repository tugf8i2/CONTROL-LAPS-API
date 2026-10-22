import express, { Request, Response } from 'express';
import apiRoutes from './routes';
import cors from 'cors';
import { requestLogger } from './middlewares/logger.middleware';
import { globalErrorHandler } from './middlewares/errorHandler.middleware';

const app = express();

app.use(requestLogger);
app.use(cors());
app.use(express.json());
app.use('/api/v1', apiRoutes);

// Health Check Endpoint
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'ControlLabs API operando correctamente',
    timestamp: new Date().toISOString()
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

app.use(globalErrorHandler);

export default app;