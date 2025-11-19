import mysql from 'mysql2/promise';
import config from './index';
import logger from '../utils/logger';

const pool = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        logger.info('MySQL connected successfully.');
        connection.release();
    } catch (error) {
        logger.error('MySQL connection failed:', (error as Error).message);
        (process as any).exit(1);
    }
};

export { pool, connectDB };
