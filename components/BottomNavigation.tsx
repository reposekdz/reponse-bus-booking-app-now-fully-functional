import React from 'react';
import { HomeIcon, TicketIcon, BuildingOfficeIcon, UserCircleIcon } from './icons';
import { Page } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface BottomNavigationProps {
    navigate: (page: Page) => void;
    currentPage: Page;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ navigate, currentPage }) => {
    const { t } = useLanguage();
    
    // Logic to keep parent tabs active when on sub-pages
    const isBookActive = ['bookingSearch', 'search', 'seatSelection', 'payment', 'bookingConfirmation'].includes(currentPage);
    const isCompaniesActive = ['companies', 'companyProfile'].includes(currentPage);
    const isProfileActive = ['profile', 'bookings', 'scheduled', 'wallet', 'loyalty', 'favorites', 'priceAlerts'].includes(currentPage);
    
    const activePage = (page: Page) => {
        if (page === 'bookingSearch' && isBookActive) return true;
        if (page === 'companies' && isCompaniesActive) return true;
        if (page === 'profile' && isProfileActive) return true;
        return currentPage === page;
    }

    const navItems = [
        { label: t('bottomnav_home'), page: 'home', icon: HomeIcon },
        { label: t('bottomnav_book'), page: 'bookingSearch', icon: TicketIcon },
        { label: t('bottomnav_companies'), page: 'companies', icon: BuildingOfficeIcon },
        { label: t('bottomnav_profile'), page: 'profile', icon: UserCircleIcon },
    ];

    return (
        <nav className="fixed bottom-6 left-4 right-4 z-50">
            {/* Floating Dock Container */}
            <div className="bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-gray-700 shadow-2xl rounded-2xl h-16 px-2 flex justify-around items-center max-w-lg mx-auto ring-1 ring-black/5">
                {navItems.map((item) => {
                    const isActive = activePage(item.page as Page);
                    const Icon = item.icon;
                    
                    return (
                        <button 
                            key={item.page} 
                            onClick={() => navigate(item.page as Page)} 
                            className="group relative flex items-center justify-center w-full h-full focus:outline-none"
                        >
                            {/* Active Indicator Background (Gradient Pill) */}
                            <div 
                                className={`absolute inset-2 rounded-xl transition-all duration-500 ease-out ${
                                    isActive 
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 opacity-100 shadow-lg shadow-blue-500/30' 
                                        : 'opacity-0'
                                }`}
                            />

                            <div className="relative flex flex-col items-center justify-center z-10">
                                <Icon 
                                    className={`w-6 h-6 transition-all duration-300 ${
                                        isActive 
                                            ? 'text-white transform scale-110 translate-y-0.5' 
                                            : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:-translate-y-1'
                                    }`} 
                                />
                                
                                {/* Label (Only shows when inactive for cleaner look on active, or optional) */}
                                {!isActive && (
                                    <span className="text-[10px] font-medium text-gray-400 mt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 absolute top-full">
                                        {item.label}
                                    </span>
                                )}
                                
                                {/* Notification Dot (Example for Profile) */}
                                {item.page === 'profile' && !isActive && (
                                    <span className="absolute top-0 right-0 -mt-1 -mr-1 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNavigation;