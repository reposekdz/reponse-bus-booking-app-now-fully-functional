import { pool } from '../../config/db';
import { AppError } from '../../utils/AppError';
import * as mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { User } from '../../types';
import { io } from '../../server';


export const topUpUserWallet = async (userId: number, amount: number) => {
    if (!amount || amount <= 0) {
        throw new AppError('Please provide a valid amount to top up.', 400);
    }
    
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        const [walletRows] = await connection.query<any[] & mysql.RowDataPacket[]>('SELECT id, balance FROM wallets WHERE user_id = ?', [userId]);
        let walletId;
        let newBalance;

        if (walletRows.length > 0) {
            walletId = walletRows[0].id;
            await connection.query('UPDATE wallets SET balance = balance + ? WHERE id = ?', [amount, walletId]);
            newBalance = parseFloat(walletRows[0].balance) + amount;
        } else {
            const [result] = await connection.query<mysql.ResultSetHeader>('INSERT INTO wallets (user_id, balance) VALUES (?, ?)', [userId, amount]);
            walletId = result.insertId;
            newBalance = amount;
        }

        await connection.query(
            'INSERT INTO wallet_transactions (wallet_id, amount, type, description) VALUES (?, ?, ?, ?)',
            [walletId, amount, 'deposit', 'User-initiated wallet top-up']
        );
        
        await connection.commit();
        
        // Return only the updated balance with consistent snake_case
        return { wallet_balance: newBalance };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const getUserWalletHistory = async (userId: number) => {
    const [rows] = await pool.query(`
        SELECT wt.id, wt.amount, wt.type, wt.description, wt.created_at as createdAt
        FROM wallet_transactions wt
        JOIN wallets w ON wt.wallet_id = w.id
        WHERE w.user_id = ?
        ORDER BY wt.created_at DESC
    `, [userId]);
    return rows;
};

export const setUserPin = async (userId: number, pin: string) => {
    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        throw new AppError('PIN must be a 4-digit number.', 400);
    }

    const pin_hash = await bcrypt.hash(pin, 10);
    await pool.query('UPDATE users SET pin = ? WHERE id = ?', [pin_hash, userId]);
};

export const verifyPin = async (userId: number, pin: string) => {
    if (!pin) throw new AppError('PIN is required.', 400);
    
    const [rows] = await pool.query<any[] & mysql.RowDataPacket[]>('SELECT pin FROM users WHERE id = ?', [userId]);
    if (rows.length === 0 || !rows[0].pin) throw new AppError('User not found or no PIN set.', 404);

    const isMatch = await bcrypt.compare(pin, rows[0].pin);
    if (!isMatch) throw new AppError('Invalid PIN.', 401);

    return true;
};

export const transferFunds = async (sender: User, toSerial: string, amount: number, pin: string) => {
    // 1. Validate inputs
    if (!toSerial || !amount || amount <= 0) {
        throw new AppError('Invalid recipient or amount.', 400);
    }
    await verifyPin(sender.id, pin);

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        // 2. Get recipient
        const [receiverRows] = await connection.query<any[] & mysql.RowDataPacket[]>('SELECT id FROM users WHERE serial_code = ? AND id != ?', [toSerial, sender.id]);
        if (receiverRows.length === 0) throw new AppError('Recipient not found.', 404);
        const receiverId = receiverRows[0].id;

        // 3. Lock wallets to prevent race conditions
        const [senderWalletRows] = await connection.query<any[] & mysql.RowDataPacket[]>('SELECT id, balance FROM wallets WHERE user_id = ? FOR UPDATE', [sender.id]);
        const [receiverWalletRows] = await connection.query<any[] & mysql.RowDataPacket[]>('SELECT id FROM wallets WHERE user_id = ? FOR UPDATE', [receiverId]);

        if (senderWalletRows.length === 0) throw new AppError('Sender wallet not found.', 404);
        if (receiverWalletRows.length === 0) throw new AppError('Recipient wallet not found.', 404);
        
        const senderWallet = senderWalletRows[0];
        const receiverWalletId = receiverWalletRows[0].id;

        // 4. Check balance
        if (parseFloat(senderWallet.balance) < amount) {
            throw new AppError('Insufficient funds.', 400);
        }
        
        // 5. Perform transfers
        await connection.query('UPDATE wallets SET balance = balance - ? WHERE id = ?', [amount, senderWallet.id]);
        await connection.query('UPDATE wallets SET balance = balance + ? WHERE id = ?', [amount, receiverWalletId]);

        // 6. Log transactions
        await connection.query('INSERT INTO wallet_transactions (wallet_id, amount, type, description) VALUES (?, ?, ?, ?)', [senderWallet.id, -amount, 'transfer_out', `Sent to ${toSerial}`]);
        await connection.query('INSERT INTO wallet_transactions (wallet_id, amount, type, description) VALUES (?, ?, ?, ?)', [receiverWalletId, amount, 'transfer_in', `Received from ${sender.name}`]);

        await connection.commit();

        // 7. Notify recipient in real-time
        io.to(receiverId.toString()).emit('walletCredit', {
            amount,
            senderName: sender.name
        });
        
        const newBalance = parseFloat(senderWallet.balance) - amount;
        return { new_sender_balance: newBalance };
        
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};