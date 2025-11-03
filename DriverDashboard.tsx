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
    const [passengers, setPassengers] = useState(mockCurrentTrip.passengers);

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    const handleScan = () => {
        setScanResult(null);
        if (!scannedTicket) {
            setScanResult({ type: 'error', message: 'Ticket ID cannot be empty.' });
            return;
        }
        const passenger = passengers.find(p => p.ticketId === scannedTicket);
        if (passenger) {
            if (passenger.status === 'boarded') {
                setScanResult({ type: 'error', message: `${passenger.name} has already boarded.` });
            } else {
                onPassengerBoarding(passenger.ticketId);
                setScanResult({ type: 'success', message: `Welcome, ${passenger.name}! Seat: ${passenger.seat}.` });
                setPassengers(passengers.map(p => p.ticketId === scannedTicket ? {...p, status: 'boarded'} : p));
            }
        } else {
            setScanResult({ type: 'error', message: 'Invalid ticket ID. Please try again.' });
        }
        setScannedTicket('');
    };
    
    const simulateScan = (type: 'success' | 'failure' | 'duplicate') => {
        if (type === 'success') {
            const passengerToScan = passengers.find(p => p.status === 'booked');
            if (passengerToScan) {
                setScannedTicket(passengerToScan.ticketId);
            } else {
                setScannedTicket('VK-83AD1'); // Fallback if all are boarded
            }
        } else if (type === 'duplicate') {
            const boardedPassenger = passengers.find(p => p.status === 'boarded');
             if (boardedPassenger) {
                setScannedTicket(boardedPassenger.ticketId);
            } else {
                 setScannedTicket('VK-83AD3');
            }
        } else {
            setScannedTicket('INVALID-ID');
        }
        // Use timeout to ensure state update before scan
        setTimeout(handleScan, 50);
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
                             <div className="bg-white dark:bg-gray-800/50 p-6 sm:p-8 rounded-2xl shadow-lg">
                                <div className="aspect-square w-full bg-gray-900 rounded-xl mb-6 flex items-center justify-center p-4 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-repeat opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}></div>
                                    <div className="w-full h-full border-4 border-dashed border-blue-500/50 rounded-lg flex items-center justify-center flex-col">
                                        <QrCodeIcon className="w-20 h-20 text-blue-400/50"/>
                                        <p className="text-blue-400/50 mt-2 text-sm font-semibold">Align QR code within frame</p>
                                    </div>
                                </div>
                                 <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-4">Enter ticket ID manually if scan fails</p>
                                 <div className="flex space-x-2">
                                     <input 
                                        type="text"
                                        value={scannedTicket}
                                        onChange={(e) => setScannedTicket(e.target.value.toUpperCase())}
                                        placeholder="Enter Ticket ID..."
                                        className="flex-grow p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                     />
                                     <button onClick={handleScan} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Verify</button>
                                 </div>
                                 {scanResult && (
                                     <div className={`mt-4 p-3 rounded-md text-sm font-semibold ${scanResult.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                                         {scanResult.message}
                                     </div>
                                 )}
                                 <div className="text-center mt-4 text-xs text-gray-400">
                                     <p>For Demo:</p>
                                     <div className="flex justify-center space-x-2 mt-1">
                                         <button onClick={() => simulateScan('success')} className="text-green-500 hover:underline">Simulate Success</button>
                                         <button onClick={() => simulateScan('duplicate')} className="text-yellow-500 hover:underline">Simulate Duplicate</button>
                                         <button onClick={() => simulateScan('failure')} className="text-red-500 hover:underline">Simulate Failure</button>
                                     </div>
                                 </div>
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
                        <div>
                             <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">Dashboard</h1>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <button onClick={() => setView('boarding')} className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-left">
                                    <QrCodeIcon className="w-12 h-12 mb-4"/>
                                    <h2 className="text-2xl font-bold">Start Passenger Boarding</h2>
                                    <p className="opacity-80 mt-2">Scan tickets to verify and board passengers for the current trip.</p>
                                </button>
                                 <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg">
                                    <h2 className="text-2xl font-bold dark:text-white">Trip Details</h2>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400">More trip details and actions will be shown here.</p>
                                </div>
                             </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default DriverDashboard;
