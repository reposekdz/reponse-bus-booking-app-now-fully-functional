import React, { useState, useMemo, useRef, useEffect } from 'react';
import { UserCircleIcon, CogIcon, ArrowRightIcon, WalletIcon, ArrowUpRightIcon, ArrowDownLeftIcon, ChatBubbleLeftRightIcon, BellAlertIcon, ChartBarIcon, SearchIcon, BusIcon, BuildingOfficeIcon, MapPinIcon, BriefcaseIcon, LockClosedIcon } from './components/icons';
import StarRating from './components/StarRating';


const user = {
    name: 'Kalisa Jean',
    email: 'kalisa.j@example.com',
    memberSince: 'Mutarama 2023',
    walletPin: '12345' // Hardcoded for simulation
};

const userWallet = {
  balance: 75_500,
  currency: 'RWF',
  serialCode: 'KJ7821',
  transactions: [
    { id: 1, type: 'deposit', description: 'Agent Deposit', amount: 50000, date: '25 Ukwakira, 2024', status: 'completed' },
    { id: 2, type: 'payment', description: 'Itike ya Volcano Express', amount: -9000, date: '25 Ukwakira, 2024', status: 'completed' },
    { id: 3, type: 'transfer_out', description: 'Oherejwe kuri UM1234', amount: -10000, date: '22 Ukwakira, 2024', status: 'completed' },
    { id: 4, type: 'payment', description: 'Itike ya RITCO', amount: -7000, date: '18 Ukwakira, 2024', status: 'completed' }
  ]
};

const userReviews = [
    { id: 1, company: 'Volcano Express', rating: 5, date: '28 Nzeri, 2024', comment: 'Serivisi nziza cyane, bisi zirasukuye kandi zigeze ku gihe. Nzakomeza kubagana!'},
    { id: 2, company: 'RITCO', rating: 4, date: '15 Kanama, 2024', comment: 'Urugendo rwari rwiza muri rusange, ariko interineti ya WiFi ntiyakoraga neza.'},
    { id: 3, company: 'Horizon Express', rating: 5, date: '01 Gicurasi, 2024', comment: 'Bisi nziza cyane kandi zihuta. Umushoferi yari umunyamwuga.'},
];

const travelHistory = [
    { id: 1, company: 'Volcano Express', from: 'Kigali', to: 'Rubavu', date: '2024-10-25', price: 9000, logoUrl: 'https://seeklogo.com/images/V/volcano-express-logo-F735513A51-seeklogo.com.png' },
    { id: 2, company: 'RITCO', from: 'Kigali', to: 'Nyungwe', date: '2024-10-18', price: 7000, logoUrl: 'https://www.ritco.rw/wp-content/uploads/2021/03/logo.svg' },
    { id: 3, company: 'Horizon Express', from: 'Huye', to: 'Musanze', date: '2024-09-15', price: 5000, logoUrl: 'https://media.jobinrwanda.com/logo/horizon-express-ltd-1681284534.png' },
    { id: 4, company: 'Volcano Express', from: 'Kigali', to: 'Musanze', date: '2024-09-10', price: 7000, logoUrl: 'https://seeklogo.com/images/V/volcano-express-logo-F735513A51-seeklogo.com.png' },
    { id: 5, company: 'RITCO', from: 'Kigali', to: 'Huye', date: '2024-08-22', price: 6000, logoUrl: 'https://www.ritco.rw/wp-content/uploads/2021/03/logo.svg' },
    { id: 6, company: 'Volcano Express', from: 'Rubavu', to: 'Kigali', date: '2024-08-05', price: 9000, logoUrl: 'https://seeklogo.com/images/V/volcano-express-logo-F735513A51-seeklogo.com.png' },
    { id: 7, company: 'STELLART', from: 'Kigali', to: 'Rusizi', date: '2024-07-19', price: 8500, logoUrl: null },
    { id: 8, company: 'RITCO', from: 'Huye', to: 'Kigali', date: '2024-07-02', price: 6000, logoUrl: 'https://www.ritco.rw/wp-content/uploads/2021/03/logo.svg' },
];

