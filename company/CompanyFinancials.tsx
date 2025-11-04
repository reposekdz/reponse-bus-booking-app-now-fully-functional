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

const CompanyFinancials: React.FC = () => {
    const [activeRange, setActiveRange] = useState('30 Days');

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
            
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold dark:text-white mb-4">Transaction History</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="p-3">Date</th>
                                <th className="p-3">Transaction ID</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Details</th>
                                <th className="p-3 text-right">Amount (RWF)</th>
                            </tr>
                        </thead>
                        <tbody>
                           {mockTransactions.map(tx => (
                               <tr key={tx.id} className="border-t dark:border-gray-700">
                                   <td className="p-3 whitespace-nowrap">{new Date(tx.date).toLocaleDateString()}</td>
                                   <td className="font-mono">{tx.id}</td>
                                   <td>{tx.type}</td>
                                   <td>{tx.driver || tx.route}</td>
                                   <td className={`font-mono text-right font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                       {new Intl.NumberFormat('fr-RW').format(tx.amount)}
                                    </td>
                               </tr>
                           ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CompanyFinancials;