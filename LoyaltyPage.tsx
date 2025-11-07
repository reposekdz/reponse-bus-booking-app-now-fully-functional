import React from 'react';
import { Page } from './App';
import { SparklesIcon, TicketIcon, ArrowDownLeftIcon, UserGroupIcon } from './components/icons';

interface LoyaltyPageProps {
    user: any;
    onNavigate: (page: Page) => void;
}

const mockHistory = [
    { type: 'earn', description: 'Trip to Rubavu', points: 90, date: '2024-10-28' },
    { type: 'referral', description: 'Friend sign-up bonus', points: 500, date: '2024-10-26' },
    { type: 'redeem', description: 'Discount on Huye trip', points: -500, date: '2024-10-22' },
    { type: 'earn', description: 'Trip to Musanze', points: 35, date: '2024-10-15' },
];

const HistoryIcon = ({ type }) => {
    if (type === 'earn') return <TicketIcon className="w-5 h-5 text-green-500"/>;
    if (type === 'referral') return <UserGroupIcon className="w-5 h-5 text-blue-500"/>;
    if (type === 'redeem') return <ArrowDownLeftIcon className="w-5 h-5 text-red-500"/>;
    return null;
}

const LoyaltyPage: React.FC<LoyaltyPageProps> = ({ user, onNavigate }) => {
    const displayUser = user || { loyaltyPoints: 0 };

    return (
        <div className="bg-gray-100/50 dark:bg-gray-900/50 min-h-screen">
            <header className="bg-white dark:bg-gray-800 shadow-sm pt-12 pb-8">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">My GoPoints</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Your loyalty rewards dashboard.</p>
                </div>
            </header>
            <main className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                            <h2 className="text-xl font-bold dark:text-white mb-4">Points History</h2>
                             <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                                {mockHistory.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-full ${item.type === 'earn' ? 'bg-green-100 dark:bg-green-900/50' : item.type === 'referral' ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                                                <HistoryIcon type={item.type}/>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm dark:text-white">{item.description}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(item.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <p className={`font-bold text-lg ${item.points > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                            {item.points > 0 ? '+' : ''}{item.points}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                         <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white rounded-2xl shadow-xl p-8 text-center">
                            <SparklesIcon className="w-10 h-10 mx-auto mb-2"/>
                            <p className="text-lg opacity-90">Current Balance</p>
                            <p className="text-6xl font-bold">{new Intl.NumberFormat().format(displayUser.loyaltyPoints || 0)}</p>
                            <p>GoPoints</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                             <h2 className="text-xl font-bold dark:text-white mb-4">Rewards</h2>
                             <div className="space-y-3">
                                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <p className="font-semibold">500 RWF Discount</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Redeem <span className="font-bold">500 Points</span></p>
                                </div>
                                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <p className="font-semibold">1,000 RWF Discount</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Redeem <span className="font-bold">1,000 Points</span></p>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LoyaltyPage;