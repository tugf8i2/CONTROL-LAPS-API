import { Router } from 'express';
import { AmbienteController } from '../controllers/ambiente.controller';
import { validateAmbientePayload } from '../middlewares/validateAmbiente.middleware';

const router = Router();

router.get('/consulta', AmbienteController.getAll);
router.post('/registro', validateAmbientePayload, AmbienteController.create);
router.patch('/actualiza/:id', AmbienteController.update);


export default router;
