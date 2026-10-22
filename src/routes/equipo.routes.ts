import { Router } from 'express';
import { EquipoController } from '../controllers/equipo.controller';

const router = Router();

router.get('/consulta', EquipoController.getAll);
router.post('/registro', EquipoController.create);
router.patch('/actualiza/:id', EquipoController.update);


export default router;

