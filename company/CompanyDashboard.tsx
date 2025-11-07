import React, { useState } from 'react';
import { ChartBarIcon, UsersIcon, BusIcon, MapIcon, WalletIcon } from '../components/icons';
import PinModal from '../components/PinModal';

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
        <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                {React.cloneElement(icon, { className: "w-7 h-7 text-blue-600" })}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
        </div>
    </div>
);

// Mock data moved inside for component self-containment
const companyMockData = {
    drivers: [
        { id: 'd1', name: 'John Doe', assignedBusId: 'RAD 123 B', phone: '0788111222', status: 'Active' },
        { id: 'd3', name: 'Mary Anne', assignedBusId: 'RAE 789 A', phone: '0788555666', status: 'On Leave' },
    ],
    buses: [
        { id: 'b1', plate: 'RAD 123 B', model: 'Yutong Explorer', capacity: 55, status: 'On Route', maintenanceDate: '2024-12-15', route: 'Kigali - Rubavu', progress: 75 },
        { id: 'b2', plate: 'RAE 789 A', model: 'Coaster', capacity: 30, status: 'On Route', maintenanceDate: '2024-11-30', route: 'Kigali - Huye', progress: 40 },
        { id: 'b3', plate: 'RAB 456 C', model: 'Yutong', capacity: 60, status: 'Idle', maintenanceDate: '2025-01-10', route: '', progress: 0 },
    ],
    routes: [
        { id: 'r1', from: 'Kigali', to: 'Rubavu', distance: '150km', duration: '3.5h', price: 4500, status: 'Active' },
        { id: 'r2', from: 'Kigali', to: 'Musanze', distance: '90km', duration: '2h', price: 3500, status: 'Active' },
    ]
};

interface CompanyDashboardProps {
    companyPin: string;
}

const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ companyPin }) => {
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);
    
    const { drivers, buses, routes } = companyMockData;
    const activeBuses = buses.filter(b => b.status === 'On Route');
    const popularRoute = routes.length > 0 ? `${routes[0].from} - ${routes[0].to}` : 'N/A';
    
    const handlePinSuccess = () => {
        setIsPinModalOpen(false);
        alert('Payouts Authorized Successfully!');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">Company Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Drivers" value={drivers.length} icon={<UsersIcon />} />
                <StatCard title="Today's Revenue" value="5.6M RWF" icon={<ChartBarIcon />} />
                <StatCard title="Active Buses" value={`${activeBuses.length} / ${buses.length}`} icon={<BusIcon />} />
                <StatCard title="Popular Route" value={popularRoute} icon={<MapIcon />} />
            </div>
             <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold dark:text-white mb-4">Live Fleet Status</h2>
                    <div className="space-y-4 h-[22rem] overflow-y-auto custom-scrollbar pr-2">
                        {activeBuses.map(bus => (
                             <div key={bus.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-bold dark:text-white">{bus.plate}</p>
                                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{bus.route}</p>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-600">
                                  <div className="bg-green-600 h-2 rounded-full" style={{width: `${bus.progress}%`}}></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <span>{bus.progress}% Complete</span>
                                    <span>On Time</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                     <h2 className="text-xl font-bold dark:text-white mb-4 flex items-center">
                        <WalletIcon className="w-6 h-6 mr-3 text-green-500"/>
                        Financials
                    </h2>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Authorize company expenses and payroll securely.</p>
                         <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
                            <p className="text-sm font-semibold dark:text-gray-200">Pending Payouts</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">1,850,000 RWF</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">For {drivers.length} drivers (Oct 2024)</p>
                        </div>
                        <button 
                            onClick={() => setIsPinModalOpen(true)}
                            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                        >
                            Authorize Payouts
                        </button>
                    </div>
                </div>
            </div>
            {isPinModalOpen && (
                <PinModal
                    onClose={() => setIsPinModalOpen(false)}
                    onSuccess={handlePinSuccess}
                    pinToMatch={companyPin}
                    title="Authorize Financials"
                    description="Enter your company PIN to authorize this payout."
                />
            )}
        </div>
    );
};

export default CompanyDashboard;