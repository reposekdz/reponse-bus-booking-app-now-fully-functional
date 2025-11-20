import mysql from 'mysql2/promise';
import config from './index';
import logger from '../utils/logger';

// Production-ready pool configuration
const pool = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    waitForConnections: true,
    connectionLimit: process.env.NODE_ENV === 'production' ? 50 : 10, // Higher limit for prod
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        logger.info(`MySQL connected successfully to ${config.mysql.database} on ${config.mysql.host}`);
        connection.release();
    } catch (error) {
        logger.error('MySQL connection failed:', (error as Error).message);
        // In Docker/Orchestrators, letting the process exit allows a restart policy to kick in
        (process as any).exit(1);
    }
};

export { pool, connectDB };