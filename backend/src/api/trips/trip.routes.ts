import { Router } from 'express';
import { searchTrips, getTripById } from './trip.controller';

const router = Router();

// @route   GET /api/v1/trips/search
// @desc    Search for available trips
// @access  Public
router.get('/search', searchTrips);

// @route   GET /api/v1/trips/:id
// @desc    Get a single trip by its ID
// @access  Public
router.get('/:id', getTripById);


export default router;
