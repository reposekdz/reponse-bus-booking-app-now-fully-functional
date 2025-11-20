
import { Router } from 'express';
import { register, login, getMe, updatePassword, forgotPassword, resetPassword } from './auth.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);

export default router;
