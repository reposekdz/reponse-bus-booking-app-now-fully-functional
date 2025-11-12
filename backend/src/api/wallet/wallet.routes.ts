import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware';
import { getWalletHistory, topUpWallet } from './wallet.controller';

const router = Router();

// All routes in this file are protected
router.use(protect);

router.route('/history').get(getWalletHistory);
router.route('/topup').post(topUpWallet);

export default router;