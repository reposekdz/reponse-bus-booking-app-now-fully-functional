import { io } from '../../server';
import { AppError } from '../../utils/AppError';
import logger from '../../utils/logger';
import { pool } from '../../config/db';
import config from '../../config';
import * as mysql from 'mysql2/promise';
import crypto from 'crypto';

export const initiateMomoPayment = async (userId: number, phone: string, bookingDetails: any) => {
    
    logger.info(`Initiating MoMo payment for user ${userId} to phone ${phone} for ${bookingDetails.totalPrice} RWF`);

    if (!phone || !phone.startsWith('07')) {
        throw new AppError('A valid Rwandan phone number is required for Mobile Money payments.', 400);
    }

    // 1. Generate a unique transaction ID for tracking
    const externalTransactionId = `MTN-${crypto.randomUUID()}`;
    
    // 2. Store the pending payment details in the database
    await pool.query(
        'INSERT INTO pending_payments (user_id, external_transaction_id, booking_payload) VALUES (?, ?, ?)',
        [userId, externalTransactionId, JSON.stringify(bookingDetails)]
    );

    // 3. --- MOCK MTN API INTERACTION ---
    // Simulate waiting for the user to enter their PIN on their phone by calling our own callback endpoint after a delay.
    setTimeout(() => {
        const isSuccessful = Math.random() > 0.1; // 90% success rate for demo
        const callbackPayload = {
            externalId: externalTransactionId,
            status: isSuccessful ? 'SUCCESSFUL' : 'FAILED',
        };

        // In production, MTN would call this endpoint. Here, we call it ourselves to simulate that.
        const callbackUrl = `http://localhost:${config.port}/api/v1/payments/momo/callback`;
        
        fetch(callbackUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(callbackPayload)
        }).catch(err => logger.error(`[SIMULATION] Mock callback to ${callbackUrl} failed:`, err));
        
    }, 8000); // 8-second delay to simulate user interaction

    return { message: 'Please check your phone to approve the payment.' };
};

export const handleMomoCallback = async (callbackData: { externalId: string, status: 'SUCCESSFUL' | 'FAILED' }) => {
    const { externalId, status } = callbackData;
    
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        // 1. Find the pending payment and lock the row to prevent race conditions
        const [pendingRows] = await connection.query<any[] & mysql.RowDataPacket[]>('SELECT * FROM pending_payments WHERE external_transaction_id = ? AND status = "PENDING" FOR UPDATE', [externalId]);
        
        if (pendingRows.length === 0) {
            logger.warn(`Received a callback for an unknown or already processed transaction: ${externalId}`);
            await connection.commit(); // Commit to release the lock, even if we do nothing
            return;
        }
        
        const pendingPayment = pendingRows[0];
        const userId = pendingPayment.user_id;
        const bookingDetails = pendingPayment.booking_payload;

        // 2. Update pending payment status
        const finalStatus = status === 'SUCCESSFUL' ? 'SUCCESSFUL' : 'FAILED';
        await connection.query('UPDATE pending_payments SET status = ? WHERE id = ?', [finalStatus, pendingPayment.id]);
        
        // 3. Emit socket event to notify the user on the frontend
        if (finalStatus === 'SUCCESSFUL') {
            logger.info(`Payment success for user ${userId} via callback for tx ${externalId}`);
            io.to(userId.toString()).emit('momoPaymentSuccess', {
                message: 'Payment was successful.',
                bookingDetails
            });
        } else {
            logger.warn(`Payment failed for user ${userId} via callback for tx ${externalId}`);
            io.to(userId.toString()).emit('momoPaymentFailed', {
                message: 'Payment was not approved or timed out.',
                bookingDetails
            });
        }
        
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        logger.error(`Error processing MoMo callback for ${externalId}:`, error);
    } finally {
        connection.release();
    }
};