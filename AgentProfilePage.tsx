
import React from 'react';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, CalendarIcon, ArrowUpRightIcon, CogIcon } from './components/icons';

const AgentProfilePage: React.FC = () => {
    const agent = {
        name: 'Jane Smith',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop',
        location: 'Nyabugogo',
        phone: '0788 555 666',
        email: 'j.smith@agent.rw',
        memberSince: 'Kamena 2022',
        stats: {
            totalDeposits: 1250000,
            totalCommission: 62500, // 5%
            passengersServed: 89,
        },
        recentActivity: [
            { passenger: 'Kalisa J.', amount: 30000, date: '2h ishize' },
            { passenger: 'Umuhoza G.', amount: 15000, date: 'Ejo' },
        ]
    };

    return (
        <div className="bg-gray-100/50 dark:bg-gray-900/50 min-h-full py-12">
            <div className="container mx-auto px-6 max-w-4xl">
                 <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="h-40 bg-green-600"></div>
                     <div className="px-6 pb-6">
                        <div className="flex justify-center -mt-16">
                            <img src={agent.avatarUrl} alt={agent.name} className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover"/>
                        </div>
                        <div className="text-center mt-4">
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{agent.name}</h1>
                            <p className="text-gray-600 dark:text-gray-400">Agent Wemewe</p>
                        </div>
                         <div className="mt-6 flex justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center"><MapPinIcon className="w-4 h-4 mr-1.5"/>{agent.location}</span>
                            <span className="flex items-center"><CalendarIcon className="w-4 h-4 mr-1.5"/>Yinjiye muri {agent.memberSince}</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-200 dark:bg-gray-700">
                        <div className="bg-white dark:bg-gray-800 text-center p-4">
                            <p className="font-bold text-2xl text-blue-600 dark:text-blue-400">{new Intl.NumberFormat('fr-RW').format(agent.stats.totalDeposits)}</p>
                            <p className="text-sm text-gray-500">Amafaranga Yabikijwe</p>
                        </div>
                         <div className="bg-white dark:bg-gray-800 text-center p-4">
                            <p className="font-bold text-2xl text-green-600 dark:text-green-400">{new Intl.NumberFormat('fr-RW').format(agent.stats.totalCommission)}</p>
                            <p className="text-sm text-gray-500">Komisiyo Yose</p>
                        </div>
                         <div className="bg-white dark:bg-gray-800 text-center p-4">
                            <p className="font-bold text-2xl text-yellow-500">{agent.stats.passengersServed}</p>
                            <p className="text-sm text-gray-500">Abagenzi Bafashijwe</p>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div>
                            <h3 className="font-bold text-lg dark:text-white mb-2">Amakuru bwite</h3>
                            <div className="text-gray-700 dark:text-gray-300 space-y-2 text-sm">
                                 <p className="flex items-center"><PhoneIcon className="w-4 h-4 mr-2 text-gray-400"/> {agent.phone}</p>
                                 <p className="flex items-center"><EnvelopeIcon className="w-4 h-4 mr-2 text-gray-400"/> {agent.email}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg dark:text-white mb-2">Ibikorwa bya Vuba</h3>
                             <div className="space-y-3">
                                {agent.recentActivity.map((act, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm">
                                        <p className="text-gray-700 dark:text-gray-300">Kubitsa kuri <span className="font-semibold">{act.passenger}</span></p>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600">{new Intl.NumberFormat('fr-RW').format(act.amount)}</p>
                                            <p className="text-xs text-gray-400">{act.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default AgentProfilePage;
