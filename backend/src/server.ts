import app from './app';
import dotenv from 'dotenv';
import connectDB from './config/db';
import config from './config';
import logger from './utils/logger';

// Load environment variables
dotenv.config();

const PORT = config.port || 5000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        // FIX: Removed 'as any' to resolve type definition error for 'exit'.
        process.exit(1);
    }
};

startServer();