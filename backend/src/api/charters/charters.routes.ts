import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware';
import { createCharterRequest } from './charters.controller';

const router = Router();

// All routes here require an authenticated user
router.use(protect);

router.post('/', createCharterRequest);

export default router;
