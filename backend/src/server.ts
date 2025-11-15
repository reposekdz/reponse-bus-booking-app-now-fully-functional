import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { Server } from 'socket.io';
import app from './app';
import dotenv from 'dotenv';
import { connectDB, closeDB } from './config/db';
import config from './config';
import logger from './utils/logger';
import { initSocket } from './socket';
import { healthService } from './services/health.service';

// Load environment variables
dotenv.config();

const PORT = config.port || 5000;
const isProduction = config.nodeEnv === 'production';

// Create server (HTTP or HTTPS based on environment)
let server: http.Server | https.Server;

if (isProduction && process.env.SSL_CERT_PATH && process.env.SSL_KEY_PATH) {
    // HTTPS server for production
    const sslOptions = {
        key: fs.readFileSync(process.env.SSL_KEY_PATH),
        cert: fs.readFileSync(process.env.SSL_CERT_PATH),
        // Add intermediate certificate if available
        ...(process.env.SSL_CA_PATH && {
            ca: fs.readFileSync(process.env.SSL_CA_PATH)
        })
    };
    
    server = https.createServer(sslOptions, app);
    logger.info('HTTPS server configured');
} else {
    // HTTP server for development
    server = http.createServer(app);
    logger.info('HTTP server configured');
}

// Socket.IO configuration
export const io = new Server(server, {
    cors: {
        origin: function(origin, callback) {
            const allowedOrigins = process.env.FRONTEND_URL?.split(',') || ['http://localhost:3000'];
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
    upgradeTimeout: 30000,
    maxHttpBufferSize: 1e6, // 1MB
    allowEIO3: true
});

// Initialize Socket.IO
initSocket(io);

// Server startup function
const startServer = async () => {
    try {
        logger.info('Starting GoBus Backend Server...');
        logger.info(`Environment: ${config.nodeEnv}`);
        logger.info(`Node.js version: ${process.version}`);
        
        // Connect to database
        logger.info('Connecting to database...');
        await connectDB();
        logger.info('Database connected successfully');
        
        // Start server
        server.listen(PORT, () => {
            logger.info(`🚀 Server running on port ${PORT}`);
            logger.info(`📊 Health check available at: http://localhost:${PORT}/health`);
            logger.info(`🔧 API documentation: http://localhost:${PORT}/api/v1/docs`);
            
            if (isProduction) {
                logger.info('🔒 Running in production mode');
            } else {
                logger.info('🛠️  Running in development mode');
            }
        });
        
        // Handle server errors
        server.on('error', (error: NodeJS.ErrnoException) => {
            if (error.code === 'EADDRINUSE') {
                logger.error(`Port ${PORT} is already in use`);
                process.exit(1);
            } else if (error.code === 'EACCES') {
                logger.error(`Permission denied to bind to port ${PORT}`);
                process.exit(1);
            } else {
                logger.error('Server error:', error);
                process.exit(1);
            }
        });
        
        // Socket.IO connection logging
        io.on('connection', (socket) => {
            logger.info(`Client connected: ${socket.id}`);
            healthService.recordRequest();
            
            socket.on('disconnect', (reason) => {
                logger.info(`Client disconnected: ${socket.id}, reason: ${reason}`);
            });
        });
        
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Graceful shutdown function
const gracefulShutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    
    // Set a timeout for forceful shutdown
    const shutdownTimeout = setTimeout(() => {
        logger.error('Forceful shutdown due to timeout');
        process.exit(1);
    }, 30000); // 30 seconds timeout
    
    try {
        // Stop accepting new connections
        server.close(async () => {
            logger.info('HTTP server closed');
            
            try {
                // Close Socket.IO connections
                io.close(() => {
                    logger.info('Socket.IO server closed');
                });
                
                // Close database connections
                await closeDB();
                logger.info('Database connections closed');
                
                // Cleanup health service
                await healthService.cleanup();
                logger.info('Health service cleaned up');
                
                clearTimeout(shutdownTimeout);
                logger.info('Graceful shutdown completed');
                process.exit(0);
            } catch (error) {
                logger.error('Error during shutdown cleanup:', error);
                clearTimeout(shutdownTimeout);
                process.exit(1);
            }
        });
    } catch (error) {
        logger.error('Error during graceful shutdown:', error);
        clearTimeout(shutdownTimeout);
        process.exit(1);
    }
};

// Process event handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); // Nodemon restart

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
});

// Handle process warnings
process.on('warning', (warning) => {
    logger.warn('Process warning:', {
        name: warning.name,
        message: warning.message,
        stack: warning.stack
    });
});

// Start the server
startServer();

// Export server for testing
export { server };