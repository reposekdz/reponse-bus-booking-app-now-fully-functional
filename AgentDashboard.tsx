import React, { useState, useMemo, FormEvent } from 'react';
import { 
    SunIcon, MoonIcon, CogIcon, UsersIcon, ChartBarIcon, ArrowDownLeftIcon,
    WalletIcon, CreditCardIcon, SearchIcon, XIcon, CheckCircleIcon, PhoneIcon, MapPinIcon
} from './components/icons';
import PinModal from './components/PinModal';
import { Page } from './App';

interface AgentDashboardProps {
    onLogout: () => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    agentData: any;
    onAgentDeposit: (serialCode: string, amount: number) => { success: boolean, passengerName?: string, commission?: number, message?: string };
    passengerSerialCode: string;
    transactions: any[];
    navigate: (page: Page, data?: any) => void;
}

const StatCard = ({ title, value, icon, format = 'currency' }) => (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 text-gray-200/20 dark:text-gray-900/20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
            {React.cloneElement(icon, { className: "w-20 h-20" })}
        </div>
        <div className="relative">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {format === 'currency' ? `${new Intl.NumberFormat('fr-RW').format(value)} RWF` : new Intl.NumberFormat().format(value)}
            </p>
        </div>
    </div>
);

const DailyGoal = ({ current, goal }) => {
    const percentage = Math.min((current / goal) * 100, 100);
    return (
        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
            <h3 className="font-bold mb-2 dark:text-white">Today's Deposit Goal</h3>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
            <div className="flex justify-between items-center mt-2 text-sm">
                <span className="font-bold text-green-600 dark:text-green-400">{new Intl.NumberFormat('fr-RW').format(current)}</span>
                <span className="text-gray-500 dark:text-gray-400">Goal: {new Intl.NumberFormat('fr-RW').format(goal)}</span>
            </div>
        </div>
    )
}

