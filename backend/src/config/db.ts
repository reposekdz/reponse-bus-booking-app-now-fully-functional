import mongoose from 'mongoose';
import config from './index';
import logger from '../utils/logger';

const connectDB = async () => {
    try {
        if (!config.mongoUri) {
            throw new Error('MONGO_URI is not defined in environment variables.');
        }
        await mongoose.connect(config.mongoUri);
        logger.info('MongoDB connected successfully.');
    } catch (error) {
        logger.error('MongoDB connection failed:', error.message);
        // FIX: Removed 'as any' to resolve type definition error for 'exit'.
        process.exit(1);
    }
};

export default connectDB;