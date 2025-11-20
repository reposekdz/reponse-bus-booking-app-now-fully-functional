
import { pool } from '../../config/db';
import { AppError } from '../../utils/AppError';
import * as mysql from 'mysql2/promise';
import { io } from '../../server';
import * as notificationService from '../notifications/notifications.service';
import crypto from 'crypto';

export const createBooking = async (userId: number, bookingDetails: any) => {
    const { tripId, seats, paymentMethod, totalPrice, pin } = bookingDetails;
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        // 1. Verify Trip & Seats
        const [tripRows] = await connection.query<any[] & mysql.RowDataPacket[]>('SELECT * FROM trips WHERE id = ?', [tripId]);
        if (tripRows.length === 0) throw new AppError('Trip not found', 404);

        // Check seat availability logic here (check 'seats' table for collision)
        const seatPlaceholders = seats.map(() => '?').join(',');
        const [occupied] = await connection.query<any[] & mysql.RowDataPacket[]>(
            `SELECT seat_number FROM seats WHERE trip_id = ? AND seat_number IN (${seatPlaceholders})`,
            [tripId, ...seats]
        );
        
        if (occupied.length > 0) {
             throw new AppError(`Seats ${occupied.map(s => s.seat_number).join(', ')} are already taken.`, 409);
        }

        // 2. Process Payment (Wallet)
        if (paymentMethod === 'wallet') {
             const [walletRows] = await connection.query<any[] & mysql.RowDataPacket[]>('SELECT id, balance FROM wallets WHERE user_id = ? FOR UPDATE', [userId]);
             if (walletRows.length === 0) throw new AppError('Wallet not found', 404);
             
             const currentBalance = parseFloat(walletRows[0].balance);
             if (currentBalance < totalPrice) throw new AppError('Insufficient funds', 400);
             
             // Deduct
             await connection.query('UPDATE wallets SET balance = balance - ? WHERE id = ?', [totalPrice, walletRows[0].id]);
             await connection.query('INSERT INTO wallet_transactions (wallet_id, amount, type, description) VALUES (?, ?, ?, ?)', 
                [walletRows[0].id, -totalPrice, 'purchase', `Ticket Purchase Trip #${tripId}`]);
        }

        // 3. Create Booking Record
        const bookingRef = `GB-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
        const [result] = await connection.query<mysql.ResultSetHeader>(
            'INSERT INTO bookings (user_id, trip_id, booking_id, total_price, payment_method, status) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, tripId, bookingRef, totalPrice, paymentMethod, 'Confirmed']
        );
        const bookingId = result.insertId;

        // 4. Reserve Seats
        for (const seat of seats) {
             await connection.query('INSERT INTO seats (booking_id, trip_id, seat_number) VALUES (?, ?, ?)', [bookingId, tripId, seat]);
        }

        await connection.commit();
        
        // Notify Driver & Update Realtime
        io.to(`trip:${tripId}`).emit('bookingConfirmed', { tripId, seats });
        
        return { bookingId: bookingRef, status: 'Confirmed', ...bookingDetails };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const getBookingsForUser = async (userId: number) => {
    const [rows] = await pool.query(`
        SELECT b.id as _id, b.booking_id as bookingId, b.total_price as totalPrice, b.status, b.created_at,
               t.departure_time, t.arrival_time, 
               r.origin as 'from', r.destination as 'to', 
               c.name as company,
               (SELECT JSON_ARRAYAGG(seat_number) FROM seats WHERE booking_id = b.id) as seats
        FROM bookings b
        JOIN trips t ON b.trip_id = t.id
        JOIN routes r ON t.route_id = r.id
        JOIN companies c ON r.company_id = c.id
        WHERE b.user_id = ?
        ORDER BY b.created_at DESC
    `, [userId]);
    
    // Format for frontend
    return rows.map((row: any) => ({
        ...row,
        trip: {
            departureTime: row.departure_time,
            route: {
                from: row.from,
                to: row.to,
                company: { name: row.company }
            }
        }
    }));
};

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
            body: `Your booking ${bookingId} has been ${newStatus}. ${newStatus === 'Cancelled' ? 'Refund processed to your wallet.' : ''}`
        });

        return { id: bookingId, status: newStatus };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};
