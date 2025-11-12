import mongoose from 'mongoose';
import Booking from './booking.model';
import Trip from '../trips/trip.model';
import User from '../users/user.model';
import { AppError } from '../../utils/AppError';

interface BookingDetails {
    tripId: string;
    seats: string[];
    paymentMethod: string;
    totalPrice: number;
}

export const createBooking = async (userId: string, details: BookingDetails) => {
    const { tripId, seats, paymentMethod, totalPrice } = details;
    
    // For a real high-concurrency application, a database transaction is essential here.
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const trip = await Trip.findById(tripId).session(session).populate('route');
        if (!trip) {
            throw new AppError('Trip not found', 404);
        }
        if (trip.status !== 'Scheduled') {
            throw new AppError('This trip is no longer available for booking', 400);
        }

        // --- Critical Section: Check Seat Availability ---
        for (const seat of seats) {
            if (trip.seatMap.get(seat) !== 'available') {
                throw new AppError(`Seat ${seat} is not available`, 409); // 409 Conflict
            }
        }

        const passenger = await User.findById(userId).session(session);
        if (!passenger) {
            throw new AppError('Passenger not found', 404);
        }

        // Server-side price validation
        // @ts-ignore
        const expectedPrice = trip.route.basePrice * seats.length;
        if(totalPrice !== expectedPrice) {
            // This could be more complex with seat types, but for now we check base price
            throw new AppError('Price mismatch. Please try booking again.', 400);
        }
        
        // --- Payment Processing Simulation ---
        if (paymentMethod === 'Wallet') {
            if (passenger.walletBalance < totalPrice) {
                throw new AppError('Insufficient wallet balance', 400);
            }
            passenger.walletBalance -= totalPrice;
            await passenger.save({ session });
        }
        // In a real app, calls to MoMo or Card gateways would happen here.

        // --- Update Data and Create Booking ---
        // Mark seats as occupied
        for (const seat of seats) {
            trip.seatMap.set(seat, 'occupied');
        }
        await trip.save({ session });
        
        const booking = new Booking({
            passenger: userId,
            trip: tripId,
            seats,
            totalPrice,
            payment: {
                method: paymentMethod,
                status: 'Paid',
                transactionId: `TXN-${Date.now()}`
            },
            bookingId: `GB-${Date.now().toString().slice(-6)}`
        });
        await booking.save({ session });

        await session.commitTransaction();
        
        return booking;

    } catch (error) {
        await session.abortTransaction();
        throw error; // Re-throw the error to be handled by the asyncHandler
    } finally {
        session.endSession();
    }
};

export const getBookingsForUser = async (userId: string) => {
    return Booking.find({ passenger: userId })
        .populate({
            path: 'trip',
            populate: [
                {
                    path: 'route',
                    populate: {
                        path: 'company',
                        select: 'name'
                    }
                }
            ]
        })
        .sort({ createdAt: -1 });
};
