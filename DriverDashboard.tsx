import React, { useState, useMemo, useEffect } from 'react';
import {
    SunIcon, MoonIcon, CogIcon, UsersIcon, ChartBarIcon, BuildingOfficeIcon,
    BusIcon, MapIcon, SearchIcon, CheckCircleIcon, ArrowRightIcon
} from './components/icons';

interface DriverDashboardProps {
    onLogout: () => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    driverData: any;
    allCompanies: any[];
    onPassengerBoarding: (ticketId: string) => void;
}

const mockPassengersData = {
    'VB01': [
        { name: 'Kalisa Jean', seat: 'A5', ticketId: 'VK-83AD1', status: 'booked' },
        { name: 'Mutesi Aline', seat: 'A6', ticketId: 'VK-83AD2', status: 'booked' },
        { name: 'Hakizimana David', seat: 'B1', ticketId: 'VK-83AD3', status: 'booked' },
    ],
    'RT01': [
        { name: 'Umuhoza Grace', seat: 'C1', ticketId: 'RT-98CD3', status: 'booked' },
        { name: 'Ndayizeye Eric', seat: 'C2', ticketId: 'RT-98CD4', status: 'booked' },
    ]
};

const mockTrips = {
    'VB01': { from: 'Kigali', to: 'Rubavu', time: '07:00' },
    'RT01': { from: 'Kigali', to: 'Huye', time: '08:30' },
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ onLogout, theme, setTheme, driverData, allCompanies, onPassengerBoarding }) => {
    const [currentTrip, setCurrentTrip] = useState<any>(null);
    const [passengers, setPassengers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const tripInfo = mockTrips[driverData.assignedBusId];
        if (tripInfo) {
            setCurrentTrip(tripInfo);
            setPassengers(mockPassengersData[driverData.assignedBusId] || []);
        }
    }, [driverData]);

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    const handleConfirmBoarding = (ticketId: string) => {
        setPassengers(prev => prev.map(p => p.ticketId === ticketId ? { ...p, status: 'boarded' } : p));
        onPassengerBoarding(ticketId); // Update global state
    };

    const filteredPassengers = useMemo(() => {
        return passengers.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.seat.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [passengers, searchTerm]);
    
    const boardedCount = useMemo(() => passengers.filter(p => p.status === 'boarded').length, [passengers]);
    const totalPassengers = passengers.length;
    const boardingProgress = totalPassengers > 0 ? (boardedCount / totalPassengers) * 100 : 0;

    if (!currentTrip) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center ${theme} bg-gray-100 dark:bg-gray-900`}>
                <BusIcon className="w-16 h-16 text-gray-400 mb-4"/>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Nta rugendo ruhari</h1>
                <p className="text-gray-500 dark:text-gray-400">Nta rugendo ruri bubone kuri iyi modoka ubu.</p>
                 <button onClick={onLogout} className="mt-6 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Sohoka</button>
            </div>
        );
    }

    return (
        <div className={`min-h-screen flex flex-col ${theme} bg-gray-100 dark:bg-gray-900`}>
            <header className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm flex items-center justify-between px-6 border-b dark:border-gray-700/50 sticky top-0 z-10">
                <div className="font-bold text-gray-800 dark:text-white">Ikaze, {driverData.name}</div>
                <div className="flex items-center space-x-4">
                    <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400"><MoonIcon className="w-6 h-6"/></button>
                    <button onClick={onLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Sohoka</button>
                </div>
            </header>

            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg mb-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Urugendo rwawe</p>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                             <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white flex items-center">
                                {currentTrip.from} <ArrowRightIcon className="w-6 h-6 mx-2 text-gray-400"/> {currentTrip.to}
                            </h1>
                            <div className="text-sm sm:text-right mt-2 sm:mt-0">
                                <p className="font-semibold dark:text-gray-200">{currentTrip.time} &bull; Bisi {driverData.assignedBusId}</p>
                                <p className="text-gray-500 dark:text-gray-400">{totalPassengers} Abagenzi</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-bold text-lg dark:text-white">Urutonde rw'Abagenzi</h3>
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{boardedCount} / {totalPassengers} Bemejwe</p>
                            </div>
                             <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${boardingProgress}%` }}></div>
                            </div>
                        </div>

                         <div className="relative mb-4">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Shakisha umugenzi ku izina cyangwa umwanya..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                            {filteredPassengers.map(passenger => (
                                <div key={passenger.ticketId} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <div>
                                        <p className="font-semibold dark:text-white">{passenger.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Umwanya: {passenger.seat} &bull; ID: {passenger.ticketId}</p>
                                    </div>
                                    {passenger.status === 'boarded' ? (
                                        <div className="flex items-center space-x-2 text-green-600">
                                            <CheckCircleIcon className="w-6 h-6"/>
                                            <span className="font-semibold text-sm">Yemejwe</span>
                                        </div>
                                    ) : (
                                        <button onClick={() => handleConfirmBoarding(passenger.ticketId)} className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                            Emeza
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DriverDashboard;