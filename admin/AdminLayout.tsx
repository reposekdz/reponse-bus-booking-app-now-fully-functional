
import React, { useState } from 'react';
import { Page } from '../types';
import { 
    ChartBarIcon, BuildingOfficeIcon, UsersIcon, BriefcaseIcon, 
    SunIcon, MoonIcon, MegaphoneIcon, TagIcon, CurrencyDollarIcon, 
    ChatBubbleLeftRightIcon, CogIcon, MapIcon, ChevronDownIcon, 
    PowerIcon, ArrowRightIcon 
} from '../components/icons';
import AdminDashboard from './AdminDashboard';
import ManageCompanies from './ManageCompanies';
import ManageDrivers from './ManageDrivers';
import ManageAgents from './ManageAgents';
import ManageUsers from './ManageUsers';
import AdminFinancials from './AdminFinancials';
import ManageAds from './ManageAds';
import ManagePromotions from './ManagePromotions';
import PlatformAnnouncements from './PlatformAnnouncements';
import ManageMessages from './ManageMessages';
import ManageSite from './ManageSite';
import ManageDestinations from './ManageDestinations';
import ManageStations from './ManageStations';

interface AdminLayoutProps {
    currentPage: Page;
    navigate: (page: Page, data?: any) => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    onLogout: () => void;
}

type NavGroup = {
    title: string;
    icon: React.FC<any>;
    items: { page: Page; label: string }[];
};

const navGroups: NavGroup[] = [
    {
        title: 'Overview',
        icon: ChartBarIcon,
        items: [
            { page: 'adminDashboard', label: 'Dashboard' },
            { page: 'adminFinancials', label: 'Financials' },
        ]
    },
    {
        title: 'User Management',
        icon: UsersIcon,
        items: [
            { page: 'adminUsers', label: 'All Users' },
            { page: 'adminCompanies', label: 'Companies' },
            { page: 'adminDrivers', label: 'Drivers' },
            { page: 'adminAgents', label: 'Agents' },
        ]
    },
    {
        title: 'Logistics',
        icon: MapIcon,
        items: [
            { page: 'adminStations', label: 'Bus Stations' },
            { page: 'adminDestinations', label: 'Destinations' },
        ]
    },
    {
        title: 'Marketing & Content',
        icon: MegaphoneIcon,
        items: [
            { page: 'adminPromotions', label: 'Promotions' },
            { page: 'adminAds', label: 'Advertisements' },
            { page: 'adminAnnouncements', label: 'Announcements' },
        ]
    },
    {
        title: 'System',
        icon: CogIcon,
        items: [
            { page: 'adminMessages', label: 'Support Messages' },
            { page: 'adminSettings', label: 'Site Settings' },
        ]
    }
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ currentPage, navigate, theme, setTheme, onLogout }) => {
    // State to track which group is expanded. Default to the group containing the current page.
    const [expandedGroup, setExpandedGroup] = useState<string | null>(() => {
        const group = navGroups.find(g => g.items.some(i => i.page === currentPage));
        return group ? group.title : 'Overview';
    });

    const toggleGroup = (title: string) => {
        setExpandedGroup(prev => prev === title ? null : title);
    };
    
    const renderContent = () => {
        switch (currentPage) {
            case 'adminDashboard': return <AdminDashboard />;
            case 'adminCompanies': return <ManageCompanies />;
            case 'adminDrivers': return <ManageDrivers navigate={navigate} />;
            case 'adminAgents': return <ManageAgents navigate={navigate} />;
            case 'adminUsers': return <ManageUsers navigate={navigate} />;
            case 'adminFinancials': return <AdminFinancials />;
            case 'adminAds': return <ManageAds />;
            case 'adminPromotions': return <ManagePromotions />;
            case 'adminAnnouncements': return <PlatformAnnouncements />;
            case 'adminMessages': return <ManageMessages />;
            case 'adminSettings': return <ManageSite />;
            case 'adminDestinations': return <ManageDestinations />;
            case 'adminStations': return <ManageStations />;
            default: return <AdminDashboard />;
        }
    };
    
    return (
        <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-gray-300 flex-col flex transition-all duration-300 shadow-2xl z-20 fixed h-full">
                {/* Sidebar Header */}
                <div className="h-20 flex items-center px-6 bg-black/20 backdrop-blur-sm border-b border-white/10">
                    <div className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-white">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                            <span className="text-white">A</span>
                        </div>
                        <span>Admin</span>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {navGroups.map((group) => {
                        const isActiveGroup = group.items.some(i => i.page === currentPage);
                        const isExpanded = expandedGroup === group.title;
                        
                        return (
                            <div key={group.title} className="mb-2">
                                <button 
                                    onClick={() => toggleGroup(group.title)}
                                    className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors duration-200 ${isActiveGroup ? 'text-white bg-white/10' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                                >
                                    <div className="flex items-center">
                                        <group.icon className={`w-5 h-5 mr-3 ${isActiveGroup ? 'text-yellow-400' : 'text-gray-500'}`} />
                                        <span className="font-semibold text-sm">{group.title}</span>
                                    </div>
                                    <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                </button>
                                
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="ml-4 pl-4 border-l border-gray-700 mt-1 space-y-1">
                                        {group.items.map(item => (
                                            <button
                                                key={item.page}
                                                onClick={() => navigate(item.page)}
                                                className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-colors ${currentPage === item.page ? 'text-blue-400 bg-blue-900/20' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                                            >
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </nav>

                {/* Sidebar Footer (Logout & Theme) */}
                <div className="p-4 bg-black/30 border-t border-white/10">
                    <div className="flex items-center justify-between mb-4 bg-gray-800 rounded-lg p-2">
                        <span className="text-xs font-medium pl-2">Theme</span>
                        <div className="flex items-center space-x-1 bg-gray-700 rounded-md p-1">
                            <button onClick={() => setTheme('light')} className={`p-1.5 rounded transition-colors ${theme === 'light' ? 'bg-white shadow text-orange-500' : 'text-gray-400'}`}>
                                <SunIcon className="w-4 h-4"/>
                            </button>
                            <button onClick={() => setTheme('dark')} className={`p-1.5 rounded transition-colors ${theme === 'dark' ? 'bg-gray-600 shadow text-blue-300' : 'text-gray-400'}`}>
                                <MoonIcon className="w-4 h-4"/>
                            </button>
                        </div>
                    </div>
                    <button 
                        onClick={onLogout} 
                        className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg shadow-lg transition-all transform hover:-translate-y-0.5"
                    >
                        <PowerIcon className="w-4 h-4 mr-2"/>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col ml-64 transition-all">
                <header className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm flex items-center justify-between px-8 sticky top-0 z-10 border-b dark:border-gray-700">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                            {navGroups.flatMap(g => g.items).find(i => i.page === currentPage)?.label || 'Dashboard'}
                        </h2>
                    </div>
                    <div className="flex items-center space-x-4">
                         <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    </div>
                </header>
                <main className="flex-1 p-8 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
