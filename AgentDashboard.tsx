import React, { useState, useMemo, FormEvent } from 'react';
import { 
    SunIcon, MoonIcon, CogIcon, UsersIcon, ChartBarIcon, ArrowDownLeftIcon,
    WalletIcon, CreditCardIcon, SearchIcon, XIcon, CheckCircleIcon, PhoneIcon, MapPinIcon
} from './components/icons';

interface AgentDashboardProps {
    onLogout: () => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    agentData: any;
    onAgentDeposit: (serialCode: string, amount: number) => { success: boolean, passengerName?: string, message?: string };
    passengerSerialCode: string;
}

const StatCard = ({ title, value, icon, isCurrency = true }) => (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 text-gray-200/20 dark:text-gray-900/20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
            {React.cloneElement(icon, { className: "w-20 h-20" })}
        </div>
        <div className="relative">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {isCurrency ? `${new Intl.NumberFormat('fr-RW').format(value)} RWF` : value}
            </p>
        </div>
    </div>
);

const BarChart = ({ data, dataKey, labelKey, title, colorClass }) => {
    const maxValue = Math.max(...data.map(d => d[dataKey]));
    return (
        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
            <h3 className="font-bold mb-4 dark:text-white">{title}</h3>
            <div className="flex items-end h-64 space-x-2">
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


const DashboardView = ({ agentData }) => {
    const dailyDeposits = [
        { day: 'M', amount: 150000 }, { day: 'T', amount: 220000 }, { day: 'W', amount: 180000 },
        { day: 'T', amount: 250000 }, { day: 'F', amount: 350000 }, { day: 'S', amount: 450000 },
        { day: 'S', amount: 320000 }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500 dark:from-blue-400 dark:to-green-300">Imbonerahamwe</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Yabikijwe None" value={185000} icon={<ArrowDownLeftIcon/>}/>
                <StatCard title="Komisiyo ya None" value={9250} icon={<WalletIcon/>}/>
                <StatCard title="Ibikorwa bya None" value={12} icon={<UsersIcon/>} isCurrency={false}/>
            </div>
            <BarChart data={dailyDeposits} dataKey="amount" labelKey="day" title="Amafaranga Yabikijwe mu Cyumweru" colorClass="bg-blue-300 dark:bg-blue-800/80"/>
        </div>
    );
};

const DepositView = ({ onAgentDeposit, passengerSerialCode }) => {
    const [serialCode, setSerialCode] = useState('');
    const [passengerInfo, setPassengerInfo] = useState<{name: string; phone: string; location: string} | null>(null);
    const [amount, setAmount] = useState('');
    const [isFinding, setIsFinding] = useState(false);
    const [isDepositing, setIsDepositing] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

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

    const handleDeposit = (e: FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setError('Shyiramo umubare w\'amafaranga wumvikana.');
            return;
        }
        setIsDepositing(true);
        setError('');
        setSuccessMessage('');

        setTimeout(() => {
            const result = onAgentDeposit(serialCode, numAmount);
            if(result.success) {
                setSuccessMessage(`${new Intl.NumberFormat('fr-RW').format(numAmount)} RWF yoherejwe neza kuri ${result.passengerName}.`);
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
                    <form onSubmit={handleDeposit} className="space-y-4 animate-fade-in">
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
        </div>
    );
}

const AgentDashboard: React.FC<AgentDashboardProps> = ({ onLogout, theme, setTheme, agentData, onAgentDeposit, passengerSerialCode }) => {
    const [view, setView] = useState('dashboard');
    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    const renderContent = () => {
        switch (view) {
            case 'dashboard': return <DashboardView agentData={agentData} />;
            case 'deposit': return <DepositView onAgentDeposit={onAgentDeposit} passengerSerialCode={passengerSerialCode} />;
            default: return <DashboardView agentData={agentData} />;
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
                    <NavLink viewName="transactions" label="Ibikorwa" icon={WalletIcon} />
                    <NavLink viewName="profile" label="Umwirondoro" icon={UsersIcon} />
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
