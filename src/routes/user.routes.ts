import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

import { validateUserPayload } from '../middlewares/validateUser.middleware';

const router = Router();

router.get('/consulta', UserController.getAll);
router.post('/registro', validateUserPayload, UserController.create);
router.get('/detalle/:id', UserController.getUserById);
router.patch('/actualiza/:id', UserController.update);
router.delete('/elimina/:id', UserController.remove);





export default router;

