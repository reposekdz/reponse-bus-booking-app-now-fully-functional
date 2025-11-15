import { Router } from 'express';
import authRoutes from '../auth/auth.routes';

const router = Router();

router.use('/auth', authRoutes);

router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'GoBus API v1.0.0',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

export default router;