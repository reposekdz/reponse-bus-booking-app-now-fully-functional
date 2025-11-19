
import * as bookingService from './booking.service';
import asyncHandler from '../../utils/asyncHandler';

export const createBooking = asyncHandler(async (req, res) => {
    const bookingDetails = {
        tripId: req.body.tripId,
        seats: req.body.seats,
        paymentMethod: req.body.paymentMethod,
        totalPrice: req.body.totalPrice,
        pin: req.body.pin, // Added pin for wallet transactions
    };

    const booking = await bookingService.createBooking(req.user!.id, bookingDetails);
    
    res.status(201).json({
        success: true,
        data: booking
    });
});

export const getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await bookingService.getBookingsForUser(req.user!.id);

    res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
    });
});

// Enhanced Management: Update Booking Status
export const updateBookingStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    // Only allow specific status transitions
    const allowedStatuses = ['Confirmed', 'Cancelled', 'Completed'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status provided.' });
    }

    const updatedBooking = await bookingService.updateBookingStatus(id, status, req.user);
    res.status(200).json({ success: true, data: updatedBooking });
});
