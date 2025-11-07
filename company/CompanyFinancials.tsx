
import React, { useState } from 'react';
import { WalletIcon, ChartBarIcon, UsersIcon } from '../components/icons';
import DateRangePicker from '../components/DateRangePicker';

const StatCard = ({ title, value, icon }) => (
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
    </div>
);

const mockTransactions = [
    { id: 'PAYOUT-05', type: 'Driver Payout', driver: 'John Doe', amount: -450000, date: '2024-10-25' },
    { id: 'SALE-831', type: 'Ticket Revenue', route: 'Kigali - Rubavu', amount: 120500, date: '2024-10-25' },
    { id: 'SALE-832', type: 'Ticket Revenue', route: 'Kigali - Musanze', amount: 85000, date: '2024-10-24' },
    { id: 'PAYOUT-04', type: 'Driver Payout', driver: 'Mary Anne', amount: -425000, date: '2024-09-25' },
];

const BarChart = ({ data, dataKey, labelKey, title, colorClass }) => {
    const maxValue = Math.max(...data.map(d => d[dataKey]));
    return (
        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg h-full flex flex-col">
            <h3 className="font-bold mb-4 dark:text-white">{title}</h3>
            <div className="flex-grow flex items-end space-x-2">
                {data.map(item => (
                    <div key={item[labelKey]} className="flex-1 flex flex-col items-center justify-end group">
                        <div className="text-xs font-bold text-gray-800 dark:text-white bg-white/50 dark:bg-black/20 px-2 py-1 rounded-md mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {new Intl.NumberFormat('fr-RW').format(item[dataKey])}
                        </div>
                        <div className={`w-full ${colorClass} rounded-t-lg hover:opacity-80 transition-opacity`} style={{height: `${(item[dataKey] / (maxValue || 1)) * 100}%`}}></div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item[labelKey]}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const CompanyFinancials: React.FC = () => {
    const [activeRange, setActiveRange] = useState('30 Days');
    
    const dailyRevenue = [
        { day: 'W1', revenue: 1200000 }, { day: 'W2', revenue: 1500000 }, { day: 'W3', revenue: 1350000 }, { day: 'W4', revenue: 1550000 }
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold dark:text-gray-200">Financial Overview</h1>
                <DateRangePicker onRangeChange={setActiveRange} activeRange={activeRange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard title="Total Revenue" value="5.6M RWF" icon={<ChartBarIcon className="w-6 h-6 text-blue-600"/>} />
                <StatCard title="Driver Payouts" value="875K RWF" icon={<UsersIcon className="w-6 h-6 text-blue-600"/>} />
                <StatCard title="Platform Fees" value="280K RWF" icon={<WalletIcon className="w-6 h-6 text-blue-600"/>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                     <BarChart data={dailyRevenue} dataKey="revenue" labelKey="day" title={`Revenue (${activeRange})`} colorClass="bg-green-300 dark:bg-green-800/80"/>
                </div>
                 <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold dark:text-white mb-4">Transaction History</h2>
                    <button onClick={() => alert("Downloading report...")} className="w-full text-center py-2 bg-gray-200 dark:bg-gray-700 font-semibold rounded-lg mb-4">Export Report</button>
                    <div className="overflow-y-auto max-h-80 custom-scrollbar pr-2">
                        {mockTransactions.map(tx => (
                           <div key={tx.id} className="border-b dark:border-gray-700 py-2">
                               <div className="flex justify-between items-center">
                                   <p className="font-semibold text-sm dark:text-gray-200">{tx.type}</p>
                                   <p className={`font-mono text-sm font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>{new Intl.NumberFormat('fr-RW').format(tx.amount)}</p>
                               </div>
                               <p className="text-xs text-gray-500">{tx.driver || tx.route}</p>
                           </div>
                       ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyFinancials;
