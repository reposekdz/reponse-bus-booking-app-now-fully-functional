
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from './config';
import logger from './utils/logger';

export const initSocket = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        logger.info(`Socket connected: ${socket.id}`);

        // Listen for an authentication event from the client
        socket.on('authenticate', (token: string) => {
            if (!token) {
                logger.warn(`Socket ${socket.id} tried to authenticate without a token.`);
                return;
            }
            try {
                // Verify the JWT token
                const decoded = jwt.verify(token, config.jwt.secret) as { id: string; companyId?: number; role: string };
                // If valid, have the socket join a room named after its user ID.
                // This allows us to easily target specific users for notifications.
                socket.join(decoded.id.toString());
                if (decoded.companyId) {
                    socket.join(`company:${decoded.companyId}`);
                }
                (socket as any).userContext = decoded;
                logger.info(`Socket ${socket.id} authenticated and joined rooms for user ${decoded.id}`);
            } catch (error) {
                logger.warn(`Socket authentication failed for ${socket.id}: ${(error as Error).message}`);
            }
        });
        
        // Handle Driver Location Updates
        // Expected payload: { tripId: string, location: { lat: number, lng: number }, speed: number }
        socket.on('updateDriverLocation', (data) => {
            const userContext = (socket as any).userContext;
            if (userContext && userContext.role === 'driver') {
                
                // Broadcast to company room
                if (userContext.companyId) {
                    io.to(`company:${userContext.companyId}`).emit('fleetLocationUpdate', {
                        driverId: userContext.id,
                        tripId: data.tripId,
                        location: data.location,
                        speed: data.speed,
                        lastUpdate: new Date().toISOString()
                    });
                }

                // Broadcast to specific trip room (for passengers)
                if (data.tripId) {
                     io.to(`trip:${data.tripId}`).emit('tripLocationUpdate', {
                        location: data.location,
                        speed: data.speed,
                        lastUpdate: new Date().toISOString()
                    });
                }
            }
        });

        socket.on('joinTripRoom', (tripId: string) => {
            if (tripId) {
                socket.join(`trip:${tripId}`);
                logger.info(`Socket ${socket.id} joined room for trip ${tripId}`);
            }
        });

        socket.on('leaveTripRoom', (tripId: string) => {
             if (tripId) {
                socket.leave(`trip:${tripId}`);
            }
        });

        socket.on('disconnect', () => {
            logger.info(`Socket disconnected: ${socket.id}`);
        });
    });
};
