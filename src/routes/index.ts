import { Router } from 'express';
import ambienteRoutes from './ambiente.routes';
import loanRoutes from './loan.routes';
import userRoutes from './user.routes';
import equipoRoutes from './equipo.routes';

const router = Router();
router.use('/ambientes', ambienteRoutes);
router.use('/loans', loanRoutes);
router.use('/users', userRoutes);
router.use('/equipos', equipoRoutes);

export default router;