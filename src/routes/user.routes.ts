import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();

router.get('/consulta', UserController.getAll);
router.post('/registro', UserController.create);
router.get('/detalle', UserController.getUserById);
router.patch('/actualiza/:id', UserController.update);
router.delete('/elimina/:id', UserController.remove);

export default router;

