import React, { useState } from 'react';
import { CurrencyDollarIcon, TagIcon, BriefcaseIcon, ChartBarIcon } from '../components/icons';
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
    { id: 'TXN123', type: 'Ticket Sale', company: 'Volcano Express', amount: 4500, date: '2024-10-28' },
    { id: 'TXN124', type: 'Agent Commission', agent: 'Jane Smith', amount: -225, date: '2024-10-28' },
    { id: 'TXN125', type: 'Company Payout', company: 'RITCO', amount: -1850000, date: '2024-10-27' },
    { id: 'TXN126', type: 'Ticket Sale', company: 'Horizon Express', amount: 3500, date: '2024-10-27' },
];

const AdminFinancials: React.FC = () => {
    const [activeRange, setActiveRange] = useState('30 Days');

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold dark:text-gray-200">Platform Financials</h1>
                <DateRangePicker onRangeChange={setActiveRange} activeRange={activeRange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard title="Total Revenue" value="25.8M RWF" icon={<CurrencyDollarIcon className="w-6 h-6 text-blue-600"/>} />
                <StatCard title="Commissions Paid" value="1.2M RWF" icon={<BriefcaseIcon className="w-6 h-6 text-blue-600"/>} />
                <StatCard title="Company Payouts" value="18.5M RWF" icon={<ChartBarIcon className="w-6 h-6 text-blue-600"/>} />
                <StatCard title="Promotions Used" value="85,000 RWF" icon={<TagIcon className="w-6 h-6 text-blue-600"/>} />
            </div>
            
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold dark:text-white mb-4">Recent Transactions</h2>
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
                                   <td>{tx.company || tx.agent}</td>
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

export default AdminFinancials;