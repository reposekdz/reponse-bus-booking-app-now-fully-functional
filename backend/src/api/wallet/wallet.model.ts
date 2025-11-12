import mongoose from 'mongoose';

const WalletTransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['top-up', 'purchase', 'refund', 'commission'],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['completed', 'pending', 'failed'],
        default: 'completed'
    },
    description: {
        type: String,
    }
}, {
    timestamps: true
});

export default mongoose.model('WalletTransaction', WalletTransactionSchema);