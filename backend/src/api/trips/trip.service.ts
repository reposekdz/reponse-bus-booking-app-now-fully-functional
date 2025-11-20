
import { pool } from '../../config/db';
import { AppError } from '../../utils/AppError';
import { io } from '../../server'; // Socket IO Instance
import * as mysql from 'mysql2/promise';
import { dispatchNotification } from '../notifications/notifications.service';

// Search logic
export const findTrips = async (query: any) => {
    const { from, to, date, companyId } = query;
    let sql = `
        SELECT t.id as _id, t.departure_time as departureTime, t.arrival_time as arrivalTime, t.status,
               r.origin, r.destination, r.base_price as basePrice, r.estimated_duration_minutes,
               c.name as company_name, c.logo_url,
               b.plate_number, b.amenities, b.capacity,
               (b.capacity - (SELECT COUNT(*) FROM seats s WHERE s.trip_id = t.id)) as availableSeats,
               u.name as driver_name, u.avatar_url as driver_avatar
        FROM trips t
        JOIN routes r ON t.route_id = r.id
        JOIN buses b ON t.bus_id = b.id
        JOIN companies c ON r.company_id = c.id
        LEFT JOIN users u ON t.driver_id = u.id
        WHERE t.status != 'Cancelled'
    `;
    const params = [];
    
    if (from) { sql += ' AND r.origin = ?'; params.push(from); }
    if (to) { sql += ' AND r.destination = ?'; params.push(to); }
    if (date) { sql += ' AND DATE(t.departure_time) = ?'; params.push(date); }
    if (companyId) { sql += ' AND c.id = ?'; params.push(companyId); }

    sql += ' ORDER BY t.departure_time ASC';

    const [rows] = await pool.query(sql, params);
    
    // Format for frontend
    return (rows as any[]).map(row => ({
        _id: row._id,
        departureTime: row.departureTime,
        arrivalTime: row.arrivalTime,
        availableSeats: row.availableSeats,
        status: row.status,
        route: {
            from: row.origin,
            to: row.destination,
            basePrice: parseFloat(row.basePrice),
            estimatedDurationMinutes: row.estimated_duration_minutes,
            company: {
                name: row.company_name,
                logoUrl: row.logo_url
            }
        },
        bus: {
            amenities: row.amenities ? row.amenities.split(',') : []
        },
        driver: {
            name: row.driver_name,
            avatar_url: row.driver_avatar
        }
    }));
};

export const findTripById = async (id: string) => {
    const [rows] = await pool.query<any[] & mysql.RowDataPacket[]>(`
        SELECT t.*, b.capacity, b.amenities, r.base_price, r.origin, r.destination, c.name as company_name
        FROM trips t
        JOIN buses b ON t.bus_id = b.id
        JOIN routes r ON t.route_id = r.id
        JOIN companies c ON r.company_id = c.id
        WHERE t.id = ?
    `, [id]);

    if (rows.length === 0) throw new AppError('Trip not found', 404);
    
    const trip = rows[0];
    
    // Get seat map (booked seats)
    const [seatRows] = await pool.query<any[] & mysql.RowDataPacket[]>('SELECT seat_number FROM seats WHERE trip_id = ?', [id]);
    const bookedSeats = seatRows.map(s => s.seat_number);
    
    const seatMap: any = {};
    // Simple grid generation for demo: A1..A4, B1..B4
    const rowsCount = Math.ceil(trip.capacity / 4);
    const cols = ['A', 'B', 'C', 'D'];
    
    for(let i=1; i<=rowsCount; i++) {
        for(let col of cols) {
            const seatId = `${i}${col}`;
            seatMap[seatId] = bookedSeats.includes(seatId) ? 'occupied' : 'available';
        }
    }

    return {
        ...trip,
        seatMap,
        route: {
            from: trip.origin,
            to: trip.destination,
            basePrice: parseFloat(trip.base_price),
            company: { name: trip.company_name }
        },
        bus: { capacity: trip.capacity }
    };
};

// Update trip status and broadcast real-time event
export const updateTripStatus = async (tripId: string, newStatus: string, user: any) => {
    // ... (Existing ownership check would go here) ...

    await pool.query('UPDATE trips SET status = ? WHERE id = ?', [newStatus, tripId]);

    // REAL-TIME BROADCAST
    // Broadcast to specific trip room (Drivers/Passengers on this trip)
    io.to(`trip:${tripId}`).emit('tripStatusUpdate', { 
        tripId, 
        status: newStatus,
        timestamp: new Date().toISOString() 
    });
    
    // Broadcast to global listeners (e.g. Schedule Boards)
    io.emit('globalTripUpdate', { tripId, status: newStatus });

    return { id: tripId, status: newStatus };
};

export const departTrip = async (tripId: string, driverId: number) => {
    await pool.query('UPDATE trips SET status = "Departed" WHERE id = ?', [tripId]);
    
    // Broadcast Departure
    io.to(`trip:${tripId}`).emit('tripStatusUpdate', { 
        tripId, 
        status: 'Departed',
        message: 'The bus has departed!'
    });
};

export const arriveTrip = async (tripId: string, driverId: number) => {
    await pool.query('UPDATE trips SET status = "Arrived" WHERE id = ?', [tripId]);
    
    // Broadcast Arrival
    io.to(`trip:${tripId}`).emit('tripStatusUpdate', { 
        tripId, 
        status: 'Arrived',
        message: 'The bus has arrived at destination.'
    });
};

export const getManifestForTrip = async (tripId: string, driverId: number) => {
    const [rows] = await pool.query(`
        SELECT b.booking_id, b.status, u.name as passenger_name, 
               GROUP_CONCAT(s.seat_number) as seats
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN seats s ON b.id = s.booking_id
        WHERE b.trip_id = ?
        GROUP BY b.id
    `, [tripId]);
    return rows;
};

export const confirmPassengerBoarding = async (data: any) => {
    // Verify ticket and update status to 'Completed' / 'Boarded'
    const { tripId, ticketId } = data;
    
    const [booking] = await pool.query<any[] & mysql.RowDataPacket[]>('SELECT id FROM bookings WHERE booking_id = ? AND trip_id = ?', [ticketId, tripId]);
    if(booking.length === 0) throw new AppError('Invalid ticket for this trip', 400);
    
    await pool.query('UPDATE bookings SET status = "Completed" WHERE id = ?', [booking[0].id]);
    await pool.query('INSERT INTO boardings (booking_id, trip_id, driver_id) VALUES (?, ?, ?)', [booking[0].id, tripId, data.driverId]);
    
    // Notify others watching this trip (e.g. admin dashboard)
    io.to(`trip:${tripId}`).emit('passengerBoarded', { bookingId: ticketId, newStatus: 'Completed' });

    return { success: true };
};
