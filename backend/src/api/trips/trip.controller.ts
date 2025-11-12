import { Request, Response } from 'express';
import * as tripService from './trip.service';
import asyncHandler from '../../utils/asyncHandler';

// FIX: Removed explicit types to allow for correct type inference.
export const searchTrips = asyncHandler(async (req, res) => {
    const { from, to, date } = req.query;

    const query = {
        from: from as string,
        to: to as string,
        date: date as string,
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