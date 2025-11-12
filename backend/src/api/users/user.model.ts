import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config';

// FIX: Define and export IUser interface for type safety and augmentation.
export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    role: 'passenger' | 'driver' | 'agent' | 'company' | 'admin';
    avatarUrl: string;
    status: 'Active' | 'Suspended' | 'Pending';
    walletBalance: number;
    loyaltyPoints: number;
    pin?: string;
    company?: mongoose.Schema.Types.ObjectId;
    getSignedJwtToken(): string;
    matchPassword(enteredPassword: string): Promise<boolean>;
}


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false, // Don't return password by default
    },
    phone: {
        type: String,
    },
    role: {
        type: String,
        enum: ['passenger', 'driver', 'agent', 'company', 'admin'],
        default: 'passenger',
    },
    avatarUrl: {
        type: String,
        default: 'https://randomuser.me/api/portraits/lego/1.jpg'
    },
    status: {
        type: String,
        enum: ['Active', 'Suspended', 'Pending'],
        default: 'Active',
    },
    // Passenger-specific fields
    walletBalance: {
        type: Number,
        default: 0,
    },
    loyaltyPoints: {
        type: Number,
        default: 0,
    },
    pin: {
        type: String,
        minlength: 4,
        maxlength: 4,
        select: false,
    },
    // Link to a company for non-passenger roles
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: false,
    }
}, {
    timestamps: true
});

// Encrypt password using bcrypt before saving
// FIX: Removed 'this: IUser' typing to let mongoose infer the context which includes methods like 'isModified'.
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    if (this.password) {
        this.password = await bcrypt.hash(this.password, salt);
    }
});

// Sign JWT and return
// FIX: Removed 'this: IUser' typing and explicitly cast expiresIn to string to resolve overload issue.
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn as string,
    });
};

// Match user entered password to hashed password in database
// FIX: Removed 'this: IUser' typing to let mongoose infer the context.
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
    if (!this.password) {
        return false;
    }
    return await bcrypt.compare(enteredPassword, this.password);
};


export default mongoose.model<IUser>('User', UserSchema);
