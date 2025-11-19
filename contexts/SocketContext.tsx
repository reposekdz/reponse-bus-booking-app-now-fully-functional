import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { token, user } = useAuth();

    useEffect(() => {
        // Only establish connection if we have a token and user
        if (token && user) {
            // In a production environment with a proxy, the path is relative.
            // For development with vite proxy, this will be directed to the backend.
            const newSocket = io({
                // The path option ensures it connects to your backend's socket.io endpoint
                // especially if it's not at the root.
                path: '/socket.io',
                // transports: ['websocket'], // You can force websocket if needed
            });

            newSocket.on('connect', () => {
                console.log('Socket connected:', newSocket.id);
                // After connecting, send the token for authentication on the backend
                newSocket.emit('authenticate', token);
            });
            
            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
            });

            setSocket(newSocket);

            // Cleanup on component unmount or when token changes
            return () => {
                newSocket.disconnect();
            };
        } else if (socket) {
            // If the user logs out, disconnect the existing socket
            socket.disconnect();
            setSocket(null);
        }
    }, [token, user]); // Rerun effect if token or user changes

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