const StatCard: React.FC<{title: string; value: string; icon: React.ReactNode}> = ({ title, value, icon }) => (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl flex items-center space-x-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-lg font-bold text-gray-800 dark:text-white">{value}</p>
        </div>
    </div>
);


const TabButton: React.FC<{label: string; isActive: boolean; onClick: () => void, icon: React.FC<{className?: string}>}> = ({ label, isActive, onClick, icon: Icon}) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 flex items-center space-x-2 ${isActive ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
        <Icon className="w-5 h-5" />
        <span>{label}</span>
    </button>
);

const TransactionIcon: React.FC<{ type: string }> = ({ type }) => {
    const baseClasses = "w-10 h-10 rounded-full flex items-center justify-center mr-4";
    if (type === 'deposit') {
        return <div className={`${baseClasses} bg-green-100 dark:bg-green-900/50`}><ArrowDownLeftIcon className="w-5 h-5 text-green-500" /></div>;
    }
    if (type === 'payment' || type === 'transfer_out') {
         return <div className={`${baseClasses} bg-red-100 dark:bg-red-900/50`}><ArrowUpRightIcon className="w-5 h-5 text-red-500" /></div>;
    }
    return <div className={`${baseClasses} bg-gray-100 dark:bg-gray-700`}><WalletIcon className="w-5 h-5 text-gray-500" /></div>;
}

