import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware';
import { initiateMomoPayment, handleMomoCallback } from './payments.controller';

const router = Router();

router.post('/momo/initiate', protect, initiateMomoPayment);

// This endpoint is called by the external payment provider (MTN) and should not be protected by user auth.
// In production, it should be secured by other means (e.g., IP whitelist, signature verification).
router.post('/momo/callback', handleMomoCallback);


export default router;