import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
    'NODE_ENV',
    'PORT',
    'MYSQL_HOST',
    'MYSQL_USER',
    'MYSQL_PASSWORD',
    'MYSQL_DATABASE',
    'JWT_SECRET',
    'REDIS_HOST',
    'REDIS_PORT'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

const config = {
    // Server Configuration
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // Database Configuration
    mysql: {
        host: process.env.MYSQL_HOST!,
        user: process.env.MYSQL_USER!,
        password: process.env.MYSQL_PASSWORD!,
        database: process.env.MYSQL_DATABASE!,
        port: parseInt(process.env.MYSQL_PORT || '3306', 10),
        connectionLimit: parseInt(process.env.MYSQL_CONNECTION_LIMIT || '20', 10)
    },
    
    // Redis Configuration
    redis: {
        host: process.env.REDIS_HOST!,
        port: parseInt(process.env.REDIS_PORT!, 10),
        password: process.env.REDIS_PASSWORD || undefined,
        db: parseInt(process.env.REDIS_DB || '0', 10)
    },
    
    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET!,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        refreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET!,
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
    },
    
    // Session Configuration
    sessionSecret: process.env.SESSION_SECRET || process.env.JWT_SECRET!,
    
    // Email Configuration
    email: {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587', 10),
        secure: process.env.EMAIL_SECURE === 'true',
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
        from: process.env.EMAIL_FROM || 'noreply@gobus.com'
    },
    
    // SMS Configuration (Twilio)
    sms: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        phoneNumber: process.env.TWILIO_PHONE_NUMBER
    },
    
    // Payment Configuration (Stripe)
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
    },
    
    // Firebase Configuration
    firebase: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    },
    
    // File Upload Configuration
    upload: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
        allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,application/pdf').split(','),
        uploadPath: process.env.UPLOAD_PATH || './uploads'
    },
    
    // Rate Limiting Configuration
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
        authWindowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
        authMaxRequests: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || '5', 10)
    },
    
    // Logging Configuration
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        file: process.env.LOG_FILE || 'logs/app.log',
        maxSize: process.env.LOG_MAX_SIZE || '20m',
        maxFiles: process.env.LOG_MAX_FILES || '14d'
    },
    
    // External APIs
    apis: {
        googleMapsKey: process.env.GOOGLE_MAPS_API_KEY,
        weatherApiKey: process.env.WEATHER_API_KEY,
        smsGatewayUrl: process.env.SMS_GATEWAY_URL,
        paymentGatewayUrl: process.env.PAYMENT_GATEWAY_URL
    },
    
    // Business Logic Configuration
    business: {
        bookingExpiryMinutes: parseInt(process.env.BOOKING_EXPIRY_MINUTES || '15', 10),
        maxSeatsPerBooking: parseInt(process.env.MAX_SEATS_PER_BOOKING || '6', 10),
        refundWindowHours: parseInt(process.env.REFUND_WINDOW_HOURS || '24', 10),
        loyaltyPointsRatio: parseFloat(process.env.LOYALTY_POINTS_RATIO || '0.01'), // 1 point per $1
        maxLoyaltyDiscount: parseFloat(process.env.MAX_LOYALTY_DISCOUNT || '0.2') // 20% max discount
    },
    
    // Security Configuration
    security: {
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
        maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
        lockoutDurationMinutes: parseInt(process.env.LOCKOUT_DURATION_MINUTES || '30', 10),
        passwordMinLength: parseInt(process.env.PASSWORD_MIN_LENGTH || '8', 10),
        otpExpiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10)
    },
    
    // Monitoring Configuration
    monitoring: {
        enableMetrics: process.env.ENABLE_METRICS === 'true',
        metricsPort: parseInt(process.env.METRICS_PORT || '9090', 10),
        healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL || '30000', 10)
    }
};

export default config;