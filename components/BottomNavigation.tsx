import React from 'react';
import { HomeIcon, TicketIcon, BuildingOfficeIcon, QuestionMarkCircleIcon, EnvelopeIcon, UserCircleIcon } from './icons';
import type { Page } from '../App';

interface BottomNavigationProps {
    navigate: (page: Page) => void;
    currentPage: Page;
}

const navItems: { label: string; page: Page; icon: React.FC<{className?: string}> }[] = [
    { label: 'Ahabanza', page: 'home', icon: HomeIcon },
    { label: 'Kata Itike', page: 'bookingSearch', icon: TicketIcon },
    { label: 'Ibigo', page: 'companies', icon: BuildingOfficeIcon },
    { label: 'Umwirondoro', page: 'profile', icon: UserCircleIcon },
    { label: 'Twandikire', page: 'contact', icon: EnvelopeIcon },
];

const NavItem: React.FC<{ item: typeof navItems[0]; isActive: boolean; onClick: () => void }> = ({ item, isActive, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center w-1/5 text-center transition-colors duration-300">
        <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'text-yellow-300' : 'text-gray-400 group-hover:text-white'}`} />
        <span className={`text-xs ${isActive ? 'text-yellow-300 font-semibold' : 'text-gray-300'}`}>{item.label}</span>
        {isActive && <div className="w-8 h-1 bg-yellow-300 rounded-full mt-1"></div>}
    </button>
);

const BottomNavigation: React.FC<BottomNavigationProps> = ({ navigate, currentPage }) => {
    // A bit of a hack to make the profile icon active for its sub-pages
    const isProfileActive = ['profile', 'bookings', 'scheduled'].includes(currentPage);
    
    const activePage = (page: Page) => {
        if (page === 'profile' && isProfileActive) return true;
        return currentPage === page;
    }

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-[#0033A0] to-[#0c2461] dark:from-gray-900 dark:to-black shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.2)]">
            <div className="container mx-auto px-2 h-20 flex justify-around items-center">
                {navItems.map(item => (
                    <NavItem 
                        key={item.page} 
                        item={item} 
                        isActive={activePage(item.page)} 
                        onClick={() => navigate(item.page)} 
                    />
                ))}
            </div>
        </nav>
    );
};

export default BottomNavigation;