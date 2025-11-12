import mongoose from 'mongoose';

const BusSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    plateNumber: {
        type: String,
        required: [true, 'Please add a plate number'],
        unique: true,
        trim: true,
    },
    model: {
        type: String,
        required: [true, 'Please add a bus model'],
    },
    capacity: {
        type: Number,
        required: [true, 'Please add the bus capacity'],
    },
    amenities: [{
        type: String,
        enum: ['WiFi', 'AC', 'Charging', 'TV'],
    }],
    status: {
        type: String,
        enum: ['Operational', 'Maintenance', 'On Route'],
        default: 'Operational',
    },
}, {
    timestamps: true
});

export default mongoose.model('Bus', BusSchema);
