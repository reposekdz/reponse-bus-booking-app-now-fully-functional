import { pool } from '../../config/db';
import { AppError } from '../../utils/AppError';
import * as mysql from 'mysql2/promise';

export const getAllStations = async () => {
    const [rows] = await pool.query('SELECT * FROM stations ORDER BY province, district, name');
    return rows;
};

export const createStation = async (data: any) => {
    const { name, district, province, type } = data;
    const [result] = await pool.query<mysql.ResultSetHeader>(
        'INSERT INTO stations (name, district, province, type) VALUES (?, ?, ?, ?)',
        [name, district, province, type || 'major']
    );
    return { id: result.insertId, ...data };
};

export const updateStation = async (id: number, data: any) => {
    const { name, district, province, type } = data;
    const [result] = await pool.query<mysql.OkPacket>(
        'UPDATE stations SET name = ?, district = ?, province = ?, type = ? WHERE id = ?',
        [name, district, province, type, id]
    );
    if (result.affectedRows === 0) {
        throw new AppError('Station not found', 404);
    }
    return { id, ...data };
};

export const deleteStation = async (id: number) => {
    const [result] = await pool.query<mysql.OkPacket>('DELETE FROM stations WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
        throw new AppError('Station not found', 404);
    }
};