const DashboardView = ({ agentData, transactions }) => {
    const totalDeposits = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const totalCommission = transactions.reduce((sum, tx) => sum + tx.commission, 0);
    const uniquePassengers = new Set(transactions.map(tx => tx.passengerSerial)).size;

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500 dark:from-blue-400 dark:to-green-300">Imbonerahamwe</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Yose Yabikijwe" value={totalDeposits} icon={<ArrowDownLeftIcon/>}/>
                <StatCard title="Komisiyo Yose" value={totalCommission} icon={<WalletIcon/>}/>
                <StatCard title="Ibikorwa Byose" value={transactions.length} icon={<ChartBarIcon/>} format="number"/>
                <StatCard title="Abagenzi Bafashijwe" value={uniquePassengers} icon={<UsersIcon/>} format="number"/>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <DailyGoal current={totalDeposits} goal={200000} />
                </div>
                <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                    <h3 className="font-bold mb-4 dark:text-white">Ibikorwa bya Vuba</h3>
                    <div className="space-y-4 h-[10rem] overflow-y-auto custom-scrollbar">
                        {transactions.slice(0, 10).map(tx => (
                            <div key={tx.id} className="flex items-center space-x-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full">
                                    <ArrowDownLeftIcon className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold dark:text-white">{tx.passengerName}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
                                </div>
                                <p className="ml-auto font-bold text-sm text-green-600 dark:text-green-400">
                                    +{new Intl.NumberFormat('fr-RW').format(tx.amount)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CustomerLookupView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [customer, setCustomer] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = () => {
        if (!searchTerm) return;
        setIsLoading(true);
        setError('');
        setCustomer(null);
        setTimeout(() => {
            if (searchTerm === '0788123456' || searchTerm.toUpperCase() === 'UM1234') {
                setCustomer({ name: 'Kalisa Jean', phone: '0788123456', serial: 'UM1234', balance: 15000 });
            } else {
                setError('No customer found with that ID.');
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">Customer Lookup</h1>
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg">
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Search for a passenger by their phone number or serial code to assist them.</p>
                <div className="flex space-x-2">
                     <input 
                        type="text" 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Enter phone or serial code..."
                        className="flex-grow p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button onClick={handleSearch} disabled={isLoading} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition w-36">
                        {isLoading ? <div className="w-5 h-5 border-2 border-t-white border-l-white border-b-transparent border-r-transparent rounded-full animate-spin mx-auto"></div> : 'Search'}
                    </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                {customer && (
                    <div className="mt-6 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg animate-fade-in">
                        <p className="font-bold text-xl text-gray-800 dark:text-white">{customer.name}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mt-2">
                            <span className="flex items-center"><PhoneIcon className="w-4 h-4 mr-1.5"/>{customer.phone}</span>
                            <span className="flex items-center font-mono"><UsersIcon className="w-4 h-4 mr-1.5"/>{customer.serial}</span>
                        </div>
                         <div className="mt-4 border-t dark:border-gray-600 pt-4">
                            <p className="text-sm font-semibold">Wallet Balance</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{new Intl.NumberFormat('fr-RW').format(customer.balance)} RWF</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const DepositView = ({ onAgentDeposit, passengerSerialCode, agentPin }) => {
    const [serialCode, setSerialCode] = useState('');
    const [passengerInfo, setPassengerInfo] = useState<{name: string; phone: string; location: string} | null>(null);
    const [amount, setAmount] = useState('');
    const [isFinding, setIsFinding] = useState(false);
    const [isDepositing, setIsDepositing] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);

    const handleFindPassenger = () => {
        setError('');
        setSuccessMessage('');
        setPassengerInfo(null);
        setAmount('');
        if (!serialCode) {
            setError('Shyiramo kode y\'umugenzi.');
            return;
        }
        setIsFinding(true);
        setTimeout(() => {
            if (serialCode.toUpperCase() === passengerSerialCode) {
                setPassengerInfo({
                    name: 'Kalisa Jean',
                    phone: '0788 123 456',
                    location: 'Kigali'
                });
            } else {
                setError('Umugenzi ntabonetse. Ongera ugerageze kode.');
            }
            setIsFinding(false);
        }, 1000);
    };
    
    const handleDepositAttempt = (e: FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setError('Shyiramo umubare w\'amafaranga wumvikana.');
            return;
        }
        setError('');
        setIsPinModalOpen(true);
    }

    const handlePinSuccess = () => {
        setIsPinModalOpen(false);
        setIsDepositing(true);
        setError('');
        setSuccessMessage('');
        const numAmount = parseFloat(amount);

        setTimeout(() => {
            const result = onAgentDeposit(serialCode, numAmount);
            if(result.success) {
                setSuccessMessage(`${new Intl.NumberFormat('fr-RW').format(numAmount)} RWF yoherejwe neza kuri ${result.passengerName}. Komisiyo yawe: ${new Intl.NumberFormat('fr-RW').format(result.commission || 0)} RWF.`);
                setPassengerInfo(null);
                setSerialCode('');
                setAmount('');
            } else {
                setError(result.message || 'Habayeho ikibazo mu kubitsa. Ongera ugerageze.');
            }
            setIsDepositing(false);
        }, 1500);
    };
    
    const resetSearch = () => {
        setPassengerInfo(null);
        setSerialCode('');
        setError('');
        setAmount('');
    }

    return (
        <div>
            <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">Kubitsa Amafaranga</h1>
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg">
                {successMessage && (
                    <div className="bg-green-100 dark:bg-green-900/50 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-4 rounded-md mb-6 flex items-center space-x-3">
                        <CheckCircleIcon className="w-6 h-6"/>
                        <p>{successMessage}</p>
                    </div>
                )}
                {!passengerInfo ? (
                    <div className="space-y-4">
                        <h2 className="font-semibold text-lg dark:text-white">Shakisha Umugenzi</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Shyiramo kode y'umugenzi kugirango umwemeze mbere yo kumubikira amafaranga.</p>
                        <div className="flex space-x-2">
                             <input 
                                type="text" 
                                value={serialCode}
                                onChange={e => setSerialCode(e.target.value.toUpperCase())}
                                placeholder="Shyiramo kode..."
                                className="flex-grow p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <button onClick={handleFindPassenger} disabled={isFinding} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition w-36">
                                {isFinding ? <div className="w-5 h-5 border-2 border-t-white border-l-white border-b-transparent border-r-transparent rounded-full animate-spin mx-auto"></div> : 'Shakisha'}
                            </button>
                        </div>
                         {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>
                ) : (
                    <form onSubmit={handleDepositAttempt} className="space-y-4 animate-fade-in">
                        <div className="flex justify-between items-start">
                             <h2 className="font-semibold text-lg dark:text-white">Emeza Umwirondoro & Bika</h2>
                             <button type="button" onClick={resetSearch} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Shakisha undi</button>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg space-y-2">
                            <p className="font-bold text-xl text-gray-800 dark:text-white">{passengerInfo.name}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                                <span className="flex items-center"><PhoneIcon className="w-4 h-4 mr-1.5"/>{passengerInfo.phone}</span>
                                <span className="flex items-center"><MapPinIcon className="w-4 h-4 mr-1.5"/>{passengerInfo.location}</span>
                            </div>
                        </div>
                         <div>
                            <label className="text-sm font-medium dark:text-gray-300">Amafaranga yo Kubitsa (RWF)</label>
                             <input 
                                type="number"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                placeholder="0"
                                className="w-full mt-1 p-3 border rounded-lg text-2xl font-bold dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button type="submit" disabled={isDepositing} className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition text-lg">
                           {isDepositing ? 'Kubitsa...' : 'Emeza Kubitsa'}
                        </button>
                    </form>
                )}
            </div>
            {isPinModalOpen && (
                <PinModal 
                    onClose={() => setIsPinModalOpen(false)}
                    onSuccess={handlePinSuccess}
                    pinToMatch={agentPin}
                    title="Emeza Igikorwa"
                    description="Shyiramo PIN yawe y'umukozi kugirango wemeze iki gikorwa."
                />
            )}
        </div>
    );
}

const TransactionsView = ({ transactions }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx =>
            tx.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.passengerSerial.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [transactions, searchTerm]);

    return (
        <div>
            <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">Amateka y'Ibikorwa</h1>
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                <div className="relative mb-4">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Shakisha igikorwa..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="p-3">Itariki</th>
                                <th className="p-3">Umugenzi</th>
                                <th className="p-3">Kode</th>
                                <th className="p-3 text-right">Amafaranga</th>
                                <th className="p-3 text-right">Komisiyo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map(tx => (
                                <tr key={tx.id} className="border-t dark:border-gray-700">
                                    <td className="p-3 whitespace-nowrap">{new Date(tx.date).toLocaleString()}</td>
                                    <td className="font-semibold dark:text-white">{tx.passengerName}</td>
                                    <td>{tx.passengerSerial}</td>
                                    <td className="font-mono text-right">{new Intl.NumberFormat('fr-RW').format(tx.amount)}</td>
                                    <td className="font-mono text-green-600 dark:text-green-400 text-right">+{new Intl.NumberFormat('fr-RW').format(tx.commission)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


const AgentDashboard: React.FC<AgentDashboardProps> = ({ onLogout, theme, setTheme, agentData, onAgentDeposit, passengerSerialCode, transactions, navigate }) => {
    const [view, setView] = useState('dashboard');
    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    const renderContent = () => {
        switch (view) {
            case 'dashboard': return <DashboardView agentData={agentData} transactions={transactions} />;
            case 'deposit': return <DepositView onAgentDeposit={onAgentDeposit} passengerSerialCode={passengerSerialCode} agentPin={agentData.pin} />;
            case 'transactions': return <TransactionsView transactions={transactions} />;
            case 'customerLookup': return <CustomerLookupView />;
            default: return <DashboardView agentData={agentData} transactions={transactions} />;
        }
    };

    const NavLink = ({ viewName, label, icon: Icon }) => (
      <button onClick={() => setView(viewName)} className={`group w-full flex items-center px-4 py-3 transition-all duration-300 rounded-lg relative ${view === viewName ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
          <div className={`absolute left-0 top-0 h-full w-1 rounded-r-full bg-yellow-400 transition-all duration-300 ${view === viewName ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-50'}`}></div>
          <Icon className="w-6 h-6 mr-4 transition-transform duration-300 group-hover:scale-110" />
          <span className="font-semibold">{label}</span>
      </button>
    );

    return (
        <div className={`min-h-screen flex ${theme}`}>
            <aside className="w-64 bg-gradient-to-b from-gray-800 via-gray-900 to-black text-gray-300 flex-col hidden lg:flex border-r border-gray-700/50">
                <div className="h-20 flex items-center justify-center text-white font-bold text-xl border-b border-white/10">AGENT PORTAL</div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <NavLink viewName="dashboard" label="Imbonerahamwe" icon={ChartBarIcon} />
                    <NavLink viewName="deposit" label="Kubitsa" icon={CreditCardIcon} />
                    <NavLink viewName="customerLookup" label="Customer Lookup" icon={SearchIcon} />
                    <NavLink viewName="transactions" label="Ibikorwa" icon={WalletIcon} />
                    <button onClick={() => navigate('agentProfile')} className={`group w-full flex items-center px-4 py-3 transition-all duration-300 rounded-lg relative text-gray-400 hover:text-white hover:bg-white/5`}>
                         <div className={`absolute left-0 top-0 h-full w-1 rounded-r-full bg-yellow-400 transition-all duration-300 scale-y-0 group-hover:scale-y-50`}></div>
                        <UsersIcon className="w-6 h-6 mr-4 transition-transform duration-300 group-hover:scale-110" />
                        <span className="font-semibold">Umwirondoro</span>
                    </button>
                    <NavLink viewName="settings" label="Iboneza" icon={CogIcon} />
                </nav>
            </aside>
            <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900">
                <header className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm flex items-center justify-between px-6 border-b dark:border-gray-700/50">
                    <div className="font-bold text-gray-800 dark:text-white">Ikaze, {agentData.name.split(' ')[0]}</div>
                    <div className="flex items-center space-x-4">
                        <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400">{theme === 'light' ? <MoonIcon className="w-6 h-6"/> : <SunIcon className="w-6 h-6"/>}</button>
                        <button onClick={onLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Sohoka</button>
                    </div>
                </header>
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <div className="animate-fade-in">{renderContent()}</div>
                </main>
            </div>
        </div>
    );
};

export default AgentDashboard;