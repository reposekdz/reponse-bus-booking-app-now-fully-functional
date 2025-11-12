import { Request, Response } from 'express';
import * as bookingService from './booking.service';
import asyncHandler from '../../utils/asyncHandler';

// FIX: Removed explicit types to allow for correct type inference.
export const createBooking = asyncHandler(async (req: any, res) => {
    const bookingDetails = {
        tripId: req.body.tripId,
        seats: req.body.seats,
        paymentMethod: req.body.paymentMethod,
        totalPrice: req.body.totalPrice
    };

    const booking = await bookingService.createBooking(req.user!._id, bookingDetails);
    
    res.status(201).json({
        success: true,
        data: booking
    });
});

// FIX: Removed explicit types to allow for correct type inference.
export const getMyBookings = asyncHandler(async (req: any, res) => {
    const bookings = await bookingService.getBookingsForUser(req.user!._id);

    res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
    });
});