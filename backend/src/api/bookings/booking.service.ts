
import { pool } from '../../config/db';
import { AppError } from '../../utils/AppError';
import * as mysql from 'mysql2/promise';
import { io } from '../../server';
import * as notificationService from '../notifications/notifications.service';

// ... (createBooking and getBookingsForUser implementations) ...

export const updateBookingStatus = async (bookingId: string, newStatus: string, currentUser: any) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        const [bookingRows] = await connection.query<any[] & mysql.RowDataPacket[]>(`
            SELECT b.id, b.user_id, b.total_price, b.status, c.id as company_id
            FROM bookings b
            JOIN trips t ON b.trip_id = t.id
            JOIN routes r ON t.route_id = r.id
            JOIN companies c ON r.company_id = c.id
            WHERE b.booking_id = ? FOR UPDATE
        `, [bookingId]);

        if (bookingRows.length === 0) throw new AppError('Booking not found', 404);
        const booking = bookingRows[0];

        if (currentUser.role === 'company' && booking.company_id !== currentUser.company_id) {
             throw new AppError('Unauthorized to manage this booking.', 403);
        }

        // AUTOMATIC REFUND LOGIC
        if (newStatus === 'Cancelled' && booking.status === 'Confirmed') {
             const [walletRows] = await connection.query<any[] & mysql.RowDataPacket[]>('SELECT id FROM wallets WHERE user_id = ?', [booking.user_id]);
             
             if(walletRows.length > 0) {
                 const walletId = walletRows[0].id;
                 
                 // Credit wallet
                 await connection.query('UPDATE wallets SET balance = balance + ? WHERE id = ?', [booking.total_price, walletId]);
                 
                 // Log transaction
                 await connection.query(
                    'INSERT INTO wallet_transactions (wallet_id, amount, type, description, related_booking_id) VALUES (?, ?, ?, ?, ?)',
                    [walletId, booking.total_price, 'refund', `Refund for cancelled booking #${bookingId}`, booking.id]
                );
             }
             
             // Free up the seats
             await connection.query('DELETE FROM seats WHERE booking_id = ?', [booking.id]);
        }

        await connection.query('UPDATE bookings SET status = ? WHERE id = ?', [newStatus, booking.id]);
        await connection.commit();
        
        // Notifications
        notificationService.dispatchNotification(booking.user_id, 'email', {
            title: `Booking Status: ${newStatus}`,
            body: `Your booking ${bookingId} has been ${newStatus}. ${newStatus === 'Cancelled' ? 'Refund processed.' : ''}`
        });

        return { id: bookingId, status: newStatus };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// Placeholder exports
export const createBooking = async (u:any, d:any) => {};
export const getBookingsForUser = async (u:any) => [];
