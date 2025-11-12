import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    passenger: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true,
    },
    seats: {
        type: [String],
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    payment: {
        method: {
            type: String,
            enum: ['Wallet', 'MoMo', 'Card'],
            required: true,
        },
        transactionId: String,
        status: {
            type: String,
            enum: ['Paid', 'Pending', 'Failed'],
            default: 'Paid',
        }
    },
    status: {
        type: String,
        enum: ['Confirmed', 'Cancelled', 'Completed'],
        default: 'Confirmed'
    },
    bookingId: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true
});

export default mongoose.model('Booking', BookingSchema);
