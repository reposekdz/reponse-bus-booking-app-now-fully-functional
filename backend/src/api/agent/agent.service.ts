
import { pool } from '../../config/db';
import { AppError } from '../../utils/AppError';
import * as mysql from 'mysql2/promise';
import { dispatchNotification } from '../notifications/notifications.service';

export const findPassengerBySerial = async (serialCode: string) => {
    const [rows] = await pool.query<any[] & mysql.RowDataPacket[]>('SELECT name, phone_number, location FROM users WHERE serial_code = ? AND role = "passenger"', [serialCode]);
    if (rows.length === 0) {
        throw new AppError('Passenger with this serial code not found.', 404);
    }
    const passenger = rows[0];
    return {
        name: passenger.name,
        phone: passenger.phone_number,
        location: passenger.location || 'N/A'
    };
};

export const makeDepositForPassenger = async (agentId: number, passengerSerial: string, amount: number) => {
    if (!passengerSerial || !amount || amount <= 0) {
        throw new AppError('Invalid passenger serial or amount provided.', 400);
    }
    
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        // Get Passenger
        const [passengers] = await connection.query<any[] & mysql.RowDataPacket[]>('SELECT id FROM users WHERE serial_code = ? FOR UPDATE', [passengerSerial]);
        if (passengers.length === 0) throw new AppError('Passenger not found.', 404);
        const passengerId = passengers[0].id;
        
        // Get Agent
        const [agentRows] = await connection.query<any[] & mysql.RowDataPacket[]>('SELECT id, (SELECT id FROM wallets WHERE user_id = ?) as wallet_id FROM users WHERE id = ?', [agentId, agentId]);
        if (agentRows.length === 0) throw new AppError('Agent not found.', 404);
        const agentWalletId = agentRows[0].wallet_id;
        
        // Get Admin Wallet (Assuming user_id 1 or specifically role='admin')
        const [adminRows] = await connection.query<any[] & mysql.RowDataPacket[]>('SELECT id FROM wallets WHERE user_id = (SELECT id FROM users WHERE role = "admin" LIMIT 1)');
        const adminWalletId = adminRows.length > 0 ? adminRows[0].id : null;
        
        const [passengerWalletRows] = await connection.query<any[] & mysql.RowDataPacket[]>('SELECT id FROM wallets WHERE user_id = ?', [passengerId]);
        if (passengerWalletRows.length === 0) throw new AppError('Passenger wallet not found.', 404);
        const passengerWalletId = passengerWalletRows[0].id;

        // --- Financial Logic ---
        // Agent receives 1.2% commission
        // Admin receives 1.9% fee
        const commissionRate = 0.012;
        const adminFeeRate = 0.019;
        
        const commissionAmount = amount * commissionRate;
        const adminFeeAmount = amount * adminFeeRate;

        // 1. Credit Passenger Wallet (Full amount deposited)
        await connection.query('UPDATE wallets SET balance = balance + ? WHERE id = ?', [amount, passengerWalletId]);
        await connection.query('INSERT INTO wallet_transactions (wallet_id, amount, type, description) VALUES (?, ?, ?, ?)', 
            [passengerWalletId, amount, 'deposit', `Deposit via Agent #${agentId}`]);

        // 2. Credit Agent Commission
        if (agentWalletId) {
            await connection.query('UPDATE wallets SET balance = balance + ? WHERE id = ?', [commissionAmount, agentWalletId]);
            await connection.query('INSERT INTO wallet_transactions (wallet_id, amount, type, description) VALUES (?, ?, ?, ?)', 
                [agentWalletId, commissionAmount, 'commission', `Commission for deposit to ${passengerSerial}`]);
        }

        // 3. Credit Admin Fee
        if (adminWalletId) {
            await connection.query('UPDATE wallets SET balance = balance + ? WHERE id = ?', [adminFeeAmount, adminWalletId]);
            await connection.query('INSERT INTO wallet_transactions (wallet_id, amount, type, description) VALUES (?, ?, ?, ?)', 
                [adminWalletId, adminFeeAmount, 'fee', `Platform fee for agent deposit`]);
        }
        
        await connection.commit();
        
        // Notify Passenger
        dispatchNotification(passengerId, 'sms', {
            title: 'Deposit Received',
            body: `You have received ${new Intl.NumberFormat('fr-RW').format(amount)} RWF from Agent. Your new balance is updated.`
        });
        
        return { success: true, depositedAmount: amount, commission: commissionAmount };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const getTransactionHistory = async (agentId: number) => {
    const [rows] = await pool.query(`
        SELECT wt.id, wt.amount, wt.type, wt.description, wt.created_at
        FROM wallet_transactions wt
        JOIN wallets w ON wt.wallet_id = w.id
        WHERE w.user_id = ? AND wt.type = 'commission'
        ORDER BY wt.created_at DESC
    `, [agentId]);
    return rows;
};

export const getDashboardData = async (agentId: number) => {
    // In a real app, you'd likely specify a date range (e.g., this month)
    const [[{ totalCommission, transactions }]] = await pool.query<any[] & mysql.RowDataPacket[]>(`
        SELECT 
            SUM(amount) as totalCommission,
            COUNT(id) as transactions
        FROM wallet_transactions 
        WHERE wallet_id = (SELECT id FROM wallets WHERE user_id = ?) AND type = 'commission'
    `, [agentId]);
    
    // Approximate total volume handled based on 1.2% commission
    const totalDeposits = (totalCommission || 0) / 0.012; 
    const uniquePassengers = transactions; 

    return {
        totalDeposits: totalDeposits || 0,
        totalCommission: totalCommission || 0,
        transactions: transactions || 0,
        uniquePassengers: uniquePassengers || 0
    };
};
