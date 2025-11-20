
import React, { useState, useEffect } from 'react';
import { ChartBarIcon, UsersIcon, BuildingOfficeIcon, BriefcaseIcon, CheckCircleIcon, CurrencyDollarIcon, BellAlertIcon } from '../components/icons';
import ActivityFeed from '../components/ActivityFeed';
import LiveSalesTicker from '../components/LiveSalesTicker';
import * as api from '../services/apiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';

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
        {change && <div className={`text-xs mt-2 font-semibold ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
            {change} vs last month
        </div>}
    </div>
);

// Enhanced SVG Chart Component
const RevenueChart = ({ data, title }) => {
    const width = 600;
    const height = 200;
    const padding = 20;

    if (!data || !Array.isArray(data) || data.length === 0) return (
        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg h-full flex flex-col items-center justify-center">
            <h3 className="font-bold mb-4 dark:text-white self-start">{title}</h3>
            <div className="flex-grow flex items-center justify-center w-full h-[200px] bg-gray-50 dark:bg-gray-700/20 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">No data available for chart.</p>
            </div>
        </div>
    );
    
    const maxValue = Math.max(...data.map((d: any) => d.revenue || 0));
    const safeMax = maxValue === 0 ? 100 : maxValue;
    
    const points = data.map((d: any, i: number) => {
        const x = padding + (i * (width - 2 * padding) / (data.length > 1 ? data.length - 1 : 1));
        const y = height - padding - (((d.revenue || 0) / safeMax) * (height - 2 * padding));
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg h-full flex flex-col">
            <h3 className="font-bold mb-4 dark:text-white">{title}</h3>
            <div className="flex-grow relative w-full">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                    <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e5e7eb" strokeWidth="1" />
                    <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e5e7eb" strokeWidth="1" />
                    
                    <path 
                        d={`M${padding},${height - padding} ${points} L${width - padding},${height - padding} Z`} 
                        fill="url(#gradient)" 
                        className="opacity-50"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5"/>
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                        </linearGradient>
                    </defs>

                    <polyline fill="none" stroke="#3b82f6" strokeWidth="3" points={points} strokeLinecap="round" strokeLinejoin="round"/>

                    {data.map((d: any, i: number) => {
                        const x = padding + (i * (width - 2 * padding) / (data.length > 1 ? data.length - 1 : 1));
                        const y = height - padding - (((d.revenue || 0) / safeMax) * (height - 2 * padding));
                        return (
                            <g key={i} className="group">
                                <circle cx={x} cy={y} r="4" fill="#3b82f6" className="group-hover:r-6 transition-all duration-200 cursor-pointer" />
                                <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                    <rect x={x - 40} y={y - 45} width="80" height="35" rx="4" fill="#1f2937" />
                                    <text x={x} y={y - 25} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                                        {new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(d.revenue || 0)}
                                    </text>
                                    <text x={x} y={y - 12} textAnchor="middle" fill="#9ca3af" fontSize="10">
                                        {d.day}
                                    </text>
                                </g>
                            </g>
                        );
                    })}
                </svg>
                <div className="flex justify-between mt-2 px-2 text-xs text-gray-500">
                    {data.map((d: any) => <span key={d.day}>{d.day}</span>)}
                </div>
            </div>
        </div>
    );
};

const SystemAlertsTicker = () => (
    <div className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-3 shadow-md mb-4 overflow-hidden">
        <BellAlertIcon className="w-5 h-5 animate-pulse" />
        <div className="whitespace-nowrap animate-marquee">
            <span className="font-bold">SYSTEM ALERT:</span> High traffic expected on Kigali-Musanze route due to upcoming event. Ensure server capacity. | <span className="font-bold">MAINTENANCE:</span> Scheduled DB backup at 03:00 AM.
        </div>
        <style>{`
            @keyframes marquee {
                0% { transform: translateX(100%); }
                100% { transform: translateX(-100%); }
            }
            .animate-marquee {
                animation: marquee 20s linear infinite;
                width: 100%;
            }
        `}</style>
    </div>
);


const SystemHealth = ({ t }) => (
    <div className="bg-white dark:bg-gray-800/50 p-4 rounded-2xl shadow-lg flex items-center justify-between">
        <h3 className="text-lg font-bold dark:text-white">{t('admin_system_health')}</h3>
        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div><span className="text-sm">API: Normal</span></div>
            <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div><span className="text-sm">Payments: Normal</span></div>
        </div>
        <div className="flex items-center space-x-2 text-green-500 font-bold">
            <CheckCircleIcon className="w-6 h-6"/>
            <span>{t('admin_system_operational')}</span>
        </div>
    </div>
);

const AdminDashboard: React.FC = () => {
    const { t } = useLanguage();
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await api.adminGetDashboardAnalytics();
                setDashboardData(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }
    
    if (error) {
        return <div className="text-red-500 p-6">Error: {error}</div>;
    }

    if (!dashboardData) {
        return <div className="p-6">No data available.</div>
    }

    const { stats, revenueData, companyRevenue, highValueTransactions } = dashboardData;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <h1 className="text-3xl font-bold dark:text-gray-200">{t('admin_overview')}</h1>
                <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
            </div>
            
            <SystemAlertsTicker />
            <LiveSalesTicker />
            <SystemHealth t={t} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title={t('admin_stat_revenue')} value={`${new Intl.NumberFormat('fr-RW', { notation: "compact" }).format(stats.totalRevenue)} RWF`} icon={<ChartBarIcon className="w-6 h-6 text-blue-600"/>} change="+12%" changeType="increase" />
                <StatCard title={t('admin_stat_passengers')} value={stats.totalPassengers} icon={<UsersIcon className="w-6 h-6 text-blue-600"/>} change="+5%" changeType="increase" />
                <StatCard title={t('admin_stat_companies')} value={stats.companies} icon={<BuildingOfficeIcon className="w-6 h-6 text-blue-600"/>} change="+1" changeType="increase" />
                <StatCard title={t('admin_stat_agents')} value={stats.agents} icon={<BriefcaseIcon className="w-6 h-6 text-blue-600"/>} change="+0" changeType="increase" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2" style={{ minHeight: '350px' }}>
                    <RevenueChart data={revenueData} title={t('admin_chart_revenue')} />
                </div>
                 <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                    <h3 className="font-bold mb-4 dark:text-white">{t('admin_high_value_tx')}</h3>
                    <div className="space-y-4 max-h-[280px] overflow-y-auto custom-scrollbar pr-2">
                        {highValueTransactions && highValueTransactions.length > 0 ? highValueTransactions.map((tx: any) => (
                            <div key={tx.id} className="flex items-center space-x-3 border-b border-gray-100 dark:border-gray-700/50 pb-2 last:border-0">
                                <div className={`p-2 rounded-full ${tx.amount > 0 ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                                    <CurrencyDollarIcon className={`w-5 h-5 ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold dark:text-white truncate">{tx.description || tx.type}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(tx.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-mono text-sm font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>{new Intl.NumberFormat('fr-RW').format(Math.abs(tx.amount))}</p>
                                </div>
                            </div>
                        )) : <p className="text-gray-500 text-sm">No recent high-value transactions.</p>}
                    </div>
                </div>
            </div>
            
            {/* Live Traffic Heatmap Placeholder */}
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                 <h3 className="font-bold mb-4 dark:text-white">Live Traffic Heatmap (Rwanda)</h3>
                 <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden group">
                     <img src="https://www.researchgate.net/publication/322968537/figure/fig1/AS:631631525920800@1527604113101/Administrative-map-of-Rwanda-showing-the-four-provinces-and-the-capital-city-Kigali.png" alt="Map" className="w-full h-full object-cover opacity-30"/>
                     <div className="absolute inset-0 flex items-center justify-center">
                         <p className="text-lg font-bold text-gray-500 dark:text-gray-300 bg-white/80 dark:bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">Real-time fleet congestion data visualization enabled</p>
                     </div>
                     {/* Simulated Hotspots */}
                     <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-red-500/30 rounded-full blur-xl animate-pulse"></div>
                     <div className="absolute top-1/3 left-1/3 w-16 h-16 bg-yellow-500/30 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
                 </div>
            </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RevenueChart data={companyRevenue ? companyRevenue.map((c:any) => ({ day: c.name, revenue: c.revenue })) : []} title={t('admin_revenue_by_company')} />
                </div>
                <ActivityFeed />
            </div>
        </div>
    );
};

export default AdminDashboard;
