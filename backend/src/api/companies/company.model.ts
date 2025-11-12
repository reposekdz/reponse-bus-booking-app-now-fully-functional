import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a company name'],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        maxlength: 500,
    },
    logoUrl: {
        type: String,
    },
    coverUrl: {
        type: String,
    },
    contact: {
        email: String,
        phone: String,
        address: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['Active', 'Pending', 'Suspended'],
        default: 'Pending',
    },
}, {
    timestamps: true
});

export default mongoose.model('Company', CompanySchema);
