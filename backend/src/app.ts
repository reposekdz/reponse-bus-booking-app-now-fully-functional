import express from 'express';
import cors from 'cors';
import apiRouter from './routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Core Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1', apiRouter);

// Health Check
// FIX: Removed explicit Request and Response types to allow for correct type inference from express.
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

// 404 Handler
// FIX: Removed explicit Request and Response types to allow for correct type inference from express.
app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

// Global Error Handler
app.use(errorHandler);

export default app;