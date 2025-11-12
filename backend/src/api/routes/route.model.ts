import mongoose from 'mongoose';

const RouteSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    from: {
        type: String,
        required: [true, 'Please specify the origin'],
    },
    to: {
        type: String,
        required: [true, 'Please specify the destination'],
    },
    basePrice: {
        type: Number,
        required: [true, 'Please set a base price'],
    },
    estimatedDurationMinutes: {
        type: Number,
        required: [true, 'Please set an estimated duration in minutes'],
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
}, {
    timestamps: true
});

// Ensure a company cannot have duplicate routes
RouteSchema.index({ company: 1, from: 1, to: 1 }, { unique: true });

export default mongoose.model('Route', RouteSchema);
