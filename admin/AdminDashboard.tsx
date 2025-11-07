import React from 'react';
import { ChartBarIcon, UsersIcon, BuildingOfficeIcon, BriefcaseIcon, CheckCircleIcon, CurrencyDollarIcon } from '../components/icons';
import ActivityFeed from '../components/ActivityFeed';

export const mockCompaniesData = [
  { id: 'volcano', name: 'Volcano Express', status: 'Active', totalRevenue: 5_800_000_000, totalPassengers: 3_500_000, routesCount: 30, logoUrl: 'https://pbs.twimg.com/profile_images/1237839357116452865/p-28c8o-_400x400.jpg', coverUrl: 'https://images.unsplash.com/photo/1593256398246-8853b3815c32?q=80&w=2070&auto=format&fit=crop', description: 'Volcano Express is one of the most popular transport companies in Rwanda, known for its excellent service, cleanliness, and punctuality.' },
  { id: 'ritco', name: 'RITCO', status: 'Active', totalRevenue: 8_200_000_000, totalPassengers: 2_100_000, routesCount: 25, logoUrl: 'https://www.ritco.rw/wp-content/uploads/2021/04/ritco-logo-single.png', coverUrl: 'https://images.unsplash.com/photo/1544620347-c4fd4a3d5957?q=80&w=2048&auto=format&fit=crop', description: 'RITCO is a public-private partnership providing reliable country-wide transportation with a modern fleet of large buses.' },
  { id: 'horizon', name: 'Horizon Express', status: 'Active', totalRevenue: 3_100_000_000, totalPassengers: 1_800_000, routesCount: 22, logoUrl: 'https://media.licdn.com/dms/image/C4D0BAQHL8G_LgDIeew/company-logo_200_200/0/1630656360706/horizon_express_ltd_logo?e=2147483647&v=beta&t=o1QkClM7J5Z8Y4b3b2A1e2a5f6a8b7c5d4e3f2a1', coverUrl: 'https://images.unsplash.com/photo/1605641793224-6512a_d8363b?q=80&w=1974&auto=format&fit=crop', description: 'Horizon Express connects major towns with a focus on customer comfort and safety.' },
  { id: 'stellart', name: 'STELLART', status: 'Inactive', totalRevenue: 1_500_000_000, totalPassengers: 950_000, routesCount: 15, logoUrl: 'https://pbs.twimg.com/profile_images/1364539655823495169/DE-O7wXJ_400x400.jpg', coverUrl: 'https://images.unsplash.com/photo/1616372819235-9b2e1577a2d4?q=80&w=2070&auto=format&fit=crop', description: 'STELLART provides affordable travel options across the country.' },
  { id: 'kbs', name: 'Kigali Bus Services', status: 'Active', totalRevenue: 4_500_000_000, totalPassengers: 4_200_000, routesCount: 45, logoUrl: 'https://www.kigalitoday.com/IMG/arton42907.jpg?1688975878', coverUrl: 'https://live.staticflickr.com/4379/36598511743_3276841c30_b.jpg', description: 'The primary public transport provider within Kigali city and its surroundings.' },
];

export const mockDriversData = [
    { 
        id: 'd1', 
        name: 'John Doe', 
        companyId: 'volcano', 
        assignedBusId: 'RAD 123 B', 
        phone: '0788111222', 
        status: 'Active', 
        avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
        coverUrl: 'https://images.unsplash.com/photo/1533104816-588941750c11?q=80&w=1974&auto=format&fit=crop',
        performance: { onTimeRate: 98.5, averageRating: 4.8, completionRate: 100, safetyScore: 99, totalTrips: 245 },
        tripHistory: [
            {id: 'TRIP-501', route: 'Kigali - Rubavu', date: '2024-10-28', status: 'Completed', passengers: 54},
            {id: 'TRIP-504', route: 'Kigali - Rubavu', date: '2024-10-29', status: 'Upcoming', passengers: 0},
        ],
        documents: [{id: 'DL-RW-12345', name: 'Driver\'s License Category D', expiry: '2026-08-15'}]
    },
    { 
        id: 'd2', 
        name: 'Peter Jones', 
        companyId: 'ritco', 
        assignedBusId: 'RAF 456 C', 
        phone: '0788333444', 
        status: 'Active', 
        avatarUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
        coverUrl: 'https://images.unsplash.com/photo/1611316217997-d4a9893952f4?q=80&w=2070&auto=format&fit=crop',
        performance: { onTimeRate: 95.2, averageRating: 4.6, completionRate: 99, safetyScore: 95, totalTrips: 180 },
        tripHistory: [{id: 'TRIP-601', route: 'Kigali - Huye', date: '2024-10-28', status: 'Completed', passengers: 60}],
        documents: [{id: 'DL-RW-67890', name: 'Driver\'s License Category D', expiry: '2027-01-20'}]
    },
    { 
        id: 'd3', 
        name: 'Mary Anne', 
        companyId: 'volcano', 
        assignedBusId: 'RAE 789 A', 
        phone: '0788555666', 
        status: 'On Leave', 
        avatarUrl: 'https://randomuser.me/api/portraits/women/6.jpg',
        coverUrl: 'https://images.unsplash.com/photo/1605641793224-6512a_d8363b?q=80&w=1974&auto=format&fit=crop',
        performance: { onTimeRate: 99.1, averageRating: 4.9, completionRate: 100, safetyScore: 100, totalTrips: 312 },
        tripHistory: [{id: 'TRIP-701', route: 'Kigali - Musanze', date: '2024-10-27', status: 'Completed', passengers: 25}],
        documents: [{id: 'DL-RW-11223', name: 'Driver\'s License Category D', expiry: '2025-05-10'}]
    },
];


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
    const revenueData = [{ day: 'Mon', revenue: 3.5 }, { day: 'Tue', revenue: 4.2 }, { day: 'Wed', revenue: 3.9 }, { day: 'Thu', revenue: 5.1 }, { day: 'Fri', revenue: 6.8 }, { day: 'Sat', revenue: 8.2 }, { day: 'Sun', revenue: 7.5 }];
    const passengerData = [{ day: 'Mon', passengers: 1200 }, { day: 'Tue', passengers: 1500 }, { day: 'Wed', passengers: 1400 }, { day: 'Thu', passengers: 1800 }, { day: 'Fri', passengers: 2500 }, { day: 'Sat', passengers: 3200 }, { day: 'Sun', passengers: 2800 }];
    const companyRevenue = [{ name: 'VOL', revenue: 5.8 }, { name: 'RIT', revenue: 8.2 }, { name: 'HOR', revenue: 3.1 }, { name: 'KBS', revenue: 4.5 }];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold dark:text-gray-200">Admin Overview</h1>
            <SystemHealth />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value="25.8M RWF" icon={<ChartBarIcon className="w-6 h-6 text-blue-600"/>} change="+5.2%" changeType="increase" />
                <StatCard title="Total Passengers" value="8.6M" icon={<UsersIcon className="w-6 h-6 text-blue-600"/>} change="+2.1%" changeType="increase" />
                <StatCard title="Active Companies" value="5" icon={<BuildingOfficeIcon className="w-6 h-6 text-blue-600"/>} change="+1" changeType="increase" />
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
