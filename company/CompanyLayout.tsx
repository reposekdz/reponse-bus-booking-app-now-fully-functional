
import React, { useState } from 'react';
import { Page } from '../types';
import { 
    ChartBarIcon, BusIcon, UsersIcon, MapIcon, WalletIcon, CogIcon, 
    ChartPieIcon, MoonIcon, SunIcon, ChevronDownIcon, PowerIcon 
} from '../components/icons';
import CompanyDashboard from './CompanyDashboard';
import CompanyBuses from './CompanyBuses';
import CompanyDrivers from './CompanyDrivers';
import CompanyRoutes from './CompanyRoutes';
import CompanyPassengers from './CompanyPassengers';
import CompanyFinancials from './CompanyFinancials';
import CompanySettings from './CompanySettings';
import FleetMonitoring from './FleetMonitoring';
import CompanyRouteAnalytics from './CompanyRouteAnalytics';
import CompanyDriverProfile from './CompanyDriverProfile';

interface CompanyLayoutProps {
    currentPage: Page;
    navigate: (page: Page, data?: any) => void;
    pageData: any;
    companyData: any;
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
        title: 'Dashboard',
        icon: ChartBarIcon,
        items: [
            { page: 'companyDashboard', label: 'Overview' },
            { page: 'fleetMonitoring', label: 'Live Fleet Map' },
            { page: 'companyRouteAnalytics', label: 'Route Analytics' },
        ]
    },
    {
        title: 'Fleet & Operations',
        icon: BusIcon,
        items: [
            { page: 'companyBuses', label: 'Manage Buses' },
            { page: 'companyRoutes', label: 'Manage Routes' },
        ]
    },
    {
        title: 'Personnel',
        icon: UsersIcon,
        items: [
            { page: 'companyDrivers', label: 'Manage Drivers' },
        ]
    },
    {
        title: 'Business',
        icon: WalletIcon,
        items: [
            { page: 'companyPassengers', label: 'Passenger Manifests' },
            { page: 'companyFinancials', label: 'Financial Reports' },
        ]
    },
    {
        title: 'Configuration',
        icon: CogIcon,
        items: [
            { page: 'companySettings', label: 'Company Settings' },
        ]
    }
];

const CompanyLayout: React.FC<CompanyLayoutProps> = ({ currentPage, navigate, pageData, companyData, theme, setTheme, onLogout }) => {
    const [expandedGroup, setExpandedGroup] = useState<string | null>(() => {
        const group = navGroups.find(g => g.items.some(i => i.page === currentPage));
        return group ? group.title : 'Dashboard';
    });

    const toggleGroup = (title: string) => {
        setExpandedGroup(prev => prev === title ? null : title);
    };
    
    const renderContent = () => {
        switch (currentPage) {
            case 'companyDashboard': return <CompanyDashboard companyPin={companyData.pin} />;
            case 'companyBuses': return <CompanyBuses companyId={companyData.id} />;
            case 'companyDrivers': return <CompanyDrivers companyId={companyData.id} navigate={navigate} />;
            case 'companyDriverProfile': return <CompanyDriverProfile driver={pageData} onBack={() => navigate('companyDrivers')} />;
            case 'companyRoutes': return <CompanyRoutes companyId={companyData.id} />;
            case 'companyPassengers': return <CompanyPassengers />;
            case 'companyFinancials': return <CompanyFinancials />;
            case 'companySettings': return <CompanySettings companyData={companyData} />;
            case 'fleetMonitoring': return <FleetMonitoring />;
            case 'companyRouteAnalytics': return <CompanyRouteAnalytics />;
            default: return <CompanyDashboard companyPin={companyData.pin} />;
        }
    };
    
    return (
        <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-gray-300 flex-col flex transition-all duration-300 shadow-2xl z-20 fixed h-full">
                 <div className="h-20 flex items-center px-6 bg-gradient-to-r from-blue-900 to-gray-900 border-b border-white/10">
                    <div className="flex items-center gap-3 overflow-hidden">
                         <div className="w-10 h-10 rounded-lg bg-white p-1 flex-shrink-0">
                             <img src={companyData?.logoUrl || 'https://via.placeholder.com/40'} alt="Logo" className="w-full h-full object-contain"/>
                         </div>
                        <span className="font-bold text-white truncate">{companyData?.name || 'Company'}</span>
                    </div>
                </div>

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

                 {/* Sidebar Footer */}
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
                    <button onClick={onLogout} className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg shadow-lg transition-all transform hover:-translate-y-0.5">
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
                </header>
                <main className="flex-1 p-8 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default CompanyLayout;
