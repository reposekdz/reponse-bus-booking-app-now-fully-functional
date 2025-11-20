
import { pool } from '../../config/db';
import { AppError } from '../../utils/AppError';
import * as mysql from 'mysql2/promise';
import { dispatchNotification } from '../notifications/notifications.service';

export const findPassengerBySerial = async (serialCode: string) => {
    const [rows] = await pool.query<any[] & mysql.RowDataPacket[]>('SELECT name, phone_number, location FROM users WHERE serial_code = ? AND role = "passenger"', [serialCode]);
    if (rows.length === 0) {
        throw new AppError('Passenger with this serial code not found.', 404);
    }
    return rows[0];
};

export const makeDepositForPassenger = async (agentId: number, passengerSerial: string, amount: number) => {
    if (amount <= 0) throw new AppError('Invalid amount.', 400);
    
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        // Lock rows for update to prevent race conditions
        const [passengers] = await connection.query<any[] & mysql.RowDataPacket[]>('SELECT id FROM users WHERE serial_code = ? FOR UPDATE', [passengerSerial]);
        if (passengers.length === 0) throw new AppError('Passenger not found.', 404);
        const passengerId = passengers[0].id;
        
        const [agentRows] = await connection.query<any[] & mysql.RowDataPacket[]>('SELECT id, (SELECT id FROM wallets WHERE user_id = ?) as wallet_id FROM users WHERE id = ?', [agentId, agentId]);
        const agentWalletId = agentRows[0].wallet_id;
        
        // Get Admin Wallet ID
        const [adminRows] = await connection.query<any[] & mysql.RowDataPacket[]>('SELECT id FROM wallets WHERE user_id = (SELECT id FROM users WHERE role = "admin" LIMIT 1)');
        const adminWalletId = adminRows.length > 0 ? adminRows[0].id : null;
        
        const [pWalletRows] = await connection.query<any[] & mysql.RowDataPacket[]>('SELECT id FROM wallets WHERE user_id = ?', [passengerId]);
        const passengerWalletId = pWalletRows[0].id;

        // FINANCIAL LOGIC
        // Agent Commission: 1.2%
        // Admin Fee: 1.9%
        
        const agentRate = 0.012; 
        const adminRate = 0.019;
        
        const commissionAmount = Number((amount * agentRate).toFixed(2));
        const adminFeeAmount = Number((amount * adminRate).toFixed(2));

        // 1. Credit Passenger (Full Amount)
        await connection.query('UPDATE wallets SET balance = balance + ? WHERE id = ?', [amount, passengerWalletId]);
        await connection.query('INSERT INTO wallet_transactions (wallet_id, amount, type, description) VALUES (?, ?, ?, ?)', 
            [passengerWalletId, amount, 'deposit', `Deposit via Agent #${agentId}`]);

        // 2. Credit Agent Commission
        if (agentWalletId) {
            await connection.query('UPDATE wallets SET balance = balance + ? WHERE id = ?', [commissionAmount, agentWalletId]);
            await connection.query('INSERT INTO wallet_transactions (wallet_id, amount, type, description) VALUES (?, ?, ?, ?)', 
                [agentWalletId, commissionAmount, 'commission', `1.2% Comm. for deposit ${passengerSerial}`]);
        }

        // 3. Credit Admin Fee
        if (adminWalletId) {
            await connection.query('UPDATE wallets SET balance = balance + ? WHERE id = ?', [adminFeeAmount, adminWalletId]);
            await connection.query('INSERT INTO wallet_transactions (wallet_id, amount, type, description) VALUES (?, ?, ?, ?)', 
                [adminWalletId, adminFeeAmount, 'fee', `1.9% Fee for agent deposit`]);
        }
        
        await connection.commit();
        
        dispatchNotification(passengerId, 'sms', {
            title: 'Deposit Received',
            body: `Received ${new Intl.NumberFormat('fr-RW').format(amount)} RWF. Balance updated.`
        });
        
        return { success: true, amount, commission: commissionAmount };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const getTransactionHistory = async (agentId: number) => {
    const [rows] = await pool.query(`
        SELECT wt.*, u.name as passengerName, u.serial_code as passengerSerial,
        CASE 
            WHEN wt.type = 'commission' THEN wt.amount
            ELSE 0 
        END as commission
        FROM wallet_transactions wt
        JOIN wallets w ON wt.wallet_id = w.id
        LEFT JOIN users u ON w.user_id = u.id 
        WHERE w.user_id = ? OR wt.description LIKE CONCAT('%Agent #', ?, '%')
        ORDER BY wt.created_at DESC
    `, [agentId, agentId]);
    return rows;
};

export const getDashboardData = async (agentId: number) => {
   const [rows] = await pool.query('SELECT SUM(amount) as totalCommission FROM wallet_transactions WHERE wallet_id = (SELECT id FROM wallets WHERE user_id = ?) AND type = "commission"', [agentId]);
   const [txnRows] = await pool.query('SELECT COUNT(*) as count FROM wallet_transactions WHERE description LIKE CONCAT("%Agent #", ?, "%") AND type = "deposit"', [agentId]);
   
   // Calculate total deposits made
   const [depositRows] = await pool.query(`
       SELECT SUM(amount) as totalDeposits 
       FROM wallet_transactions 
       WHERE type = 'deposit' AND description LIKE CONCAT('%Agent #', ?, '%')
   `, [agentId]);

   return {
       totalCommission: (rows as any)[0].totalCommission || 0,
       transactions: (txnRows as any)[0].count || 0,
       totalDeposits: (depositRows as any)[0].totalDeposits || 0,
       uniquePassengers: 0 // Simplified for now
   };
};
