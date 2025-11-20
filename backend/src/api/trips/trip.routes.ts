
import { Router } from 'express';
import { searchTrips, getTripById, confirmBoarding, getTripManifest, departTrip, arriveTrip, updateTripStatus } from './trip.controller';
import { protect, authorize } from '../../middleware/auth.middleware';


const router = Router();

// @route   GET /api/v1/trips/search
// @desc    Search for available trips
// @access  Public
router.get('/search', searchTrips);

// @route   GET /api/v1/trips/:id
// @desc    Get a single trip by its ID
// @access  Public
router.get('/:id', getTripById);


// @route   PATCH /api/v1/trips/:id/status
// @desc    Update trip status (e.g. Delayed, Cancelled) - triggers notifications
// @access  Private (Company/Admin)
router.patch('/:id/status', protect, authorize('company', 'admin'), updateTripStatus);

// --- DRIVER ACCESSIBLE ROUTES ---
router.use(protect, authorize('driver'));

// @route   POST /api/v1/trips/:tripId/boardings
// @desc    Confirm a passenger has boarded
router.post('/:tripId/boardings', confirmBoarding);

// @route   GET /api/v1/trips/:tripId/manifest
// @desc    Get passenger manifest for a trip
router.get('/:tripId/manifest', getTripManifest);

// @route   POST /api/v1/trips/:tripId/depart
// @desc    Mark a trip as departed
router.post('/:tripId/depart', departTrip);

// @route   POST /api/v1/trips/:tripId/arrive
// @desc    Mark a trip as arrived
router.post('/:tripId/arrive', arriveTrip);


export default router;
