
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SunIcon, MoonIcon, CogIcon, UsersIcon, ChartBarIcon, QrCodeIcon, ChartPieIcon, ClipboardDocumentListIcon, WrenchScrewdriverIcon, MegaphoneIcon, CalendarIcon, ChatBubbleLeftRightIcon, CheckCircleIcon, StarIcon, ShieldCheckIcon, MenuIcon, XIcon, ArrowRightIcon, BusIcon } from './components/icons';
import { Page } from './types';
import * as api from './services/apiService';
import LoadingSpinner from './components/LoadingSpinner';
import { useSocket } from './contexts/SocketContext';
import ErrorDisplay from './components/ErrorDisplay';

interface DriverDashboardProps {
    onLogout: () => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    driverData: any;
    navigate: (page: Page, data?: any) => void;
}

const AvailabilityToggle: React.FC<{ isAvailable: boolean; onToggle: () => void; isLoading: boolean }> = ({ isAvailable, onToggle, isLoading }) => {
    return (
        <div className="flex items-center space-x-2">
            <span className={`text-sm font-semibold ${isAvailable ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                {isAvailable ? 'Available' : 'Unavailable'}
            </span>
            <button
                onClick={onToggle}
                disabled={isLoading}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${isAvailable ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
    );
};


const TripCard: React.FC<{ trip: any, onSelect: (trip: any) => void }> = ({ trip, onSelect }) => (
    <button onClick={() => onSelect(trip)} className="w-full text-left bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-md hover:shadow-lg hover:border-blue-500 border-2 border-transparent transition-all">
        <div className="flex justify-between items-center">
            <p className="font-bold text-lg dark:text-white">{trip.route}</p>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${trip.status === 'Scheduled' ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'}`}>
                {trip.status}
            </span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            <p>Departure: {new Date(trip.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p>Bus: {trip.bus_plate}</p>
        </div>
    </button>
);


const TripManagementView = ({ trip, onBack }) => {
    const [manifest, setManifest] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [ticketId, setTicketId] = useState('');
    const [scanResult, setScanResult] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [tripStatus, setTripStatus] = useState(trip.status);
    const socket = useSocket();

    const fetchManifest = async () => {
        setIsLoading(true);
        try {
            const data = await api.getTripManifest(trip.id);
            setManifest(data);
        } catch (e: any) {
            setError(e.message || 'Failed to load manifest.');
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchManifest();
    }, [trip.id]);

    useEffect(() => {
        if (socket) {
            socket.emit('joinTripRoom', trip.id);

            const handlePassengerBoarded = ({ bookingId, newStatus }) => {
                setManifest(prevManifest =>
                    prevManifest.map(p =>
                        p.booking_id === bookingId ? { ...p, status: newStatus } : p
                    )
                );
            };

            socket.on('passengerBoarded', handlePassengerBoarded);

            return () => {
                socket.off('passengerBoarded', handlePassengerBoarded);
                // Optionally leave the room, though not strictly necessary
            };
        }
    }, [socket, trip.id]);

    const handleVerify = async () => {
        setScanResult(null);
        if (!ticketId) return;
        try {
            const result = await api.confirmBoarding(trip.id, ticketId);
            setScanResult({ type: 'success', message: `Welcome ${result.passengerName} (Seat: ${result.seat})` });
            // The state update will now come from the socket event, so no need to refetch manifest here.
        } catch (e: any) {
            setScanResult({ type: 'error', message: e.message || 'Verification failed.' });
        } finally {
            setTicketId('');
        }
    };

    const handleUpdateTripStatus = async (newStatus: 'Departed' | 'Arrived') => {
        try {
            if (newStatus === 'Departed') {
                await api.departTrip(trip.id);
                setTripStatus('Departed');
            } else if (newStatus === 'Arrived') {
                await api.arriveTrip(trip.id);
                setTripStatus('Arrived');
            }
        } catch (e: any) {
            alert(`Failed to update trip status: ${e.message}`);
        }
    };

    const boardedCount = manifest.filter(p => p.status === 'Completed').length;

    return (
        <div className="animate-fade-in">
            <button onClick={onBack} className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4">&larr; Back to Trip List</button>
            <h1 className="text-3xl font-bold dark:text-white">{trip.route}</h1>
            <p className="text-gray-500 dark:text-gray-400">Departure: {new Date(trip.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            
            <div className="mt-4 flex space-x-4">
                <button onClick={() => handleUpdateTripStatus('Departed')} disabled={tripStatus !== 'Scheduled'} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400">Depart Trip</button>
                <button onClick={() => handleUpdateTripStatus('Arrived')} disabled={tripStatus !== 'Departed'} className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-400">Arrive Trip</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">Boarding Verification</h2>
                    <div className="flex space-x-2">
                        <input type="text" value={ticketId} onChange={e => setTicketId(e.target.value.toUpperCase())} placeholder="Enter Ticket ID" className="flex-grow p-2 border rounded-md dark:bg-gray-700"/>
                        <button onClick={handleVerify} className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold">Verify</button>
                    </div>
                    {scanResult && (
                         <div className={`mt-4 p-3 rounded-md text-sm font-semibold ${scanResult.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                             {scanResult.message}
                         </div>
                     )}
                </div>
                <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">Passenger Manifest ({boardedCount}/{manifest.length})</h2>
                    {isLoading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
                        <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                            {manifest.map(p => (
                                <div key={p.booking_id} className="flex justify-between p-2 bg-gray-100 dark:bg-gray-700/50 rounded-md">
                                    <div>
                                        <p className="font-semibold text-sm dark:text-white">{p.passenger_name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Seat: {p.seats}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${p.status === 'Completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>{p.status === 'Completed' ? 'Boarded' : 'Booked'}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
};


const DriverDashboard: React.FC<DriverDashboardProps> = ({ onLogout, theme, setTheme, driverData, navigate }) => {
    const [trips, setTrips] = useState<any[]>([]);
    const [selectedTrip, setSelectedTrip] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAvailable, setIsAvailable] = useState(driverData.status === 'Active');
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const socket = useSocket();
    const watchIdRef = useRef<number | null>(null);

    const handleToggleAvailability = async () => {
        setIsUpdatingStatus(true);
        const newStatus = !isAvailable ? 'Active' : 'Unavailable';
        try {
            await api.driverUpdateMyStatus(newStatus as 'Active' | 'Unavailable');
            setIsAvailable(!isAvailable);
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Could not update availability status. Please try again.");
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const fetchTrips = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await api.driverGetMyTrips();
            setTrips(data);
        } catch (err) {
            setError((err as Error).message || "Failed to fetch trips.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTrips();
    }, [fetchTrips]);
    
    // Real-time location tracking effect
    useEffect(() => {
        if (socket && selectedTrip?.status === 'Departed') {
            watchIdRef.current = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    socket.emit('updateDriverLocation', { lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error("Geolocation error:", error);
                },
                { enableHighAccuracy: true }
            );

            return () => {
                if (watchIdRef.current !== null) {
                    navigator.geolocation.clearWatch(watchIdRef.current);
                }
            };
        } else {
             if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
             }
        }
    }, [socket, selectedTrip]);


    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    const renderContent = () => {
        if (isLoading) return <LoadingSpinner />;
        if (error) return <ErrorDisplay message={error} onRetry={fetchTrips} />;

        if (selectedTrip) {
            return <TripManagementView trip={selectedTrip} onBack={() => setSelectedTrip(null)} />;
        }

        return (
            <div>
                <h1 className="text-3xl font-bold dark:text-white mb-6">Today's Assigned Trips</h1>
                {trips.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trips.map(trip => <TripCard key={trip.id} trip={trip} onSelect={setSelectedTrip} />)}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-10">No trips assigned for today.</p>
                )}
            </div>
        );
    };

    return (
        <div className={`min-h-screen flex ${theme}`}>
            {/* Sidebar can be added back if needed */}
            <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900">
                <header className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm flex items-center justify-between px-6 border-b dark:border-gray-700/50">
                    <div className="font-bold text-gray-800 dark:text-white">Welcome, {driverData.name.split(' ')[0]}</div>
                    <div className="flex items-center space-x-4">
                        <AvailabilityToggle isAvailable={isAvailable} onToggle={handleToggleAvailability} isLoading={isUpdatingStatus} />
                        <button onClick={() => navigate('driverSettings')} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            <CogIcon className="w-6 h-6"/>
                        </button>
                        <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400">{theme === 'light' ? <MoonIcon className="w-6 h-6"/> : <SunIcon className="w-6 h-6"/>}</button>
                        <button onClick={onLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Logout</button>
                    </div>
                </header>
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                   {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default DriverDashboard;
