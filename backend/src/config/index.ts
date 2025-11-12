import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT,
    mongoUri: process.env.MONGO_URI,
    jwt: {
        // FIX: Provide a default value for JWT_SECRET to ensure it is always a string.
        secret: process.env.JWT_SECRET || 'your_default_secret_key',
        // FIX: Provide a default value to ensure the type is always string.
        expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    },
};

export default config;