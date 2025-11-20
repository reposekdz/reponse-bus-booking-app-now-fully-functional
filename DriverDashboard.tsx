
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SunIcon, MoonIcon, CogIcon, UsersIcon, ChartBarIcon, QrCodeIcon, ChartPieIcon, ClipboardDocumentListIcon, WrenchScrewdriverIcon, MegaphoneIcon, CalendarIcon, ChatBubbleLeftRightIcon, CheckCircleIcon, StarIcon, ShieldCheckIcon, MenuIcon, XIcon, ArrowRightIcon, BusIcon } from './components/icons';
import { Page } from './types';
import * as api from './services/apiService';
import LoadingSpinner from './components/LoadingSpinner';
import { useSocket } from './contexts/SocketContext'; // Import Socket Context
import ErrorDisplay from './components/ErrorDisplay';
import DriverTripHistory from './components/DriverTripHistory';
import VehicleReportModal from './components/VehicleReportModal';

interface DriverDashboardProps {
    driverData: any;
    navigate: (page: Page, data?: any) => void;
    onLogout: () => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
}

const TripManagementView = ({ trip, onBack }) => {
    const [manifest, setManifest] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [ticketId, setTicketId] = useState('');
    const [tripStatus, setTripStatus] = useState(trip.status);
    const [scanResult, setScanResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const socket = useSocket(); // Use Socket

    useEffect(() => {
        const fetchManifest = async () => {
            try {
                const data = await api.getTripManifest(trip.id);
                setManifest(data);
                setIsLoading(false);
            } catch (e) { console.error(e); }
        };
        fetchManifest();

        // Real-time Listeners
        if (socket) {
            socket.emit('joinTripRoom', trip.id);
            
            // Update manifest when a passenger boards
            socket.on('passengerBoarded', ({ bookingId, newStatus }) => {
                setManifest(prev => prev.map(p => p.booking_id === bookingId ? { ...p, status: newStatus } : p));
            });

            // Update trip status locally when received from server
            socket.on('tripStatusUpdate', ({ status }) => {
                setTripStatus(status);
            });
        }

        return () => {
            if (socket) {
                socket.off('passengerBoarded');
                socket.off('tripStatusUpdate');
            }
        };
    }, [trip.id, socket]);

    const handleUpdateTripStatus = async (newStatus: 'Departed' | 'Arrived') => {
        try {
            if (newStatus === 'Departed') await api.departTrip(trip.id);
            else await api.arriveTrip(trip.id);
            // The socket event will update the UI, but we can do it optimistically too
            setTripStatus(newStatus); 
        } catch (e) {
            alert("Error updating status");
        }
    };
    
    const handleBoardPassenger = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!ticketId) return;
        setScanResult(null);
        try {
            await api.confirmBoarding(trip.id, ticketId);
            setScanResult({ type: 'success', message: 'Passenger confirmed!' });
            setTicketId('');
            // Manifest update handled by socket
        } catch (err: any) {
            setScanResult({ type: 'error', message: err.message || 'Invalid ticket.' });
        }
    }

    return (
        <div className="animate-fade-in">
            <button onClick={onBack} className="text-blue-600 mb-4 hover:underline">&larr; Back to Dashboard</button>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold dark:text-white">{trip.route}</h1>
                    <span className={`px-4 py-1 rounded-full text-white font-bold ${tripStatus === 'Departed' ? 'bg-blue-500' : tripStatus === 'Arrived' ? 'bg-green-500' : 'bg-yellow-500'}`}>{tripStatus}</span>
                </div>
                 <div className="flex space-x-4 mb-6">
                    <button onClick={() => handleUpdateTripStatus('Departed')} disabled={tripStatus !== 'Scheduled'} className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-blue-700 transition font-semibold shadow-md">Start Trip</button>
                    <button onClick={() => handleUpdateTripStatus('Arrived')} disabled={tripStatus !== 'Departed'} className="px-6 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-green-700 transition font-semibold shadow-md">End Trip</button>
                </div>
                
                {/* Boarding Section */}
                <div className="border-t dark:border-gray-700 pt-6">
                    <h3 className="font-bold text-lg mb-3 dark:text-white">Boarding Control</h3>
                    <form onSubmit={handleBoardPassenger} className="flex space-x-2 max-w-md mb-4">
                        <input 
                            type="text" 
                            value={ticketId} 
                            onChange={e => setTicketId(e.target.value.toUpperCase())} 
                            placeholder="Enter Ticket ID (e.g., GB-XYZ)" 
                            className="flex-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        />
                        <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700">Verify</button>
                    </form>
                    {scanResult && <p className={`text-sm font-bold mb-4 ${scanResult.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>{scanResult.message}</p>}
                </div>
            </div>
            
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="font-bold text-xl mb-4 dark:text-white">Passenger Manifest</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">Seats</th>
                                <th className="p-3">Booking ID</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                         <tbody>
                            {manifest.map(p => (
                                <tr key={p.booking_id} className="border-t dark:border-gray-700">
                                    <td className="p-3 font-semibold dark:text-white">{p.passenger_name}</td>
                                    <td className="p-3">{p.seats}</td>
                                    <td className="p-3 font-mono">{p.booking_id}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {p.status === 'Completed' ? 'Boarded' : 'Booked'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                             {manifest.length === 0 && !isLoading && <tr><td colSpan={4} className="p-4 text-center text-gray-500">No passengers found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const DriverDashboard: React.FC<DriverDashboardProps> = ({ driverData, navigate, onLogout, theme, setTheme }) => {
    const [activeView, setActiveView] = useState<'dashboard' | 'history' | 'settings' | 'trip'>('dashboard');
    const [currentTrip, setCurrentTrip] = useState<any>(null);
    const [myTrips, setMyTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const data = await api.driverGetMyTrips();
                setMyTrips(data);
            } catch(e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        if(activeView === 'dashboard') fetchTrips();
    }, [activeView]);

    const handleTripSelect = (trip) => {
        setCurrentTrip(trip);
        setActiveView('trip');
    };

    return (
        <div className={`min-h-screen flex ${theme}`}>
            <aside className="w-20 md:w-64 bg-gray-900 text-gray-300 flex-col flex">
                 <div className="h-20 flex items-center justify-center text-white font-bold text-xl border-b border-white/10">
                    <span className="md:inline hidden">DRIVER PORTAL</span>
                    <span className="md:hidden">D</span>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setActiveView('dashboard')} className={`w-full flex items-center p-3 rounded-lg ${activeView === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-white/10'}`}>
                        <ChartBarIcon className="w-6 h-6 md:mr-3"/> <span className="hidden md:inline">Dashboard</span>
                    </button>
                     <button onClick={() => setActiveView('history')} className={`w-full flex items-center p-3 rounded-lg ${activeView === 'history' ? 'bg-blue-600 text-white' : 'hover:bg-white/10'}`}>
                        <ClipboardDocumentListIcon className="w-6 h-6 md:mr-3"/> <span className="hidden md:inline">History</span>
                    </button>
                    <button onClick={() => navigate('driverSettings')} className={`w-full flex items-center p-3 rounded-lg hover:bg-white/10`}>
                        <CogIcon className="w-6 h-6 md:mr-3"/> <span className="hidden md:inline">Settings</span>
                    </button>
                </nav>
            </aside>
            <div className="flex-1 bg-gray-100 dark:bg-gray-900 flex flex-col">
                 <header className="h-16 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between px-6">
                    <div className="font-bold text-gray-800 dark:text-white">Welcome, {driverData.name}</div>
                    <div className="flex items-center space-x-4">
                         <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400">{theme === 'light' ? <MoonIcon className="w-6 h-6"/> : <SunIcon className="w-6 h-6"/>}</button>
                        <button onClick={onLogout} className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-bold">Logout</button>
                    </div>
                </header>
                <main className="flex-1 p-6 overflow-y-auto">
                    {activeView === 'dashboard' && (
                        <div className="animate-fade-in">
                            <h1 className="text-2xl font-bold dark:text-white mb-6">Today's Schedule</h1>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg">
                                    <p className="opacity-80">Assigned Trips</p>
                                    <p className="text-3xl font-bold">{myTrips.length}</p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                    <p className="text-gray-500 dark:text-gray-400">Vehicle Status</p>
                                    <p className="text-3xl font-bold text-green-500">Good</p>
                                    <button onClick={() => setIsReportModalOpen(true)} className="text-xs text-blue-500 mt-2 hover:underline">Report Issue</button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {isLoading ? <LoadingSpinner /> : myTrips.length > 0 ? myTrips.map((trip: any) => (
                                    <div key={trip.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-center">
                                        <div>
                                            <h3 className="text-xl font-bold dark:text-white">{trip.route}</h3>
                                            <p className="text-gray-500 dark:text-gray-400 mt-1"><CalendarIcon className="w-4 h-4 inline mr-1"/> {new Date(trip.date).toLocaleString()}</p>
                                            <p className="text-sm font-semibold text-blue-600 mt-2">Bus: {trip.bus_plate}</p>
                                            <p className="text-xs text-green-600 font-bold mt-1">{trip.status}</p>
                                        </div>
                                        <button onClick={() => handleTripSelect(trip)} className="mt-4 md:mt-0 px-6 py-3 bg-yellow-400 text-blue-900 font-bold rounded-lg shadow-md hover:bg-yellow-500 transition">
                                            Manage Trip
                                        </button>
                                    </div>
                                )) : <p className="text-center text-gray-500">No trips assigned for today.</p>}
                            </div>
                        </div>
                    )}
                    {activeView === 'trip' && currentTrip && (
                        <TripManagementView trip={currentTrip} onBack={() => setActiveView('dashboard')} />
                    )}
                     {activeView === 'history' && <DriverTripHistory />}
                </main>
            </div>
             {isReportModalOpen && <VehicleReportModal busId={driverData.assigned_bus_id || 'Unknown'} onClose={() => setIsReportModalOpen(false)} />}
        </div>
    );
};

export default DriverDashboard;
