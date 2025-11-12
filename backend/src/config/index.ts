import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT,
    mongoUri: process.env.MONGO_URI,
    jwt: {
        secret: process.env.JWT_SECRET,
        // FIX: Provide a default value to ensure the type is always string.
        expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    },
};

export default config;