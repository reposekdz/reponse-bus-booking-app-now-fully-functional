
import { io } from '../../server';
import { AppError } from '../../utils/AppError';
import logger from '../../utils/logger';
import { pool } from '../../config/db';
import config from '../../config';
import * as mysql from 'mysql2/promise';
import crypto from 'crypto';
import { Buffer } from 'buffer';

// Types for MTN Responses
interface TokenResponse { access_token: string; expires_in: number; }

const getMomoToken = async (type: 'collection' | 'disbursement' | 'remittance') => {
    const conf = config.mtn[type];
    
    if (!conf.subscriptionKey) {
        logger.warn(`MTN ${type} configuration missing. Using mock token for dev.`);
        if (process.env.NODE_ENV === 'development') return 'mock_token_sandbox';
        throw new AppError(`MTN ${type} configuration missing.`, 500);
    }

    // In Sandbox, you use the API User ID and API Key generated via provisioning
    const authString = Buffer.from(`${conf.apiUserId}:${conf.apiKey}`).toString('base64');

    try {
        const response = await fetch(`${config.mtn.baseUrl}/${type}/token/`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authString}`,
                'Ocp-Apim-Subscription-Key': conf.subscriptionKey,
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            logger.error(`MTN Token Error (${type}):`, errorText);
            throw new Error(`MTN Token Failed: ${response.statusText}`);
        }
        const data = (await response.json()) as TokenResponse;
        return data.access_token;
    } catch (error) {
        logger.error(`MTN Token Error (${type}):`, error);
        if (process.env.NODE_ENV === 'development') return 'mock_token_sandbox';
        throw new AppError("Payment provider unavailable.", 503);
    }
};

// 1. COLLECTIONS: Request To Pay (Passenger paying for ticket)
export const initiateMomoPayment = async (userId: number, phone: string, bookingDetails: any) => {
    const externalId = crypto.randomUUID();
    let token;
    
    try {
        token = await getMomoToken('collection');
    } catch(e) {
         // Simulate successful initiation in dev mode if token fails
        if(process.env.NODE_ENV === 'development') {
             setTimeout(() => {
                io.emit('momoPaymentSuccess', { bookingDetails, externalId, message: 'Dev Mode Payment Success' });
             }, 3000);
             return { message: 'Dev Mode: Payment Simulated' };
        }
        throw e;
    }

    await pool.query(
        'INSERT INTO pending_payments (user_id, external_transaction_id, booking_payload) VALUES (?, ?, ?)',
        [userId, externalId, JSON.stringify(bookingDetails)]
    );

    // If using mock token in dev, skip real fetch
    if (token === 'mock_token_sandbox') {
        setTimeout(() => {
             io.emit('momoPaymentSuccess', { bookingDetails, externalId, message: 'Dev Mode Payment Success' });
        }, 3000);
        return { message: 'Dev Mode: Payment Simulated' };
    }

    try {
        const response = await fetch(`${config.mtn.baseUrl}/collection/v1_0/requesttopay`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-Reference-Id': externalId,
                'X-Target-Environment': config.mtn.environment,
                'Ocp-Apim-Subscription-Key': config.mtn.collection.subscriptionKey!,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: bookingDetails.totalPrice.toString(),
                currency: config.mtn.currency,
                externalId: bookingDetails.tripId.toString(),
                payer: { partyIdType: "MSISDN", partyId: phone },
                payerMessage: "GoBus Ticket",
                payeeNote: "GoBus Booking"
            })
        });

        if (response.status !== 202) {
            const errText = await response.text();
            throw new Error(`Failed to initiate payment: ${errText}`);
        }

        return { message: 'Payment request sent. Check your phone.' };
    } catch (error) {
        logger.error("Collection Error:", error);
        throw new AppError('Payment initiation failed.', 500);
    }
};

// 2. DISBURSEMENTS: Deposit/Refund (Sending money to user)
export const processRefund = async (userId: number, amount: number, phone: string, reason: string) => {
    const externalId = crypto.randomUUID();
    let token;
    try {
        token = await getMomoToken('disbursement');
    } catch (e) {
        if(process.env.NODE_ENV === 'development') return true;
        throw e;
    }

    // Dev mode skip
    if (token === 'mock_token_sandbox') return true;

    try {
        const response = await fetch(`${config.mtn.baseUrl}/disbursement/v1_0/deposit`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-Reference-Id': externalId,
                'X-Target-Environment': config.mtn.environment,
                'Ocp-Apim-Subscription-Key': config.mtn.disbursement.subscriptionKey!,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amount.toString(),
                currency: config.mtn.currency,
                externalId: `REFUND-${Date.now()}`,
                payee: { partyIdType: "MSISDN", partyId: phone },
                payerMessage: reason,
                payeeNote: "GoBus Payout"
            })
        });

        if (response.status !== 202) {
            const errText = await response.text();
             throw new Error(`Refund initiation failed: ${errText}`);
        }
        return true;
    } catch (error) {
        logger.error("Disbursement Error:", error);
        throw new AppError('Refund failed.', 500);
    }
};

// 3. REMITTANCE: Transfer (Agent to Admin, etc, if cross-border or specific use case)
export const transferFundsExternal = async (amount: number, phone: string) => {
    const externalId = crypto.randomUUID();
    let token;
    try {
         token = await getMomoToken('remittance');
    } catch (e) {
        if(process.env.NODE_ENV === 'development') return true;
        throw e;
    }
    
    if (token === 'mock_token_sandbox') return true;

    const response = await fetch(`${config.mtn.baseUrl}/remittance/v1_0/transfer`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'X-Reference-Id': externalId,
            'X-Target-Environment': config.mtn.environment,
            'Ocp-Apim-Subscription-Key': config.mtn.remittance.subscriptionKey!,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount: amount.toString(),
            currency: config.mtn.currency,
            externalId: `TX-${Date.now()}`,
            payee: { partyIdType: "MSISDN", partyId: phone },
            payerMessage: "GoBus Transfer",
            payeeNote: "Business Transfer"
        })
    });
    return response.status === 202;
};

export const handleMomoCallback = async (callbackData: any) => {
    logger.info("Received MoMo Callback", callbackData);
    
    const { externalId, status } = callbackData;
    
    const [rows] = await pool.query<any[] & mysql.RowDataPacket[]>('SELECT * FROM pending_payments WHERE external_transaction_id = ?', [externalId]);
    if (rows.length === 0) return;

    const pendingPayment = rows[0];
    const bookingDetails = JSON.parse(pendingPayment.booking_payload);

    if (status === 'SUCCESSFUL') {
        await pool.query('UPDATE pending_payments SET status = "SUCCESSFUL" WHERE id = ?', [pendingPayment.id]);
        
        // Broadcast to client via Socket.IO
        io.emit('momoPaymentSuccess', {
            bookingDetails,
            externalId,
            message: 'Payment successful'
        });
    } else if (status === 'FAILED') {
        await pool.query('UPDATE pending_payments SET status = "FAILED" WHERE id = ?', [pendingPayment.id]);
         io.emit('momoPaymentFailed', {
            bookingDetails,
            externalId,
            message: 'Payment failed or rejected'
        });
    }
};
