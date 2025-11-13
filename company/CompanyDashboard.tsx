import React, { useState, useEffect } from 'react';
import { ChartBarIcon, UsersIcon, BusIcon, MapIcon, WalletIcon, StarIcon } from '../components/icons';
import PinModal from '../components/PinModal';
import * as api from '../services/apiService';
import LoadingSpinner from '../components/LoadingSpinner';

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

interface CompanyDashboardProps {
    companyPin: string;
}

const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ companyPin }) => {
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await api.getCompanyDashboard();
                setDashboardData(data);
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePinSuccess = () => {
        setIsPinModalOpen(false);
        alert('Payouts Authorized Successfully!');
    };
    
    if (isLoading || !dashboardData) {
        return <LoadingSpinner />;
    }

    const { stats, liveFleet, driverLeaderboard } = dashboardData;

    return (
        <div>
            <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">Company Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Drivers" value={stats.driverCount} icon={<UsersIcon />} />
                <StatCard title="Today's Revenue" value={`${new Intl.NumberFormat('fr-RW').format(stats.todayRevenue)} RWF`} icon={<ChartBarIcon />} />
                <StatCard title="Active Buses" value={`${stats.activeBuses} / ${stats.busCount}`} icon={<BusIcon />} />
                <StatCard title="Popular Route" value={stats.popularRoute} icon={<MapIcon />} />
            </div>
             <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold dark:text-white mb-4">Live Fleet Status</h2>
                    <div className="space-y-4 h-[22rem] overflow-y-auto custom-scrollbar pr-2">
                        {liveFleet.map((bus: any) => (
                             <div key={bus.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-bold dark:text-white">{bus.plate}</p>
                                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{bus.route}</p>
                                </div>
                            </div>
                        ))}
                        {liveFleet.length === 0 && <p className="text-center text-gray-500 py-10">No buses currently on route.</p>}
                    </div>
                </div>
                 <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                     <h2 className="text-xl font-bold dark:text-white mb-4">Top Drivers</h2>
                     <div className="space-y-3">
                        {driverLeaderboard.map((driver: any, index: number) => (
                            <div key={driver.id || index} className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                <span className="font-bold text-lg text-gray-400 w-5">#{index + 1}</span>
                                <img src={driver.avatar_url} alt={driver.name} className="w-10 h-10 rounded-full"/>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm dark:text-white">{driver.name}</p>
                                </div>
                            </div>
                        ))}
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