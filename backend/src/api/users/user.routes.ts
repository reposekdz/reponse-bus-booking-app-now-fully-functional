import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware';
import { updateUserAvatar } from './user.controller';

const router = Router();

// All routes here are for the authenticated user acting on their own profile
router.use(protect);

router.put('/me/avatar', updateUserAvatar);

export default router;
