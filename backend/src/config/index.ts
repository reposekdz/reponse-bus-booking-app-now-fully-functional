import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT,
    mysql: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    },
    vapid: {
        publicKey: process.env.VAPID_PUBLIC_KEY,
        privateKey: process.env.VAPID_PRIVATE_KEY,
    }
};

// Validate that critical environment variables are set to prevent running with insecure defaults
if (process.env.NODE_ENV === 'production' && (
    !config.mysql.host || 
    !config.mysql.user || 
    !config.mysql.database || 
    !config.jwt.secret ||
    !config.vapid.publicKey ||
    !config.vapid.privateKey
)) {
    console.error("FATAL ERROR: Missing critical environment variables for production. Check your .env file.");
    console.error("Required: DB_HOST, DB_USER, DB_NAME, JWT_SECRET, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY");
    // FIX: Cast `process` to `any` to resolve TypeScript error when node types are not fully loaded.
    (process as any).exit(1);
}


export default config;