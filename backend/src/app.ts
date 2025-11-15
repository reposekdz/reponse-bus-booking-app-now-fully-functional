import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectRedis from 'connect-redis';
import Redis from 'ioredis';
import path from 'path';
import apiRouter from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { 
    generalLimiter, 
    requestLogger, 
    securityHeaders, 
    suspiciousActivityDetection,
    sqlInjectionProtection,
    xssProtection
} from './middleware/security.middleware';
import config from './config';
import logger from './utils/logger';

const app = express();

app.set('trust proxy', 1);

// Security headers
app.use(securityHeaders);

// Enhanced helmet configuration
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'", "wss:", "ws:", "https:"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = process.env.FRONTEND_URL?.split(',') || ['http://localhost:3000'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count']
}));

// Compression
app.use(compression({
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    },
    threshold: 1024
}));

// Request logging
app.use(requestLogger);

// Security middleware
app.use(suspiciousActivityDetection);
app.use(sqlInjectionProtection);
app.use(xssProtection);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

const RedisStore = connectRedis(session);
const redisClient = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password
});

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use('/api/v1', generalLimiter);

app.get('/health', async (req, res) => {
    try {
        const healthStatus = await require('./services/health.service').healthService.getHealthStatus();
        const statusCode = healthStatus.status === 'healthy' ? 200 : 
                          healthStatus.status === 'degraded' ? 200 : 503;
        
        res.status(statusCode).json(healthStatus);
    } catch (error) {
        logger.error('Health check endpoint failed:', error);
        res.status(503).json({
            status: 'unhealthy',
            message: 'Health check failed',
            timestamp: new Date().toISOString()
        });
    }
});

// Readiness probe
app.get('/ready', async (req, res) => {
    try {
        const { db } = require('./services/database.service');
        await db.execute('SELECT 1');
        res.status(200).json({ status: 'ready', timestamp: new Date().toISOString() });
    } catch (error) {
        res.status(503).json({ status: 'not ready', timestamp: new Date().toISOString() });
    }
});

// Liveness probe
app.get('/live', (req, res) => {
    res.status(200).json({ status: 'alive', timestamp: new Date().toISOString() });
});

app.use('/api/v1', apiRouter);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

if (process.env.NODE_ENV === 'production') {
    const publicPath = path.join(__dirname, '..', 'public');
    app.use(express.static(publicPath));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(publicPath, 'index.html'));
    });
}

// 404 handler for API routes
app.use('/api/*', notFoundHandler);

// 404 handler for all other routes
app.use('*', notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export default app;