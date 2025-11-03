import React, { useState } from 'react';
import { SunIcon, MoonIcon, CogIcon, UsersIcon, ChartBarIcon, QrCodeIcon } from './components/icons';
import { Page } from './App';

interface DriverDashboardProps {
    onLogout: () => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    driverData: any;
    allCompanies: any[];
    onPassengerBoarding: (ticketId: string) => void;
    navigate: (page: Page, data?: any) => void;
}

const mockCurrentTrip = {
    id: 'VK-TRIP-123',
    route: 'Kigali - Rubavu',
    departureTime: '07:00 AM',
    arrivalTime: '10:30 AM',
    passengers: [
        { id: 1, name: 'Kalisa Jean', seat: 'A5', ticketId: 'VK-83AD1', status: 'booked' },
        { id: 2, name: 'Mutesi Aline', seat: 'A6', ticketId: 'VK-83AD2', status: 'booked' },
        { id: 3, name: 'Gatete David', seat: 'B1', ticketId: 'VK-83AD3', status: 'boarded' },
    ],
};

const DriverDashboard: React.FC<DriverDashboardProps> = ({ onLogout, theme, setTheme, driverData, allCompanies, onPassengerBoarding, navigate }) => {
    const [view, setView] = useState('dashboard');
    const [scannedTicket, setScannedTicket] = useState('');
    const [scanResult, setScanResult] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    // FIX: Make a mutable copy of passengers to update status
    const [passengers, setPassengers] = useState(mockCurrentTrip.passengers);

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    const handleScan = () => {
        setScanResult(null);
        const passenger = passengers.find(p => p.ticketId === scannedTicket);
        if (passenger) {
            if (passenger.status === 'boarded') {
                setScanResult({ type: 'error', message: `${passenger.name} has already boarded.` });
            } else {
                onPassengerBoarding(passenger.ticketId);
                setScanResult({ type: 'success', message: `Welcome, ${passenger.name}! Seat: ${passenger.seat}.` });
                // Update local state to reflect change immediately
                setPassengers(passengers.map(p => p.ticketId === scannedTicket ? {...p, status: 'boarded'} : p));
            }
        } else {
            setScanResult({ type: 'error', message: 'Invalid ticket ID. Please try again.' });
        }
        setScannedTicket('');
    };

    const NavLink = ({ viewName, label, icon: Icon }) => (
      <button onClick={() => setView(viewName)} className={`group w-full flex items-center px-4 py-3 transition-all duration-300 rounded-lg relative ${view === viewName ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
          <div className={`absolute left-0 top-0 h-full w-1 rounded-r-full bg-yellow-400 transition-all duration-300 ${view === viewName ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-50'}`}></div>
          <Icon className="w-6 h-6 mr-4 transition-transform duration-300 group-hover:scale-110" />
          <span className="font-semibold">{label}</span>
      </button>
    );

    return (
        <div className={`min-h-screen flex ${theme}`}>
            <aside className="w-64 bg-gradient-to-b from-gray-800 via-gray-900 to-black text-gray-300 flex-col hidden lg:flex border-r border-gray-700/50">
                <div className="h-20 flex items-center justify-center text-white font-bold text-xl border-b border-white/10">DRIVER PORTAL</div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <NavLink viewName="dashboard" label="Dashboard" icon={ChartBarIcon} />
                    <NavLink viewName="boarding" label="Passenger Boarding" icon={QrCodeIcon} />
                    <NavLink viewName="profile" label="My Profile" icon={UsersIcon} />
                </nav>
            </aside>
            <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900">
                <header className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm flex items-center justify-between px-6 border-b dark:border-gray-700/50">
                    <div className="font-bold text-gray-800 dark:text-white">Welcome, {driverData.name.split(' ')[0]}</div>
                    <div className="flex items-center space-x-4">
                        <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400">{theme === 'light' ? <MoonIcon className="w-6 h-6"/> : <SunIcon className="w-6 h-6"/>}</button>
                        <button onClick={onLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Logout</button>
                    </div>
                </header>
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    {view === 'boarding' ? (
                        <div className="max-w-xl mx-auto">
                             <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">Scan Passenger Ticket</h1>
                             <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg">
                                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Enter the ticket ID from the passenger's QR code to verify and board them.</p>
                                 <div className="flex space-x-2">
                                     <input 
                                        type="text"
                                        value={scannedTicket}
                                        onChange={(e) => setScannedTicket(e.target.value.toUpperCase())}
                                        placeholder="Enter Ticket ID (e.g., VK-83AD1)"
                                        className="flex-grow p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                     />
                                     <button onClick={handleScan} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Scan</button>
                                 </div>
                                 {scanResult && (
                                     <div className={`mt-4 p-3 rounded-md text-sm font-semibold ${scanResult.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                                         {scanResult.message}
                                     </div>
                                 )}
                             </div>
                             <div className="mt-6 bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                                <h2 className="font-bold text-lg mb-4 dark:text-white">Passenger Manifest ({mockCurrentTrip.route})</h2>
                                <div className="space-y-3 h-64 overflow-y-auto custom-scrollbar">
                                    {passengers.map(p => (
                                        <div key={p.id} className="flex justify-between items-center p-2 rounded-md bg-gray-100 dark:bg-gray-700/50">
                                            <div>
                                                <p className="font-semibold dark:text-white">{p.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Seat: {p.seat} | ID: {p.ticketId}</p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded-full font-bold ${p.status === 'boarded' ? 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>{p.status}</span>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        </div>
                    ) : (
                         <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">Dashboard is under construction.</h1>
                    )}
                </main>
            </div>
        </div>
    );
};

export default DriverDashboard;
