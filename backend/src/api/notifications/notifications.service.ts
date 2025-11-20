
import { pool } from '../../config/db';
import logger from '../../utils/logger';
import config from '../../config';
import * as mysql from 'mysql2/promise';

// --- Mock External Providers (Simulate real APIs like SendGrid, Twilio) ---

const mockSendEmail = async (to: string, subject: string, html: string) => {
    logger.info(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
};

const mockSendSMS = async (to: string, body: string) => {
    logger.info(`[MOCK SMS] To: ${to} | Body: ${body}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
};

// --- Templates ---

const createEmailTemplate = (title: string, body: string, actionLink?: string, actionText?: string) => {
    return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0033A0; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">GoBus</h1>
            <p style="color: #93c5fd; margin: 5px 0 0; font-size: 14px;">Travel Simplified</p>
        </div>
        <div style="padding: 32px 24px;">
            <h2 style="color: #1a202c; font-size: 20px; margin-top: 0; margin-bottom: 16px;">${title}</h2>
            <div style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                ${body}
            </div>
            ${actionLink ? `
            <div style="text-align: center; margin-top: 32px; margin-bottom: 16px;">
                <a href="${actionLink}" style="background-color: #FBBF24; color: #0033A0; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block; font-size: 16px;">${actionText || 'View Details'}</a>
            </div>
            ` : ''}
        </div>
        <div style="background-color: #f7fafc; padding: 24px; text-align: center; color: #718096; font-size: 12px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 8px;">This is an automated message from GoBus Platform.</p>
            <p style="margin: 0;">Kigali, Rwanda &bull; support@gobus.rw</p>
        </div>
    </div>
    `;
};

// --- Main Service Methods ---

export const subscribe = async (userId: number, subscription: any) => {
    logger.info(`Subscription attempt for user ${userId} on platform ${subscription.platform}`);

    if (subscription.platform === 'web' && subscription.endpoint) {
        const { endpoint, keys } = subscription;
        await pool.query(
            'INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth, platform) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE p256dh = VALUES(p256dh), auth = VALUES(auth)',
            [userId, endpoint, keys.p256dh, keys.auth, 'web']
        );
    } else if (subscription.platform === 'mobile' && subscription.token) {
        await pool.query(
            'INSERT INTO push_subscriptions (user_id, endpoint, platform) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE user_id = VALUES(user_id)',
            [userId, subscription.token, 'mobile']
        );
    }
    logger.info(`User ${userId} subscribed for push notifications on ${subscription.platform}.`);
};


export interface NotificationPayload {
    title: string;
    body: string;
    data?: any;
    link?: string; // For email buttons
    btnText?: string; // For email buttons
}

/**
 * Dispatches a notification via the specified channel.
 * Automatically fetches user contact details from the DB.
 */
export const dispatchNotification = async (
    userId: number, 
    channel: 'email' | 'sms' | 'push', 
    payload: NotificationPayload
) => {
    try {
        // 1. Get recipient details
        const [rows] = await pool.query<any[] & mysql.RowDataPacket[]>('SELECT email, phone_number FROM users WHERE id = ?', [userId]);
        
        if (rows.length === 0) {
            logger.warn(`Cannot notify user ${userId}: User not found.`);
            return;
        }
        
        const user = rows[0];
        let status = 'Failed';
        let recipient = 'Unknown';

        // 2. Send via Channel
        if (channel === 'email' && user.email) {
            recipient = user.email;
            const html = createEmailTemplate(payload.title, payload.body, payload.link, payload.btnText);
            await mockSendEmail(user.email, payload.title, html);
            status = 'Sent';
        } 
        else if (channel === 'sms' && user.phone_number) {
            recipient = user.phone_number;
            // Strip HTML tags for SMS
            const plainTextBody = payload.body.replace(/<[^>]*>?/gm, ''); 
            const smsContent = `${payload.title}: ${plainTextBody}`;
            await mockSendSMS(user.phone_number, smsContent);
            status = 'Sent';
        }
        else if (channel === 'push') {
            recipient = 'Device';
            await sendPushNotification(userId, payload);
            status = 'Sent';
        }

        // 3. Log to Database
        if (status === 'Sent') {
            await pool.query(
                'INSERT INTO system_notifications (user_id, type, recipient, subject, content, status) VALUES (?, ?, ?, ?, ?, ?)',
                [userId, channel, recipient, payload.title, payload.body, status]
            );
        }

    } catch (error) {
        logger.error(`Error dispatching ${channel} notification to user ${userId}:`, error);
    }
};

// Internal Push Logic
const sendPushNotification = async (userId: number, payload: { title: string; body: string; data?: any }) => {
    const [subscriptions] = await pool.query('SELECT * FROM push_subscriptions WHERE user_id = ?', [userId]);

    if (!subscriptions || (subscriptions as any[]).length === 0) return;

    // In a real app, utilize 'web-push' or 'expo-server-sdk' here to actually send.
    for (const sub of (subscriptions as any[])) {
        if (sub.platform === 'web') {
            logger.info(`[MOCK WEB PUSH] To User ${userId}: ${payload.title}`);
        } else if (sub.platform === 'mobile') {
            logger.info(`[MOCK MOBILE PUSH] To User ${userId}: ${payload.title}`);
        }
    }
};

export const sendNotification = sendPushNotification; // Backward compatibility alias
