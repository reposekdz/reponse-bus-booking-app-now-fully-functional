import { pool } from '../../config/db';
import * as mysql from 'mysql2/promise';

export const createRequest = async (userId: number, data: any) => {
    const { companyId, from, to, departureDate, returnDate, passengers, tripReason } = data;
    const [result] = await pool.query<mysql.ResultSetHeader>(
        'INSERT INTO bus_charters (requesting_user_id, company_id, origin, destination, departure_date, return_date, num_passengers, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, companyId, from, to, departureDate, returnDate || null, passengers, tripReason]
    );
    return { id: result.insertId, ...data };
};
