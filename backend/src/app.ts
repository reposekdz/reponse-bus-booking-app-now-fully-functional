import express from 'express';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import apiRouter from './routes';
import { errorHandler } from './middleware/error.middleware';
import logger from './utils/logger';

const app = express();

// --- Security & Performance Middleware ---

// 1. Helmet: Sets various HTTP headers for security
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for now to allow inline scripts/images in dev/demos
  crossOriginEmbedderPolicy: false
}));

// 2. Compression: Gzip responses
app.use(compression());

// 3. Logging: HTTP request logger
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) }
}));

// 4. Rate Limiting: Prevent brute-force/DDOS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// --- Core Middleware ---

// CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ['http://localhost:3000'];
app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // In development, you might want to allow all, but in prod, be strict
        if (process.env.NODE_ENV !== 'production') return callback(null, true);
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true
}));

app.use(express.json() as express.RequestHandler);
app.use(express.urlencoded({ extended: true }) as express.RequestHandler);

// --- Routes ---
app.use('/api/v1', apiRouter);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'UP', 
      timestamp: new Date(), 
      environment: process.env.NODE_ENV 
    });
});

// --- Serve Frontend in Production ---
if (process.env.NODE_ENV === 'production') {
    // The build script should copy the frontend 'dist' to 'backend/public'
    // or mount it via Docker volumes
    const publicPath = path.join((process as any).cwd(), 'public');
    
    app.use(express.static(publicPath));

    // For any non-API request, serve index.html to enable client-side routing
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(publicPath, 'index.html'));
    });
}

// 404 Handler
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: 'API route not found' });
});

// Global Error Handler
app.use(errorHandler);

export default app;