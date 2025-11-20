
import { io } from '../../server';
import { AppError } from '../../utils/AppError';
import logger from '../../utils/logger';
import { pool } from '../../config/db';
import config from '../../config';
import * as mysql from 'mysql2/promise';
import crypto from 'crypto';
import { Buffer } from 'buffer';

// Helper to get MTN Access Token
const getMomoToken = async () => {
    const { subscriptionKey, apiUserId, apiKey } = config.mtn.collection;
    
    if (!subscriptionKey || !apiUserId || !apiKey) {
        logger.warn("MTN Collection credentials missing in config. Using mock mode.");
        return null;
    }

    const authString = Buffer.from(`${apiUserId}:${apiKey}`).toString('base64');
    
    try {
        const response = await fetch(`${config.mtn.baseUrl}/collection/token/`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authString}`,
                'Ocp-Apim-Subscription-Key': subscriptionKey,
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to get token: ${response.statusText}`);
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        logger.error("MTN Token Generation Error:", error);
        return null;
    }
};

export const initiateMomoPayment = async (userId: number, phone: string, bookingDetails: any) => {
    
    logger.info(`Initiating MoMo payment for user ${userId} to phone ${phone} for ${bookingDetails.totalPrice} RWF`);

    // Standardize phone format for MTN (460...) or keep local format 
    // Note: Sandbox typically accepts specific numbers defined in docs
    if (!phone) {
        throw new AppError('A valid phone number is required.', 400);
    }

    // 1. Generate a unique transaction ID for tracking (UUID v4)
    const externalTransactionId = crypto.randomUUID();
    
    // 2. Store the pending payment
    await pool.query(
        'INSERT INTO pending_payments (user_id, external_transaction_id, booking_payload) VALUES (?, ?, ?)',
        [userId, externalTransactionId, JSON.stringify(bookingDetails)]
    );

    // 3. Interact with Real MTN API
    const accessToken = await getMomoToken();

    if (accessToken) {
        try {
            const response = await fetch(`${config.mtn.baseUrl}/collection/v1_0/requesttopay`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'X-Reference-Id': externalTransactionId,
                    'X-Target-Environment': config.mtn.environment,
                    'Ocp-Apim-Subscription-Key': config.mtn.collection.subscriptionKey!,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: bookingDetails.totalPrice.toString(),
                    currency: "RWF",
                    externalId: bookingDetails.tripId.toString(),
                    payer: {
                        partyIdType: "MSISDN",
                        partyId: phone
                    },
                    payerMessage: `Payment for GoBus Trip`,
                    payeeNote: "GoBus Booking"
                })
            });

            if (response.status === 202) {
                return { message: 'Payment request sent to your phone. Please approve.' };
            } else {
                // If API fails, throw generic error but log specific
                const errData = await response.json();
                logger.error("MTN API Error:", errData);
                throw new AppError('Failed to initiate payment with provider.', 500);
            }

        } catch (error) {
            logger.error("MTN Request Exception:", error);
            throw new AppError('Payment provider unavailable.', 503);
        }
    } else {
        // Fallback to Simulation if keys aren't set (for dev/testing without keys)
        setTimeout(() => {
            const isSuccessful = true; 
            const callbackUrl = `http://localhost:${config.port}/api/v1/payments/momo/callback`;
            fetch(callbackUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    externalId: externalTransactionId,
                    status: isSuccessful ? 'SUCCESSFUL' : 'FAILED',
                })
            }).catch(err => logger.error(`[SIMULATION] Mock callback failed:`, err));
        }, 5000);
        
        return { message: 'Simulated payment request sent. Please wait...' };
    }
};

export const handleMomoCallback = async (callbackData: { externalId: string, status: 'SUCCESSFUL' | 'FAILED' }) => {
    // NOTE: In production, the externalId usually comes in the body or route depending on callback config. 
    // We assume the body contains { externalId, status } for this implementation.
    
    const { externalId, status } = callbackData;
    
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        const [pendingRows] = await connection.query<any[] & mysql.RowDataPacket[]>('SELECT * FROM pending_payments WHERE external_transaction_id = ? AND status = "PENDING" FOR UPDATE', [externalId]);
        
        if (pendingRows.length === 0) {
            await connection.commit();
            return;
        }
        
        const pendingPayment = pendingRows[0];
        const userId = pendingPayment.user_id;
        const bookingDetails = pendingPayment.booking_payload;

        const finalStatus = status === 'SUCCESSFUL' ? 'SUCCESSFUL' : 'FAILED';
        await connection.query('UPDATE pending_payments SET status = ? WHERE id = ?', [finalStatus, pendingPayment.id]);
        
        if (finalStatus === 'SUCCESSFUL') {
            logger.info(`Payment success for user ${userId}`);
            io.to(userId.toString()).emit('momoPaymentSuccess', {
                message: 'Payment was successful.',
                bookingDetails
            });
        } else {
            logger.warn(`Payment failed for user ${userId}`);
            io.to(userId.toString()).emit('momoPaymentFailed', {
                message: 'Payment was declined or timed out.',
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
