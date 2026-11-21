import { Router } from 'express';
import { EquipoController } from '../controllers/equipo.controller';
import { validateEquipoPayload } from '../middlewares/validateEquipo.middleware';

const router = Router();

router.get('/consulta', EquipoController.getAll);
router.post('/registro', validateEquipoPayload, EquipoController.create);
router.get('/detalle/:id', EquipoController.getById);
router.patch('/actualiza/:id', EquipoController.update);
router.patch('/traslada/:id', EquipoController.move);

export default router;