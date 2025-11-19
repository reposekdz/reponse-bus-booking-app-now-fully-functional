import express from 'express';
import cors from 'cors';
import path from 'path';
import apiRouter from './routes';
import { errorHandler } from './middleware/error.middleware';
import logger from './utils/logger';

const app = express();

// Core Middleware
// Configure CORS for production readiness.
if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL) {
    logger.error('FATAL ERROR: FRONTEND_URL environment variable is not set for production CORS policy.');
    // FIX: Cast `process` to `any` to resolve TypeScript error when node types are not fully loaded.
    (process as any).exit(1);
}
app.use(cors({
    origin: process.env.FRONTEND_URL
}));

app.use(express.json() as express.RequestHandler);
app.use(express.urlencoded({ extended: true }) as express.RequestHandler);

// API Routes
app.use('/api/v1', apiRouter);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});


// --- SERVE FRONTEND IN PRODUCTION ---
if (process.env.NODE_ENV === 'production') {
    // This path assumes the frontend 'dist' folder is copied to 'backend/public'.
    // FIX: Replaced `__dirname` with a path construction based on `process.cwd()` to resolve TypeScript's "Cannot find name '__dirname'" error, assuming the process runs from the project root.
    const publicPath = path.join((process as any).cwd(), 'backend', 'public');
    
    app.use(express.static(publicPath));

    // For any non-API request, serve index.html to enable client-side routing.
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(publicPath, 'index.html'));
    });
}


// 404 Handler for API routes that aren't found
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: 'API route not Found' });
});


// Global Error Handler
app.use(errorHandler);

export default app;