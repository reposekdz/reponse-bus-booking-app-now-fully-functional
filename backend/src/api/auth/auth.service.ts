
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../../config';
import { pool } from '../../config/db';
import { AppError } from '../../utils/AppError';
import { User } from '../../types';
import * as mysql from 'mysql2/promise';
import { dispatchNotification } from '../notifications/notifications.service';

const generateToken = (user: { id: number, company_id?: number, role: string }) => {
    return jwt.sign({ id: user.id, companyId: user.company_id, role: user.role }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    } as SignOptions);
};

export const registerUser = async (userData: any) => {
    const { name, email, password, phone } = userData;
    
    if(!email && !phone){
        throw new AppError('Email or Phone number is required', 400);
    }
    
    if (!password || password.length < 8) {
        throw new AppError('Password must be at least 8 characters long', 400);
    }

    // Check duplicates
    if(email){
        const [existingUsers] = await pool.query<User[] & mysql.RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) throw new AppError('User with this email already exists', 400);
    }

    if(phone){
        const [existingUsers] = await pool.query<User[] & mysql.RowDataPacket[]>('SELECT id FROM users WHERE phone_number = ?', [phone]);
        if (existingUsers.length > 0) throw new AppError('User with this phone number already exists', 400);
    }
    
    const password_hash = await bcrypt.hash(password, 10);
    const serial_code = `${name.substring(0, 3).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;

    const [result] = await pool.query<mysql.ResultSetHeader>(
        'INSERT INTO users (name, email, password_hash, phone_number, role, serial_code) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, password_hash, phone, 'passenger', serial_code]
    );

    const userId = result.insertId;
    await pool.query('INSERT INTO wallets (user_id, balance) VALUES (?, 0)', [userId]);

    const [rows] = await pool.query<User[] & mysql.RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [userId]);
    const user = rows[0];
    delete user.password_hash;
    
    // Welcome Notification
    await dispatchNotification(userId, 'email', {
        title: 'Welcome to GoBus! 🎉',
        body: `Hi ${name},<br>Thank you for joining GoBus. Your account is ready.<br>Your unique deposit Serial Code is <b>${serial_code}</b>. Use this at any agent to load your wallet.`
    });
    
    const token = generateToken(user);
    return { user, token };
};

export const loginUser = async (loginData: any) => {
    const { email: emailOrPhone, password } = loginData;

    if (!emailOrPhone || !password) {
        throw new AppError('Please provide login credentials', 400);
    }
    
    const isEmail = emailOrPhone.includes('@');
    const queryField = isEmail ? 'email' : 'phone_number';

    const [rows] = await pool.query<User[] & mysql.RowDataPacket[]>(`SELECT * FROM users WHERE ${queryField} = ?`, [emailOrPhone]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash!))) {
        throw new AppError('Invalid credentials', 401);
    }

    if (user.role === 'passenger') {
        const [walletRows] = await pool.query<any[] & mysql.RowDataPacket[]>('SELECT balance FROM wallets WHERE user_id = ?', [user.id]);
        if (walletRows.length > 0) {
            user.wallet_balance = parseFloat(walletRows[0].balance);
        }
    }

    const token = generateToken(user);
    delete user.password_hash;
    
    return { user, token };
};

export const updatePassword = async (userId: number, currentPassword, newPassword) => {
    if (!currentPassword || !newPassword) throw new AppError('Please provide current and new passwords', 400);
    if (newPassword.length < 8) throw new AppError('New password must be at least 8 characters long', 400);

    const [rows] = await pool.query<User[] & mysql.RowDataPacket[]>('SELECT password_hash FROM users WHERE id = ?', [userId]);
    const user = rows[0];
    if (!user) throw new AppError('User not found', 404);

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash!);
    if (!isMatch) throw new AppError('Incorrect current password', 401);

    const new_password_hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [new_password_hash, userId]);
    
    await dispatchNotification(userId, 'email', {
        title: 'Security Alert: Password Changed',
        body: 'Your GoBus account password was recently changed. If you did not authorize this change, please contact support immediately.'
    });
};

export const forgotPassword = async (email: string) => {
    const [rows] = await pool.query<User[] & mysql.RowDataPacket[]>('SELECT id, name FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
        throw new AppError('There is no user with that email address.', 404);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    await pool.query('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?', [resetTokenHash, resetExpires, user.id]);

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await dispatchNotification(user.id, 'email', {
        title: 'Password Reset Request',
        body: `You requested a password reset. Please click the button below to reset your password. This link is valid for 10 minutes.`,
        link: resetUrl,
        btnText: 'Reset My Password'
    });

    return resetToken; // Returned for dev/testing
};

export const resetPassword = async (token: string, newPassword: string) => {
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const [rows] = await pool.query<User[] & mysql.RowDataPacket[]>(
        'SELECT id, name, email FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
        [resetTokenHash]
    );

    const user = rows[0];
    if (!user) {
        throw new AppError('Token is invalid or has expired', 400);
    }

    const password_hash = await bcrypt.hash(newPassword, 10);
    await pool.query(
        'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
        [password_hash, user.id]
    );

    await dispatchNotification(user.id, 'email', {
        title: 'Password Reset Successful',
        body: `Hi ${user.name}, your password has been successfully reset. You can now log in with your new password.`
    });
};
