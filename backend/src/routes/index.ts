import { Router } from 'express';
import authRoutes from '../api/auth/auth.routes';
import adminRoutes from '../api/admin/admin.routes';
import tripRoutes from '../api/trips/trip.routes';
import bookingRoutes from '../api/bookings/booking.routes';
import companyRoutes from '../api/companies/company.routes';
import debugRoutes from '../api/debug/debug.routes';
import walletRoutes from '../api/wallet/wallet.routes';
import messageRoutes from '../api/messages/message.routes';
import settingsRoutes from '../api/settings/settings.routes';
import destinationRoutes from '../api/destinations/destinations.routes';
import driverRoutes from '../api/drivers/driver.routes';
import agentRoutes from '../api/agent/agent.routes';
import paymentRoutes from '../api/payments/payments.routes';
import loyaltyRoutes from '../api/loyalty/loyalty.routes';
import priceAlertRoutes from '../api/price-alerts/price-alerts.routes';
import lostAndFoundRoutes from '../api/lost-and-found/lost-and-found.routes';
import packageRoutes from '../api/packages/packages.routes';
import charterRoutes from '../api/charters/charters.routes';
import userRoutes from '../api/users/user.routes';
import notificationRoutes from '../api/notifications/notifications.routes';
import advertisementRoutes from '../api/advertisements/advertisements.routes';
import stationRoutes from '../api/stations/stations.routes';

const router = Router();

// Mount all resource routers
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/trips', tripRoutes);
router.use('/bookings', bookingRoutes);
router.use('/companies', companyRoutes);
router.use('/wallet', walletRoutes);
router.use('/messages', messageRoutes);
router.use('/settings', settingsRoutes);
router.use('/destinations', destinationRoutes);
router.use('/drivers', driverRoutes);
router.use('/agents', agentRoutes);
router.use('/payments', paymentRoutes);
router.use('/loyalty', loyaltyRoutes);
router.use('/price-alerts', priceAlertRoutes);
router.use('/lost-and-found', lostAndFoundRoutes);
router.use('/packages', packageRoutes);
router.use('/charters', charterRoutes);
router.use('/users', userRoutes);
router.use('/notifications', notificationRoutes);
router.use('/advertisements', advertisementRoutes);
router.use('/stations', stationRoutes);

// Only mount debug routes in non-production environments
if (process.env.NODE_ENV !== 'production') {
    router.use('/debug', debugRoutes);
}


export default router;