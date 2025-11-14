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
};

// Validate that critical environment variables are set to prevent running with insecure defaults
if (!config.mysql.host || !config.mysql.user || !config.mysql.database || !config.jwt.secret) {
    console.error("FATAL ERROR: Missing critical environment variables. Check your .env file.");
    console.error("Required: DB_HOST, DB_USER, DB_NAME, JWT_SECRET. DB_PASSWORD can be empty for local development.");
    process.exit(1);
}


export default config;