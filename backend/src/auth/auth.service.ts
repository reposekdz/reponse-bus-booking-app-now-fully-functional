import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db';
import config from '../config';

export const register = async (userData: any) => {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const [result] = await pool.execute(
        'INSERT INTO users (email, password, name, phone) VALUES (?, ?, ?, ?)',
        [userData.email, hashedPassword, userData.name, userData.phone]
    );
    
    return { success: true, message: 'User registered successfully' };
};

export const login = async (credentials: any) => {
    const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [credentials.email]
    );
    
    const users = rows as any[];
    if (users.length === 0) {
        throw new Error('Invalid credentials');
    }
    
    const user = users[0];
    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
    
    if (!isValidPassword) {
        throw new Error('Invalid credentials');
    }
    
    const token = jwt.sign(
        { id: user.id }, 
        config.jwt.secret as string, 
        { expiresIn: config.jwt.expiresIn as string }
    );
    
    return {
        success: true,
        data: {
            user: { id: user.id, email: user.email, name: user.name },
            token
        }
    };
};

export const getUserById = async (id: number) => {
    const [rows] = await pool.execute(
        'SELECT id, email, name, phone FROM users WHERE id = ?',
        [id]
    );
    
    const users = rows as any[];
    return users[0] || null;
};

export const updatePassword = async (userId: number, currentPassword: string, newPassword: string) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await pool.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, userId]
    );
    
    return { success: true, message: 'Password updated successfully' };
};