import { Router } from 'express';
import { AmbienteController } from '../controllers/ambiente.controller';

const router = Router();

router.get('/consulta', AmbienteController.getAll);
router.post('/registro', AmbienteController.create);
router.patch('/actualiza/:id', AmbienteController.update);


export default router;
