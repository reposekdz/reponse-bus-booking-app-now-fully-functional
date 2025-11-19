import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import config from './config';
import logger from './utils/logger';
import { initSocket } from './socket';

// Load environment variables
dotenv.config();

if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL) {
    logger.error('FATAL ERROR: FRONTEND_URL environment variable is not set for production Socket.IO CORS policy.');
    // FIX: Cast `process` to `any` to resolve TypeScript error when node types are not fully loaded.
    (process as any).exit(1);
}

const PORT = config.port || 5000;
const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL, // Restrict to frontend URL for security
        methods: ["GET", "POST"]
    }
});

initSocket(io); // Initialize socket logic

const startServer = async () => {
    try {
        await connectDB();
        server.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        (process as any).exit(1);
    }
};

startServer();