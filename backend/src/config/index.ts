
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
    },
    mtn: {
        baseUrl: 'https://sandbox.momodeveloper.mtn.com',
        environment: 'sandbox', 
        currency: 'RWF',
        collection: {
            subscriptionKey: process.env.MTN_COLLECTIONS_PRIMARY_KEY, 
            apiUserId: process.env.MTN_COLLECTION_USER_ID,
            apiKey: process.env.MTN_COLLECTION_API_KEY,
        },
        disbursement: {
            subscriptionKey: process.env.MTN_DISBURSEMENTS_PRIMARY_KEY, 
            apiUserId: process.env.MTN_DISBURSEMENT_USER_ID,
            apiKey: process.env.MTN_DISBURSEMENT_API_KEY,
        },
        remittance: {
            subscriptionKey: process.env.MTN_REMITTANCE_PRIMARY_KEY,
            apiUserId: process.env.MTN_REMITTANCE_USER_ID,
            apiKey: process.env.MTN_REMITTANCE_API_KEY,
        }
    }
};

if (process.env.NODE_ENV === 'production' && (!config.mysql.host || !config.jwt.secret)) {
    console.error("FATAL ERROR: Missing critical environment variables.");
    (process as any).exit(1);
}

export default config;
