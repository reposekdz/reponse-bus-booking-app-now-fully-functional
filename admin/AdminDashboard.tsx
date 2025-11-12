
import React, { useState, useEffect } from 'react';
import { ChartBarIcon, UsersIcon, BuildingOfficeIcon, BriefcaseIcon, CheckCircleIcon, CurrencyDollarIcon } from '../components/icons';
import ActivityFeed from '../components/ActivityFeed';
import LiveSalesTicker from '../components/LiveSalesTicker';
import { api } from '../lib/api';

const StatCard = ({ title, value, icon, change, changeType }) => (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
        <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
        </div>
        <div className={`text-xs mt-2 font-semibold ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
            {change} vs last month
        </div>
    </div>
);

const BarChart = ({ data, dataKey, labelKey, title, colorClass }) => {
    const maxValue = Math.max(...data.map(d => d[dataKey]));
    return (
        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg h-full flex flex-col">
            <h3 className="font-bold mb-4 dark:text-white">{title}</h3>
            <div className="flex-grow flex items-end space-x-2">
                {data.map(item => (
                    <div key={item[labelKey]} className="flex-1 flex flex-col items-center justify-end group">
                        <div className="text-xs font-bold text-gray-800 dark:text-white bg-white/50 dark:bg-black/20 px-2 py-1 rounded-md mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {new Intl.NumberFormat().format(item[dataKey])}
                        </div>
                        <div className={`w-full ${colorClass} rounded-t-lg hover:opacity-80 transition-opacity`} style={{height: `${(item[dataKey] / (maxValue || 1)) * 100}%`}}></div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item[labelKey]}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SystemHealth = () => (
    <div className="bg-white dark:bg-gray-800/50 p-4 rounded-2xl shadow-lg flex items-center justify-between">
        <h3 className="text-lg font-bold dark:text-white">System Health</h3>
        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-sm">API: Normal</span></div>
            <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-sm">Payments: Normal</span></div>
        </div>
        <div className="flex items-center space-x-2 text-green-500 font-bold">
            <CheckCircleIcon className="w-6 h-6"/>
            <span>All Systems Operational</span>
        </div>
    </div>
);

const highValueTransactions = [
    { id: 'TXN-HV-01', type: 'Company Payout', target: 'RITCO', amount: -1850000, time: '2h ago' },
    { id: 'TXN-HV-02', type: 'Charter Booking', target: 'Corporate Client A', amount: 850000, time: '5h ago' },
    { id: 'TXN-HV-03', type: 'Agent Deposit', target: 'Jane Smith', amount: 250000, time: 'Yesterday' },
];

const AdminDashboard: React.FC = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await api.getAdminDashboardAnalytics();
                setDashboardData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return <div className="dark:text-white">Loading dashboard data...</div>;
    }
    
    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    const { stats, revenueData, passengerData, companyRevenue } = dashboardData;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold dark:text-gray-200">Admin Overview</h1>
            <LiveSalesTicker />
            <SystemHealth />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value="25.8M RWF" icon={<ChartBarIcon className="w-6 h-6 text-blue-600"/>} change="+5.2%" changeType="increase" />
                <StatCard title="Total Passengers" value="8.6M" icon={<UsersIcon className="w-6 h-6 text-blue-600"/>} change="+2.1%" changeType="increase" />
                <StatCard title="Active Companies" value={stats.companies} icon={<BuildingOfficeIcon className="w-6 h-6 text-blue-600"/>} change="+1" changeType="increase" />
                <StatCard title="Registered Agents" value="2" icon={<BriefcaseIcon className="w-6 h-6 text-blue-600"/>} change="+0%" changeType="increase" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6" style={{ minHeight: '300px' }}>
                    <BarChart data={revenueData} dataKey="revenue" labelKey="day" title="Weekly Revenue (Millions RWF)" colorClass="bg-green-400 dark:bg-green-800" />
                    <BarChart data={passengerData} dataKey="passengers" labelKey="day" title="Weekly Passengers" colorClass="bg-blue-400 dark:bg-blue-800"/>
                </div>
                 <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                    <h3 className="font-bold mb-4 dark:text-white">Recent High-Value Transactions</h3>
                    <div className="space-y-4">
                        {highValueTransactions.map(tx => (
                            <div key={tx.id} className="flex items-center space-x-3">
                                <div className={`p-2 rounded-full ${tx.amount > 0 ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                                    <CurrencyDollarIcon className={`w-5 h-5 ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold dark:text-white">{tx.type}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{tx.target}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-mono text-sm font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>{new Intl.NumberFormat('fr-RW').format(tx.amount)}</p>
                                    <p className="text-xs text-gray-400">{tx.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <BarChart data={companyRevenue} dataKey="revenue" labelKey="name" title="Revenue by Company (Billions RWF)" colorClass="bg-indigo-400 dark:bg-indigo-800"/>
                </div>
                <ActivityFeed />
            </div>
        </div>
    );
};

export default AdminDashboard;
      