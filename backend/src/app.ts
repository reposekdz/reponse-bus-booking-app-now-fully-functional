import express from 'express';
import cors from 'cors';
import path from 'path';
import apiRouter from './routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Core Middleware
// Configure CORS for production readiness. It will only allow requests from the URL specified in the .env file.
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
    const publicPath = path.join(__dirname, '..', 'public');
    
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