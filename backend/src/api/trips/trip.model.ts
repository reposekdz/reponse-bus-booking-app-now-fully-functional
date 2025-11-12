import mongoose from 'mongoose';

const TripSchema = new mongoose.Schema({
    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: true,
    },
    bus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
        required: true,
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    departureTime: {
        type: Date,
        required: true,
    },
    arrivalTime: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Departed', 'Arrived', 'Cancelled', 'Delayed'],
        default: 'Scheduled',
    },
    // Map of seat IDs (e.g., "A1") to their status ('available', 'occupied') for this trip
    seatMap: {
        type: Map,
        of: String,
        default: {},
    },
}, {
    timestamps: true
});

export default mongoose.model('Trip', TripSchema);
