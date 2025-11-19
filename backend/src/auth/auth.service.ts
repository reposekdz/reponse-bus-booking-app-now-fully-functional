

import { AppError } from '../utils/AppError';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config';
import { pool } from '../config/db';
import { User } from '../types';
import * as mysql from 'mysql2/promise';

const generateToken = (userId: number) => {
    return jwt.sign({ id: userId }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    } as SignOptions);
};

export const registerUser = async (userData: any) => {
    const { name, email, password, phone } = userData;

    const [existingUsers] = await pool.query<User[] & mysql.RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
        throw new AppError('User already exists', 400);
    }
    
    const password_hash = await bcrypt.hash(password, 10);
    
    const [result] = await pool.query<mysql.ResultSetHeader>(
        'INSERT INTO users (name, email, password_hash, phone_number, role) VALUES (?, ?, ?, ?, ?)',
        [name, email, password_hash, phone, 'passenger']
    );

    const userId = result.insertId;
    const [rows] = await pool.query<User[] & mysql.RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [userId]);
    const user = rows[0];
    delete user.password_hash;
    
    const token = generateToken(userId);

    return { user, token };
};

export const loginUser = async (loginData: any) => {
    const { email, password } = loginData;

    if (!email || !password) {
        throw new AppError('Please provide an email and password', 400);
    }

    const [rows] = await pool.query<User[] & mysql.RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash!))) {
        throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken(user.id);
    delete user.password_hash;
    
    return { user, token };
};

export const updatePassword = async (userId: number, currentPassword, newPassword) => {
    if (!currentPassword || !newPassword) {
        throw new AppError('Please provide current and new passwords', 400);
    }

    const [rows] = await pool.query<User[] & mysql.RowDataPacket[]>('SELECT password_hash FROM users WHERE id = ?', [userId]);
    const user = rows[0];

    if (!user) {
        throw new AppError('User not found', 404);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash!);
    if (!isMatch) {
        throw new AppError('Incorrect current password', 401);
    }

    const new_password_hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [new_password_hash, userId]);
};
