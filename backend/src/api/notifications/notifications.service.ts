
import { pool } from '../../config/db';
import logger from '../../utils/logger';
import config from '../../config';
import * as mysql from 'mysql2/promise';

// In a real app, use 'nodemailer' or 'sendgrid'
const mockSendEmail = async (to: string, subject: string, html: string) => {
    logger.info(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
    // Simulate SMTP delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
};

// In a real app, use 'twilio' or local SMS gateway
const mockSendSMS = async (to: string, body: string) => {
    logger.info(`[SMS MOCK] To: ${to} | Body: ${body}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
};

// Helper to create stylized email template
const createEmailTemplate = (title: string, body: string, actionLink?: string, actionText?: string) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <div style="background: linear-gradient(to right, #0033A0, #00574B); padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">GoBus</h1>
        </div>
        <div style="padding: 20px;">
            <h2 style="color: #333;">${title}</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.5;">${body}</p>
            ${actionLink ? `
            <div style="text-align: center; margin-top: 30px;">
                <a href="${actionLink}" style="background-color: #FBBF24; color: #0033A0; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">${actionText || 'Click Here'}</a>
            </div>
            ` : ''}
        </div>
        <div style="padding: 15px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
            &copy; ${new Date().getFullYear()} GoBus Rwanda. All rights reserved.
        </div>
    </div>
    `;
};

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

// Unified Notification Dispatcher
export const dispatchNotification = async (userId: number, type: 'email' | 'sms' | 'push', payload: { title: string; body: string; data?: any; link?: string; btnText?: string }) => {
    try {
        // 1. Fetch User Contact Info
        const [rows] = await pool.query<any[] & mysql.RowDataPacket[]>('SELECT email, phone_number, name FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) return;
        const user = rows[0];

        // 2. Dispatch based on type
        if (type === 'email' && user.email) {
            const html = createEmailTemplate(payload.title, payload.body, payload.link, payload.btnText);
            await mockSendEmail(user.email, payload.title, html);
            // Log to DB
            await pool.query('INSERT INTO system_notifications (user_id, type, recipient, subject, content) VALUES (?, ?, ?, ?, ?)', 
                [userId, 'email', user.email, payload.title, payload.body]);
        } 
        
        if (type === 'sms' && user.phone_number) {
            const smsBody = `${payload.title}: ${payload.body}`;
            await mockSendSMS(user.phone_number, smsBody);
            // Log to DB
            await pool.query('INSERT INTO system_notifications (user_id, type, recipient, subject, content) VALUES (?, ?, ?, ?, ?)', 
                [userId, 'sms', user.phone_number, 'SMS Notification', smsBody]);
        }

        if (type === 'push') {
            await sendPushNotification(userId, payload);
        }

    } catch (error) {
        logger.error(`Failed to dispatch notification to user ${userId}:`, error);
    }
};

// Existing Push Logic
const sendPushNotification = async (userId: number, payload: { title: string; body: string; data?: any }) => {
    const [subscriptions] = await pool.query('SELECT * FROM push_subscriptions WHERE user_id = ?', [userId]);

    if (!subscriptions || (subscriptions as any[]).length === 0) return;

    for (const sub of (subscriptions as any[])) {
        if (sub.platform === 'web' && config.vapid.publicKey) {
            logger.info(`[MOCK WEB PUSH] Sending to endpoint for user ${userId}.`);
        } else if (sub.platform === 'mobile') {
            logger.info(`[MOCK EXPO PUSH] Sending to token for user ${userId}.`);
        }
    }
};

// Public alias for backward compatibility
export const sendNotification = sendPushNotification;
