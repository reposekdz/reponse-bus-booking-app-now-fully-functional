import React, { useState } from 'react';
import { UserCircleIcon, TicketIcon, CogIcon, ShieldCheckIcon, CreditCardIcon, InformationCircleIcon, ArrowRightIcon, WalletIcon, ArrowUpRightIcon, ArrowDownLeftIcon } from './components/icons';

const user = {
    name: 'Kalisa Jean',
    email: 'kalisa.j@example.com',
    memberSince: 'Mutarama 2023',
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

const menuItems = [
    { icon: UserCircleIcon, label: 'Amakuru y\'umwirondoro', description: 'Hindura amazina, imeri, n\'ijambobanga' },
    { icon: TicketIcon, label: 'Amateka y\'ingendo', description: 'Reba ingendo zawe zose zarangiye' },
    { icon: CreditCardIcon, label: 'Uburyo bwo Kwishyura', description: 'Gucunga amakarita yawe yishyuza' },
    { icon: ShieldCheckIcon, label: 'Umutekano', description: 'Gucunga iby\'umutekano wa konti' },
    { icon: InformationCircleIcon, label: 'Ubufasha & Inkunga', description: 'Bona ibisubizo by\'ibibazo byawe' },
];

const TabButton: React.FC<{label: string; isActive: boolean; onClick: () => void}> = ({ label, isActive, onClick}) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${isActive ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
        {label}
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


const ProfilePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('wallet');

    return (
        <div className="bg-gray-100/50 dark:bg-gray-900/50 min-h-full py-12">
            <div className="container mx-auto px-6">
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg flex-shrink-0">
                        KJ
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white text-center sm:text-left">{user.name}</h1>
                        <p className="text-gray-600 dark:text-gray-400 text-center sm:text-left">{user.email}</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                        <div className="flex items-center space-x-2">
                           <TabButton label="Ikofi & Ibikorwa" isActive={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} />
                           <TabButton label="Iboneza" isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                        </div>
                    </div>

                    {activeTab === 'wallet' && (
                        <div className="animate-fade-in">
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
                    
                    {activeTab === 'settings' && (
                         <div className="animate-fade-in space-y-2">
                           {menuItems.map((item, index) => (
                                <button key={index} className="w-full flex items-center text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group">
                                    <item.icon className="w-6 h-6 text-gray-500 dark:text-gray-400 mr-4 flex-shrink-0" />
                                    <div className="flex-grow">
                                        <p className="font-semibold text-gray-800 dark:text-gray-200">{item.label}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                                    </div>
                                    <ArrowRightIcon className="w-5 h-5 text-gray-400 ml-auto transform transition-transform group-hover:translate-x-1 flex-shrink-0" />
                                </button>
                           ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;