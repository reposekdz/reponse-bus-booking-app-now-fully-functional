import React from 'react';
import { ChartBarIcon, UsersIcon, BusIcon, BriefcaseIcon } from '../components/icons';
import ActivityFeed from '../components/ActivityFeed';

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

// FIX: Explicitly type the 'format' prop to match allowed values for Intl.NumberFormatOptions.notation.
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
    const totalRevenue = companies.reduce((acc, c) => acc + c.totalRevenue, 0);
    const totalPassengers = companies.reduce((acc, c) => acc + c.totalPassengers, 0);

    const passengerGrowthData = [
        { month: 'May', passengers: 180000 },
        { month: 'Jun', passengers: 250000 },
        { month: 'Jul', passengers: 220000 },
        { month: 'Aug', passengers: 310000 },
        { month: 'Sep', passengers: 280000 },
        { month: 'Oct', passengers: 450000 },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500 dark:from-blue-400 dark:to-green-300">Platform Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={totalRevenue} icon={<ChartBarIcon />} format="currency" />
                <StatCard title="Total Passengers" value={totalPassengers} icon={<UsersIcon />} />
                <StatCard title="Active Buses" value={buses.length} icon={<BusIcon />} />
                <StatCard title="Registered Agents" value={agents.length} icon={<BriefcaseIcon />} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                     <BarChart 
                        data={companies}
                        title="Revenue by Company"
                        dataKey="totalRevenue"
                        labelKey="name"
                        colorClass="bg-blue-300 dark:bg-blue-800/80"
                        format="standard"
                    />
                </div>
                 <ActivityFeed />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                     <BarChart 
                        data={passengerGrowthData}
                        title="Monthly Passenger Growth"
                        dataKey="passengers"
                        labelKey="month"
                        colorClass="bg-green-300 dark:bg-green-800/80"
                        format="standard"
                    />
                </div>
                 <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                     <h2 className="text-xl font-bold dark:text-white">Quick Stats</h2>
                     <p className="text-gray-500 dark:text-gray-400 mt-4">More platform statistics will be displayed here...</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;