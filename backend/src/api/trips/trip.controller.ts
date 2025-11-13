
import * as tripService from './trip.service';
import asyncHandler from '../../utils/asyncHandler';

// FIX: Removed explicit types to allow for correct type inference.
export const searchTrips = asyncHandler(async (req, res) => {
    const { from, to, date, companyId } = req.query;

    const query = {
        from: from as string,
        to: to as string,
        date: date as string,
        companyId: companyId as string | undefined,
    };
    
    const trips = await tripService.findTrips(query);

    res.status(200).json({
        success: true,
        count: trips.length,
        data: trips,
    });
});

export const getTripById = asyncHandler(async (req, res) => {
    const trip = await tripService.findTripById(req.params.id);
    res.status(200).json({
        success: true,
        data: trip
    });
});

export const confirmBoarding = asyncHandler(async (req, res) => {
    const { tripId } = req.params;
    const { ticketId } = req.body;
    const driverId = req.user.id;

    const result = await tripService.confirmPassengerBoarding({ driverId, tripId, ticketId });
    
    res.status(200).json({
        success: true,
        message: 'Passenger boarded successfully',
        data: result
    });
});

export const getTripManifest = asyncHandler(async (req, res) => {
    const manifest = await tripService.getManifestForTrip(req.params.tripId, req.user.id);
    res.status(200).json({ success: true, data: manifest });
});

export const departTrip = asyncHandler(async (req, res) => {
    await tripService.departTrip(req.params.tripId, req.user.id);
    res.status(200).json({ success: true, message: 'Trip departed.' });
});

export const arriveTrip = asyncHandler(async (req, res) => {
    await tripService.arriveTrip(req.params.tripId, req.user.id);
    res.status(200).json({ success: true, message: 'Trip arrived.' });
});
