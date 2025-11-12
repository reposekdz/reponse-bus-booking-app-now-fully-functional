import React, { useState, useEffect, useMemo } from 'react';
import { Page } from './App';
import { WalletIcon } from './components/icons';
import WalletTopUpModal from './components/WalletTopUpModal';
import WalletTransactionCard from './components/WalletTransactionCard';
import { useAuth } from './contexts/AuthContext';
import * as api from './services/apiService';

const WalletPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const { user, setUser } = useAuth();
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const historyData = await api.getWalletHistory();
                setHistory(historyData);
            } catch (error) {
                console.error("Failed to fetch wallet history:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const handleTopUpSuccess = async (amount: number) => {
        setIsTopUpOpen(false);
        try {
            const updatedUser = await api.topUpWallet(amount);
            setUser(updatedUser); // Update the user in AuthContext
            alert(`Successfully added ${new Intl.NumberFormat('fr-RW').format(amount)} RWF to your wallet!`);
            // Refetch history
            const historyData = await api.getWalletHistory();
            setHistory(historyData);
        } catch (error) {
            alert(`Top-up failed: ${error.message}`);
        }
    };
    
    const stats = useMemo(() => {
        if (!history) return { totalSpent: 0, totalTopUps: 0 };
        const totalSpent = history.filter(tx => tx.amount < 0).reduce((sum, tx) => sum + tx.amount, 0);
        const totalTopUps = history.filter(tx => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
        return { totalSpent, totalTopUps };
    }, [history]);

    return (
        <>
            <div className="bg-gray-100/50 dark:bg-gray-900/50 min-h-screen">
                <header className="bg-white dark:bg-gray-800 shadow-sm pt-12 pb-8">
                    <div className="container mx-auto px-6">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">My Wallet</h1>
                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Manage your funds and view your transaction history.</p>
                    </div>
                </header>
                <main className="container mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Balance and Stats */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-xl p-8">
                                <WalletIcon className="w-10 h-10 mb-4 opacity-70"/>
                                <p className="text-lg opacity-80">Current Balance</p>
                                <p className="text-5xl font-bold tracking-tight">{new Intl.NumberFormat('fr-RW').format(user?.walletBalance || 0)} <span className="text-3xl opacity-80">RWF</span></p>
                                <button onClick={() => setIsTopUpOpen(true)} className="mt-6 w-full py-3 bg-white/20 backdrop-blur-sm font-bold rounded-lg hover:bg-white/30 transition">
                                    Add Funds
                                </button>
                            </div>
                             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                <h3 className="font-bold mb-4 dark:text-white">This Month's Summary</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm items-center">
                                        <span className="text-gray-500 dark:text-gray-400">Total Spent</span>
                                        <span className="font-semibold text-red-500">{new Intl.NumberFormat('fr-RW').format(stats.totalSpent)} RWF</span>
                                    </div>
                                    <div className="flex justify-between text-sm items-center">
                                        <span className="text-gray-500 dark:text-gray-400">Total Top-ups</span>
                                        <span className="font-semibold text-green-600">{new Intl.NumberFormat('fr-RW').format(stats.totalTopUps)} RWF</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: History */}
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                             <h2 className="text-xl font-bold dark:text-white mb-4">Transaction History</h2>
                             {isLoading ? (
                                <p>Loading history...</p>
                             ) : (
                                <div className="space-y-3 max-h-[30rem] overflow-y-auto custom-scrollbar pr-2">
                                    {history.length > 0 ? (
                                        history.map(tx => <WalletTransactionCard key={tx._id} transaction={tx} />)
                                    ) : (
                                        <p className="text-center text-gray-500 py-8">No transactions yet.</p>
                                    )}
                                </div>
                             )}
                        </div>
                    </div>
                </main>
            </div>
            {isTopUpOpen && (
                <WalletTopUpModal 
                    onClose={() => setIsTopUpOpen(false)}
                    onSuccess={handleTopUpSuccess}
                    userPin={user?.pin || '1234'}
                />
            )}
        </>
    );
};

export default WalletPage;