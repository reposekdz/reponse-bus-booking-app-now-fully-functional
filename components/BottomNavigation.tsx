
import React from 'react';
import { HomeIcon, TicketIcon, SparklesIcon, UserCircleIcon } from './icons';
import { Page } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface BottomNavigationProps {
    navigate: (page: Page) => void;
    currentPage: Page;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ navigate, currentPage }) => {
    const { t } = useLanguage();
    
    const isBookActive = ['bookingSearch', 'search', 'seatSelection', 'payment', 'bookingConfirmation'].includes(currentPage);
    const isServicesActive = ['services', 'packageDelivery', 'busCharter', 'lostAndFound', 'corporateTravel', 'tourPackages', 'travelInsurance', 'giftCards', 'hotelBooking', 'eventTickets', 'vehicleRentals', 'vipLounge'].includes(currentPage);
    const isProfileActive = ['profile', 'bookings', 'scheduled', 'wallet', 'loyalty', 'favorites', 'priceAlerts'].includes(currentPage);
    
    const activePage = (page: Page) => {
        if (page === 'bookingSearch' && isBookActive) return true;
        if (page === 'services' && isServicesActive) return true;
        if (page === 'profile' && isProfileActive) return true;
        return currentPage === page;
    }

    const navItems = [
        { label: 'Home', page: 'home', icon: HomeIcon },
        { label: 'Book Ticket', page: 'bookingSearch', icon: TicketIcon },
        { label: 'Services', page: 'services', icon: SparklesIcon },
        { label: 'Profile', page: 'profile', icon: UserCircleIcon },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
            <div className="relative bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                {/* Gradient Line at Top */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-yellow-400 to-green-500"></div>
                
                <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
                    {navItems.map((item) => {
                        const isActive = activePage(item.page as Page);
                        const Icon = item.icon;
                        
                        return (
                            <button 
                                key={item.page} 
                                onClick={() => navigate(item.page as Page)} 
                                className={`group relative flex flex-col items-center justify-center w-full h-full focus:outline-none transition-colors duration-300`}
                            >
                                {/* Active Indicator Background */}
                                <div className={`absolute inset-x-2 top-2 bottom-2 rounded-xl bg-blue-50 dark:bg-white/5 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>

                                <div className={`relative z-10 flex flex-col items-center ${isActive ? 'text-blue-600 dark:text-yellow-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}>
                                    <Icon className={`w-6 h-6 mb-1 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                                    <span className="text-[10px] font-bold leading-none">
                                        {item.label}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default BottomNavigation;