const SettingToggle: React.FC<{ label: string; description: string; enabled: boolean; onToggle: () => void }> = ({ label, description, enabled, onToggle }) => (
    <div className="flex items-center justify-between py-3">
        <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">{label}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <button onClick={onToggle} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

const WalletPinScreen: React.FC<{ onUnlock: () => void; pinToMatch: string }> = ({ onUnlock, pinToMatch }) => {
    const [pin, setPin] = useState<string[]>(Array(5).fill(''));
    const [error, setError] = useState('');
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (/^[0-9]$/.test(value) || value === '') {
            const newPin = [...pin];
            newPin[index] = value;
            setPin(newPin);

            if (value && index < 4) {
                inputsRef.current[index + 1]?.focus();
            }
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    }

    const handleSubmit = () => {
        if (pin.join('') === pinToMatch) {
            onUnlock();
        } else {
            setError('PIN itariyo. Ongera ugerageze.');
            setPin(Array(5).fill(''));
            inputsRef.current[0]?.focus();
        }
    }

    return (
        <div className="text-center max-w-sm mx-auto py-8">
            <LockClosedIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold dark:text-white">Fungura Ikofi Yawe</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Shyiramo PIN yawe y'imibare 5 kugira ngo urebe amafaranga yawe.</p>
            <div className="flex justify-center space-x-3 mb-4">
                {pin.map((digit, index) => (
                    <input
                        key={index}
                        ref={el => inputsRef.current[index] = el}
                        type="password"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handlePinChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="w-12 h-14 text-center text-2xl font-bold bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                ))}
            </div>
             {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button onClick={handleSubmit} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">Fungura</button>
        </div>
    );
};


const ProfilePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('analytics');
    const [searchTerm, setSearchTerm] = useState('');
    const [isWalletUnlocked, setIsWalletUnlocked] = useState(false);
    const [notificationSettings, setNotificationSettings] = useState({
        promotions: true,
        tripReminders: true,
        accountUpdates: false
    });
    
    const analytics = useMemo(() => {
        const companyCounts = travelHistory.reduce((acc: Record<string, number>, trip) => {
            acc[trip.company] = (acc[trip.company] || 0) + 1;
            return acc;
        }, {});
        const favoriteCompany = Object.keys(companyCounts).length > 0 ? Object.keys(companyCounts).reduce((a, b) => companyCounts[a] > companyCounts[b] ? a : b) : 'N/A';

        const destinationCounts = travelHistory.reduce((acc: Record<string, number>, trip) => {
            acc[trip.to] = (acc[trip.to] || 0) + 1;
            return acc;
        }, {});
        const mostVisitedCity = Object.keys(destinationCounts).length > 0 ? Object.keys(destinationCounts).reduce((a, b) => destinationCounts[a] > destinationCounts[b] ? a : b) : 'N/A';

        const monthlySpending = travelHistory.reduce((acc: Record<string, number>, trip) => {
            const month = new Date(trip.date).toLocaleString('default', { month: 'short', year: '2-digit' });
            acc[month] = (acc[month] || 0) + trip.price;
            return acc;
// FIX: Explicitly type the initial value for reduce to ensure correct type inference for monthlySpending.
        }, {} as Record<string, number>);

        return { favoriteCompany, mostVisitedCity, monthlySpending };
    }, []);

    const maxSpending = Math.max(0, ...Object.values(analytics.monthlySpending));
    
    const filteredHistory = useMemo(() => {
        if (!searchTerm) return travelHistory;
        return travelHistory.filter(trip => 
            trip.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.to.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const summaryByCompany = useMemo(() => {
        const summary = travelHistory.reduce<Record<string, { count: number; totalSpent: number; destinations: Set<string>, logoUrl: string | null }>>((acc, trip) => {
            if (!acc[trip.company]) {
                acc[trip.company] = { count: 0, totalSpent: 0, destinations: new Set(), logoUrl: trip.logoUrl };
            }
            acc[trip.company].count += 1;
            acc[trip.company].totalSpent += trip.price;
            acc[trip.company].destinations.add(trip.to);
            return acc;
        }, {});

        return Object.entries(summary).map(([name, data]) => ({
            name,
            ...data,
            destinations: Array.from(data.destinations)
        })).sort((a,b) => b.count - a.count);
    }, []);

     const summaryByDestination = useMemo(() => {
        const summary = travelHistory.reduce<Record<string, { count: number; companies: Set<string> }>>((acc, trip) => {
            if (!acc[trip.to]) {
                acc[trip.to] = { count: 0, companies: new Set() };
            }
            acc[trip.to].count += 1;
            acc[trip.to].companies.add(trip.company);
            return acc;
        }, {});

        return Object.entries(summary).map(([name, data]) => ({
            name,
            ...data,
            companies: Array.from(data.companies)
        })).sort((a,b) => b.count - a.count);
    }, []);


    const handleToggle = (setting: keyof typeof notificationSettings) => {
        setNotificationSettings(prev => ({...prev, [setting]: !prev[setting]}));
    }

    return (
        <div className="bg-gray-100/50 dark:bg-gray-900/50 min-h-full py-12">
            <div className="container mx-auto px-6">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg flex-shrink-0">
                        KJ
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white text-center sm:text-left">{user.name}</h1>
                        <p className="text-gray-600 dark:text-gray-400 text-center sm:text-left">{user.email}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                        <div className="flex items-center space-x-2 overflow-x-auto custom-scrollbar pb-2">
                           <TabButton label="Uko Ugena" isActive={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={ChartBarIcon}/>
                           <TabButton label="Amateka" isActive={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={BriefcaseIcon}/>
                           <TabButton label="Ikofi & Ibikorwa" isActive={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} icon={WalletIcon} />
                           <TabButton label="Ibisubizo Byanjye" isActive={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} icon={ChatBubbleLeftRightIcon}/>
                           <TabButton label="Iboneza" isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={CogIcon} />
                        </div>
                    </div>
                    
                    {activeTab === 'analytics' && (
                        <div className="animate-fade-in space-y-8">
                            <div>
                                <h3 className="text-xl font-bold mb-4 dark:text-white">Imibare y'Ingendo</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <StatCard title="Ingendo Zose" value={travelHistory.length.toString()} icon={<BusIcon className="w-6 h-6 text-blue-600" />} />
                                    <StatCard title="Ikigo Ukunda" value={analytics.favoriteCompany} icon={<BuildingOfficeIcon className="w-6 h-6 text-blue-600" />} />
                                    <StatCard title="Aho Ujya Cyane" value={analytics.mostVisitedCity} icon={<MapPinIcon className="w-6 h-6 text-blue-600" />} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-4 dark:text-white">Amafaranga Wakoresheje</h3>
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                                    <div className="flex items-end h-48 space-x-2">
                                        {Object.entries(analytics.monthlySpending).map(([month, amount]) => (
                                            <div key={month} className="flex-1 flex flex-col items-center justify-end group">
                                                <div className="text-xs font-bold text-gray-800 dark:text-white bg-white/50 dark:bg-black/20 px-2 py-1 rounded-md mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {new Intl.NumberFormat('fr-RW').format(amount)}
                                                </div>
                                                <div className="w-full bg-blue-200 dark:bg-blue-800/80 rounded-t-lg hover:bg-blue-300 dark:hover:bg-blue-700 transition-colors" style={{height: `${(amount / (maxSpending || 1)) * 100}%`}}></div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{month}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'history' && (
                        <div className="animate-fade-in space-y-8">
                             <div>
                                <h3 className="text-xl font-bold mb-4 dark:text-white">Amateka y'Ingendo (byose)</h3>
                                <div className="relative mb-4">
                                     <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input 
                                        type="text"
                                        placeholder="Shakisha ikigo, aho wavuye, cyangwa aho wagiye..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-yellow-500"
                                    />
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th className="px-4 py-3">Ikigo</th>
                                                <th className="px-4 py-3">Urugendo</th>
                                                <th className="px-4 py-3">Itariki</th>
                                                <th className="px-4 py-3 text-right">Igiciro</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredHistory.map(trip => (
                                                <tr key={trip.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white flex items-center space-x-3">
                                                        {trip.logoUrl ? <img src={trip.logoUrl} alt={trip.company} className="w-6 h-6 object-contain"/> : <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full"></div>}
                                                        <span>{trip.company}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{trip.from} &rarr; {trip.to}</td>
                                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{new Date(trip.date).toLocaleDateString('en-GB', {day:'2-digit', month: 'short', year: 'numeric'})}</td>
                                                    <td className="px-4 py-3 font-semibold text-right text-gray-800 dark:text-gray-200">{new Intl.NumberFormat('fr-RW').format(trip.price)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-xl font-bold mb-4 dark:text-white">Incāmunigo ku Kigo</h3>
                                    <div className="space-y-3">
                                        {summaryByCompany.map(company => (
                                            <div key={company.name} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                                <div className="flex items-center space-x-3 mb-3">
                                                    {company.logoUrl ? <img src={company.logoUrl} alt={company.name} className="w-8 h-8 object-contain"/> : <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full"></div>}
                                                    <h4 className="font-bold text-gray-800 dark:text-white">{company.name}</h4>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500 dark:text-gray-400">Ingendo: <span className="font-semibold text-gray-700 dark:text-gray-300">{company.count}</span></span>
                                                    <span className="text-gray-500 dark:text-gray-400">Yose: <span className="font-semibold text-green-600 dark:text-green-400">{new Intl.NumberFormat('fr-RW').format(company.totalSpent)}</span></span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-4 dark:text-white">Incāmunigo ku Cyerekezo</h3>
                                    <div className="space-y-3">
                                        {summaryByDestination.map(dest => (
                                            <div key={dest.name} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <MapPinIcon className="w-6 h-6 text-blue-500"/>
                                                    <h4 className="font-bold text-gray-800 dark:text-white">{dest.name}</h4>
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Ingendo <span className="font-semibold text-gray-700 dark:text-gray-300">{dest.count}</span> wakozeyo</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Via: {dest.companies.join(', ')}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                             </div>
                        </div>
                    )}

                    {activeTab === 'wallet' && (
                        <div className="animate-fade-in">
                        {!isWalletUnlocked ? (
                            <WalletPinScreen onUnlock={() => setIsWalletUnlocked(true)} pinToMatch={user.walletPin} />
                        ) : (
                            <div>
                                <div className="flex justify-end mb-2">
                                    <button onClick={() => setIsWalletUnlocked(false)} className="text-xs font-semibold text-red-500 hover:underline">Funga Ikofi</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-xl shadow-lg">
                                        <p className="text-sm opacity-80">Amafaranga asigaye</p>
                                        <p className="text-4xl font-bold mt-1 mb-4">{new Intl.NumberFormat('fr-RW').format(userWallet.balance)} <span className="text-2xl font-normal opacity-80">{userWallet.currency}</span></p>
                                        <div className="flex space-x-2">
                                            <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition">Bitsa</button>
                                            <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition">Ohereza</button>
                                            <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition">Bikuza</button>
                                        </div>
                                    </div>
                                    <div className="bg-yellow-100 dark:bg-yellow-900/50 p-6 rounded-xl text-center flex flex-col justify-center">
                                        <p className="text-sm text-yellow-800 dark:text-yellow-300 font-semibold">Kode yawe y'umugenzi</p>
                                        <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-200 tracking-widest my-2">{userWallet.serialCode}</p>
                                        <p className="text-xs text-yellow-700 dark:text-yellow-400">Koresha iyi kode kubitsa amafaranga kuri Agent wemewe.</p>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-4 dark:text-white">Ibikorwa bya Vuba</h3>
                                <ul className="space-y-4">
                                {userWallet.transactions.map((tx) => (
                                        <li key={tx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <div className="flex items-center">
                                                <TransactionIcon type={tx.type} />
                                                <div>
                                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{tx.description}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{tx.date}</p>
                                                </div>
                                            </div>
                                            <p className={`font-bold text-sm ${tx.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                                {tx.amount > 0 ? '+' : ''}{new Intl.NumberFormat('fr-RW').format(tx.amount)}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        </div>
                    )}

                     {activeTab === 'reviews' && (
                        <div className="animate-fade-in">
                             <h3 className="text-xl font-bold mb-4 dark:text-white">Ibisubizo watanze</h3>
                             <div className="space-y-4">
                                {userReviews.map(review => (
                                    <div key={review.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border dark:border-gray-700">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-gray-800 dark:text-white">{review.company}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{review.date}</p>
                                            </div>
                                            <StarRating rating={review.rating} size="small" />
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 italic">"{review.comment}"</p>
                                    </div>
                                ))}
                             </div>
                        </div>
                     )}
                    
                    {activeTab === 'settings' && (
                         <div className="animate-fade-in space-y-6">
                            <div>
                                <h3 className="text-lg font-bold mb-2 flex items-center dark:text-white"><UserCircleIcon className="w-5 h-5 mr-2 text-gray-500"/> Konti</h3>
                                <div className="pl-7 divide-y dark:divide-gray-700">
                                    <button className="w-full flex justify-between items-center py-3 text-left group">
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-gray-200">Hindura umwirondoro</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Uzuza amazina yawe, imeri, na telefone</p>
                                        </div>
                                        <ArrowRightIcon className="w-5 h-5 text-gray-400 transform transition-transform group-hover:translate-x-1"/>
                                    </button>
                                     <button className="w-full flex justify-between items-center py-3 text-left group">
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-gray-200">Hindura ijambobanga</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Hindura ijambobanga ryawe buri gihe</p>
                                        </div>
                                        <ArrowRightIcon className="w-5 h-5 text-gray-400 transform transition-transform group-hover:translate-x-1"/>
                                    </button>
                                </div>
                            </div>
                             <div>
                                <h3 className="text-lg font-bold mb-2 flex items-center dark:text-white"><BellAlertIcon className="w-5 h-5 mr-2 text-gray-500"/> Ibimenyetso</h3>
                                 <div className="pl-7 divide-y dark:divide-gray-700">
                                    <SettingToggle label="Promosiyo n'Amashya" description="Akira amakuru y'ibishya n'ibyagabanijwe" enabled={notificationSettings.promotions} onToggle={() => handleToggle('promotions')} />
                                    <SettingToggle label="Kwibutswa ingendo" description="Ubutumwa bwo kukwibutsa mbere y'urugendo" enabled={notificationSettings.tripReminders} onToggle={() => handleToggle('tripReminders')} />
                                    <SettingToggle label="Amakuru ya Konti" description="Ibimenyetso by'ingenzi ku bijyanye na konti yawe" enabled={notificationSettings.accountUpdates} onToggle={() => handleToggle('accountUpdates')} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;