

import React, { useState } from 'react';
import { ChartBarIcon, UsersIcon, BusIcon, BriefcaseIcon, CurrencyDollarIcon } from '../components/icons';
import ActivityFeed from '../components/ActivityFeed';
import DateRangePicker from '../components/DateRangePicker';

export const mockCompaniesData = [
  { 
    id: 'volcano', 
    name: 'Volcano Express', 
    totalPassengers: 3500000, 
    totalRevenue: 15700000000, 
    routes: [ { from: 'Kigali', to: 'Rubavu', price: '4,500 FRW' }, { from: 'Kigali', to: 'Musanze', price: '3,500 FRW' }, { from: 'Rubavu', to: 'Kigali', price: '4,500 FRW' } ],
    status: 'Active',
    coverUrl: 'https://images.unsplash.com/photo-1593256398246-8853b3815c32?q=80&w=2070&auto=format&fit=crop',
    logoUrl: 'https://seeklogo.com/images/V/volcano-express-logo-F735513A51-seeklogo.com.png',
    description: "Volcano Express ni kimwe mu bigo bikunzwe cyane mu Rwanda, kizwiho serivisi nziza, isuku, no kugera ku gihe. Bakorera mu mihanda myinshi ikomeye."
  },
  { 
    id: 'ritco', 
    name: 'RITCO', 
    totalPassengers: 2100000, 
    totalRevenue: 9400000000, 
    routes: [ { from: 'Kigali', to: 'Huye', price: '3,000 FRW' }, { from: 'Kigali', to: 'Nyungwe', price: '7,000 FRW' }, { from: 'Kigali', to: 'Rusizi', price: '8,000 FRW' }, { from: 'Huye', to: 'Kigali', price: '3,000 FRW' } ],
    status: 'Active',
    coverUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2048&auto=format&fit=crop',
    logoUrl: 'https://www.ritco.rw/wp-content/uploads/2021/03/logo.svg',
    description: "RITCO ni ikigo cya Leta gishinzwe gutwara abantu mu buryo bwa rusange, kizwiho kugira imodoka nini kandi zigezweho zitwara abantu mu gihugu hose."
  },
  { 
    id: 'horizon', 
    name: 'Horizon Express', 
    totalPassengers: 1200000, 
    totalRevenue: 5400000000, 
    routes: [ { from: 'Huye', to: 'Musanze', price: '5,000 FRW' } ],
    status: 'Inactive',
    coverUrl: 'https://images.unsplash.com/photo-1605641793224-6512a8d8363b?q=80&w=1974&auto=format&fit=crop',
    logoUrl: 'https://media.jobinrwanda.com/logo/horizon-express-ltd-1681284534.png',
    description: 'Horizon Express itanga serivisi zo gutwara abantu hagati y\'imijyi itandukanye, cyane cyane mu majyepfo y\'u Rwanda.'
  },
  { 
    id: 'stellart', 
    name: 'STELLART', 
    totalPassengers: 1800000, 
    totalRevenue: 7000000000, 
    routes: [ { from: 'Kigali', to: 'Rusizi', price: '8,500 FRW' } ],
    status: 'Active',
    coverUrl: 'https://images.unsplash.com/photo-1616372819235-9b2e1577a2d4?q=80&w=2070&auto=format&fit=crop',
    logoUrl: '',
    description: 'Stellart itanga ingendo nziza kandi zihuse kuva i Kigali ujya mu bice by\'uburengerazuba.'
  },
];

const StatCard = ({ title, value, icon, format = 'number' }) => {
    const formattedValue = typeof value === 'string' ? value :
        format === 'currency' ? new Intl.NumberFormat('fr-RW', { notation: 'compact' }).format(value) + ' RWF' : new Intl.NumberFormat().format(value);
    return(
        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-gray-200/20 dark:text-gray-900/20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                {React.cloneElement(icon, { className: "w-20 h-20" })}
            </div>
            <div className="relative">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{formattedValue}</p>
            </div>
        </div>
    );
};

