
import { Router } from 'express';
import { protect, authorize } from '../../middleware/auth.middleware';
import { createBooking, getMyBookings, updateBookingStatus } from './booking.controller';

const router = Router();

// All booking routes require a logged-in user
router.use(protect);

router.route('/')
    .post(createBooking)
    .get(getMyBookings);

// Management route: Allow admin and company to update booking status
router.route('/:id/status')
    .patch(authorize('admin', 'company'), updateBookingStatus);

export default router;
