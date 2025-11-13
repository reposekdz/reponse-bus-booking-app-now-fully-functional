import { Router } from 'express';
import { protect, authorize } from '../../middleware/auth.middleware';
import { lookupPassenger, makeDeposit, getMyTransactions } from './agent.controller';

const router = Router();

router.use(protect, authorize('agent'));

router.get('/lookup/:serialCode', lookupPassenger);
router.post('/deposit', makeDeposit);
router.get('/my-transactions', getMyTransactions);


export default router;