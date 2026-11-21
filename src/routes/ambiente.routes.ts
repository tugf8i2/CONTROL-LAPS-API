import { Router } from 'express';
import { AmbienteController } from '../controllers/ambiente.controller';
import { validateAmbientePayload } from '../middlewares/validateAmbiente.middleware';

const router = Router();

router.get('/consulta', AmbienteController.getAll);
router.post('/registro', validateAmbientePayload, AmbienteController.create);
router.get('/detalle/:id', AmbienteController.getById);
router.patch('/actualiza/:id', AmbienteController.update);
router.patch('/estado/:id', AmbienteController.setStatus);

export default router;