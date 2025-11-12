import { Router } from 'express';
import authRoutes from '../api/auth/auth.routes';
import adminRoutes from '../api/admin/admin.routes';
import tripRoutes from '../api/trips/trip.routes';
import bookingRoutes from '../api/bookings/booking.routes';
import companyRoutes from '../api/companies/company.routes';
import debugRoutes from '../api/debug/debug.routes';
import walletRoutes from '../api/wallet/wallet.routes';

const router = Router();

// Mount all resource routers
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/trips', tripRoutes);
router.use('/bookings', bookingRoutes);
router.use('/companies', companyRoutes);
router.use('/debug', debugRoutes);
router.use('/wallet', walletRoutes);


export default router;