const BarChart = ({ data, title, dataKey, labelKey, colorClass, format = 'compact' }: { data: any[], title: string, dataKey: string, labelKey: string, colorClass: string, format?: 'compact' | 'standard' | 'scientific' | 'engineering' }) => {
    const maxValue = Math.max(...data.map(d => d[dataKey]));
    return (
        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
            <h3 className="font-bold mb-4 dark:text-white">{title}</h3>
            <div className="flex items-end h-64 space-x-2">
                {data.map(item => (
                    <div key={item[labelKey]} className="flex-1 flex flex-col items-center justify-end group">
                        <div className="text-xs font-bold text-gray-800 dark:text-white bg-white/50 dark:bg-black/20 px-2 py-1 rounded-md mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {new Intl.NumberFormat('fr-RW', { notation: format }).format(item[dataKey])}
                        </div>
                        <div className={`w-full ${colorClass} rounded-t-lg hover:opacity-80 transition-opacity`} style={{height: `${(item[dataKey] / (maxValue || 1)) * 100}%`}}></div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item[labelKey]}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface AdminDashboardProps {
    companies: any[];
    drivers: any[];
    agents: any[];
    buses: any[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ companies, drivers, agents, buses }) => {
    const [dateRange, setDateRange] = useState('30 Days');
    
    // Mock data based on date range
    const multiplier = dateRange === 'Today' ? 0.03 : dateRange === '7 Days' ? 0.2 : 1;
    const totalRevenue = companies.reduce((acc, c) => acc + c.totalRevenue, 0) * multiplier;
    const totalPassengers = companies.reduce((acc, c) => acc + c.totalPassengers, 0) * multiplier;

    const topRoutes = [
        { name: 'KGL-RBV', revenue: 580000000 * multiplier },
        { name: 'KGL-HYE', revenue: 420000000 * multiplier },
        { name: 'KGL-MSZ', revenue: 350000000 * multiplier },
        { name: 'KGL-RSZ', revenue: 310000000 * multiplier },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500 dark:from-blue-400 dark:to-green-300">Platform Overview</h1>
                <DateRangePicker activeRange={dateRange} onRangeChange={setDateRange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={totalRevenue} icon={<CurrencyDollarIcon />} format="currency" />
                <StatCard title="Total Passengers" value={totalPassengers} icon={<UsersIcon />} />
                <StatCard title="Avg. Occupancy" value={`${(78.5 * (1 + (Math.random() - 0.5) * 0.1)).toFixed(1)}%`} icon={<BusIcon />} format="string"/>
                <StatCard title="Active Users" value={8650 * multiplier} icon={<BriefcaseIcon />} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                     <BarChart 
                        data={companies}
                        title="Revenue by Company"
                        dataKey="totalRevenue"
                        labelKey="name"
                        colorClass="bg-blue-300 dark:bg-blue-800/80"
                        format="compact"
                    />
                </div>
                 <ActivityFeed />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                     <BarChart 
                        data={topRoutes}
                        title="Top Routes by Revenue"
                        dataKey="revenue"
                        labelKey="name"
                        colorClass="bg-green-300 dark:bg-green-800/80"
                        format="compact"
                    />
                </div>
                 <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                     <h2 className="text-xl font-bold dark:text-white">Quick Stats</h2>
                     <div className="space-y-3 mt-4 text-sm">
                         <div className="flex justify-between"><span className="text-gray-500">Companies</span><span className="font-bold dark:text-white">{companies.length}</span></div>
                         <div className="flex justify-between"><span className="text-gray-500">Drivers</span><span className="font-bold dark:text-white">{drivers.length}</span></div>
                         <div className="flex justify-between"><span className="text-gray-500">Agents</span><span className="font-bold dark:text-white">{agents.length}</span></div>
                         <div className="flex justify-between"><span className="text-gray-500">Buses</span><span className="font-bold dark:text-white">{buses.length}</span></div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
