import React, { useState } from 'react';
import { Page } from './App';
import { UserCircleIcon, TicketIcon, ClockIcon, WalletIcon, CogIcon, ChevronRightIcon, PencilSquareIcon, CameraIcon, SparklesIcon } from './components/icons';
import WalletTopUpModal from './components/WalletTopUpModal';

interface ProfilePageProps {
    onNavigate: (page: Page) => void;
    user: any;
    setUser: (user: any) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate, user, setUser }) => {
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);

    // Mock user data if not logged in
    const displayUser = user || {
        name: 'Guest User',
        email: 'guest@example.com',
        avatarUrl: 'https://randomuser.me/api/portraits/lego/1.jpg',
        coverUrl: 'https://images.unsplash.com/photo/1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop',
        memberSince: 'Not logged in',
        walletBalance: 0,
        pin: '0000',
        loyaltyPoints: 0,
        referralCode: 'GUEST-CODE'
    };

    const menuItems: { label: string, icon: React.FC<any>, page: Page }[] = [
        { label: 'Amatike Yanjye', icon: TicketIcon, page: 'bookings' },
        { label: 'Ingendo ziteganijwe', icon: ClockIcon, page: 'scheduled' },
        { label: 'Ikofi Yanjye', icon: WalletIcon, page: 'profile' }, // Stays on profile for demo
        { label: 'Iboneza', icon: CogIcon, page: 'profile' }, // Stays on profile for demo
    ];

    const handleTopUpSuccess = (amount: number) => {
      setUser(prevUser => ({
          ...prevUser,
          walletBalance: prevUser.walletBalance + amount
      }));
      setIsTopUpOpen(false);
      alert(`${new Intl.NumberFormat('fr-RW').format(amount)} RWF has been added to your wallet!`);
  };

    return (
        <>
            <div className="bg-gray-100/50 dark:bg-gray-900/50 min-h-screen">
                 <header className="relative bg-white dark:bg-gray-800 shadow-sm pt-12 pb-24 h-64">
                    <img src={displayUser.coverUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover"/>
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="container mx-auto px-6 relative h-full flex flex-col justify-between">
                        <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">Umwirondoro Wanjye</h1>
                        <button className="absolute top-0 right-0 mt-4 mr-4 flex items-center text-xs bg-black/30 text-white px-3 py-1.5 rounded-full hover:bg-black/50">
                            <CameraIcon className="w-4 h-4 mr-2"/> Edit Cover
                        </button>
                    </div>
                </header>
                <main className="container mx-auto px-6 -mt-16">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="relative group">
                             <img src={displayUser.avatarUrl} alt="User Avatar" className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-700" />
                             <button className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                 <PencilSquareIcon className="w-6 h-6 text-white"/>
                             </button>
                        </div>
                        <div className="flex-grow text-center sm:text-left">
                            <h2 className="text-2xl font-bold dark:text-white">{displayUser.name}</h2>
                            <p className="text-gray-500 dark:text-gray-400">{displayUser.email}</p>
                            <p className="text-xs text-gray-400 mt-1">Yabaye umunyamuryango: {displayUser.memberSince}</p>
                        </div>
                        <div className="text-center sm:text-right">
                             <p className="text-sm text-gray-500 dark:text-gray-400">Amafaranga asigaye</p>
                             <p className="text-2xl font-bold text-green-600 dark:text-green-400">{new Intl.NumberFormat('fr-RW').format(displayUser.walletBalance)} RWF</p>
                             {user && <button onClick={() => setIsTopUpOpen(true)} className="text-xs font-semibold text-blue-600 hover:underline">+ Add Funds</button>}
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {menuItems.map(item => (
                                <button key={item.label} onClick={() => onNavigate(item.page)} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between hover:shadow-lg hover:-translate-y-1 transition-all">
                                    <div className="flex items-center">
                                        <item.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                                        <span className="ml-4 font-semibold text-lg text-gray-800 dark:text-white">{item.label}</span>
                                    </div>
                                    <ChevronRightIcon className="w-6 h-6 text-gray-400" />
                                </button>
                            ))}
                        </div>
                         <div className="space-y-6">
                            <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white rounded-2xl shadow-xl p-6 text-center">
                                <SparklesIcon className="w-8 h-8 mx-auto mb-2"/>
                                <p className="text-sm opacity-90">GoPoints Balance</p>
                                <p className="text-4xl font-bold">{new Intl.NumberFormat().format(displayUser.loyaltyPoints || 0)}</p>
                                <button onClick={() => onNavigate('loyalty')} className="mt-2 text-xs font-semibold bg-white/20 px-3 py-1 rounded-full hover:bg-white/30">View History</button>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                <h3 className="font-bold text-lg dark:text-white">Refer & Earn</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Share your code with friends. You both get 500 bonus GoPoints!</p>
                                <div className="mt-4 flex items-center space-x-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <p className="flex-grow font-mono text-blue-600 dark:text-blue-400">{displayUser.referralCode}</p>
                                    <button onClick={() => navigator.clipboard.writeText(displayUser.referralCode).then(() => alert('Copied!'))} className="px-3 py-1 text-xs font-semibold bg-blue-600 text-white rounded-md">Copy</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            {isTopUpOpen && (
                <WalletTopUpModal 
                    onClose={() => setIsTopUpOpen(false)}
                    onSuccess={handleTopUpSuccess}
                    userPin={displayUser.pin}
                />
            )}
        </>
    );
};

export default ProfilePage;