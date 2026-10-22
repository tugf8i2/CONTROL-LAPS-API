import { Router } from 'express';
import { EquipoController } from '../controllers/equipo.controller';
import { validateEquipoPayload } from '../middlewares/validateEquipo.middleware';

const router = Router();

router.get('/consulta', EquipoController.getAll);
router.post('/registro', validateEquipoPayload, EquipoController.create);
router.patch('/actualiza/:id', EquipoController.update);


export default router;

