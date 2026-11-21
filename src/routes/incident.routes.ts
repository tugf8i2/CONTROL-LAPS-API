import { Router } from 'express';
import { IncidentController } from '../controllers/incident.controller';
import { validateIncidentPayload } from '../middlewares/validateIncident.middleware';

const router = Router();

router.get('/', IncidentController.getAll);
router.post('/', validateIncidentPayload, IncidentController.create);
router.get('/:id', IncidentController.getById);
router.patch('/:id/status', IncidentController.updateStatus);

export default router;