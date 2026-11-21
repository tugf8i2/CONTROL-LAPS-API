import { Router } from 'express';
import { LoanController } from '../controllers/loan.controller';
import { validateLoanPayload } from '../middlewares/validateLoan.middleware';

const router = Router();

router.get('/search', LoanController.getLoansByFilter);
router.post('/', validateLoanPayload, LoanController.createLoan);
router.put('/:id/accept', LoanController.acceptLoanInventory);
router.put('/:id/equipment/:equipmentId/return', LoanController.returnEquipment);
router.put('/:id/return', LoanController.returnLoanInventory);
router.get('/:id', LoanController.getLoanById);

export default router;