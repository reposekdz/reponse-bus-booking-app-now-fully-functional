
import React from 'react';
import { Page } from '../App';
import { ChartBarIcon, BuildingOfficeIcon, UsersIcon, BriefcaseIcon, SunIcon, MoonIcon, MegaphoneIcon, TagIcon, CurrencyDollarIcon } from '../components/icons';
import AdminDashboard from './AdminDashboard';
import ManageCompanies from './ManageCompanies';
import ManageDrivers from './ManageDrivers';
import ManageAgents from './ManageAgents';
import ManagePassengers from './ManagePassengers';
import ManageUsers from './ManageUsers';
import AdminFinancials from './AdminFinancials';
import ManageAds from './ManageAds';
import ManagePromotions from './ManagePromotions';

interface AdminLayoutProps {
    currentPage: Page;
    navigate: (page: Page, data?: any) => void;
}

const navItems: { page: Page; label: string; icon: React.FC<any> }[] = [
    { page: 'adminDashboard', label: 'Dashboard', icon: ChartBarIcon },
    { page: 'adminFinancials', label: 'Financials', icon: CurrencyDollarIcon },
    { page: 'adminCompanies', label: 'Companies', icon: BuildingOfficeIcon },
    { page: 'adminDrivers', label: 'Drivers', icon: UsersIcon },
    { page: 'adminAgents', label: 'Agents', icon: BriefcaseIcon },
    { page: 'adminUsers', label: 'All Users', icon: UsersIcon },
    { page: 'adminPromotions', label: 'Promotions', icon: TagIcon },
    { page: 'adminAds', label: 'Adverts', icon: MegaphoneIcon },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ currentPage, navigate }) => {
    
    const renderContent = () => {
        switch (currentPage) {
            case 'adminDashboard': return <AdminDashboard />;
            case 'adminCompanies': return <ManageCompanies />;
            case 'adminDrivers': return <ManageDrivers navigate={navigate} />;
            case 'adminAgents': return <ManageAgents navigate={navigate} />;
            case 'adminPassengers': return <ManagePassengers />;
            case 'adminUsers': return <ManageUsers />;
            case 'adminFinancials': return <AdminFinancials />;
            case 'adminAds': return <ManageAds />;
            case 'adminPromotions': return <ManagePromotions />;
            default: return <AdminDashboard />;
        }
    };
    
    return (
        <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
            <aside className="w-64 bg-gradient-to-b from-gray-800 via-gray-900 to-black text-gray-300 flex-col hidden lg:flex">
                <div className="h-20 flex items-center justify-center text-white font-bold text-xl border-b border-white/10">ADMIN PANEL</div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map(item => (
                        <button key={item.page} onClick={() => navigate(item.page)} className={`group w-full flex items-center px-4 py-3 transition-all duration-300 rounded-lg relative ${currentPage === item.page ? 'text-white bg-white/10' : 'hover:text-white hover:bg-white/5'}`}>
                            <div className={`absolute left-0 top-0 h-full w-1 rounded-r-full bg-yellow-400 transition-all duration-300 ${currentPage === item.page ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-50'}`}></div>
                            <item.icon className="w-6 h-6 mr-4 transition-transform duration-300 group-hover:scale-110" />
                            <span className="font-semibold">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>
            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm flex items-center justify-between px-6">
                    <div className="font-bold text-gray-800 dark:text-white">Welcome, Admin</div>
                    {/* Header items */}
                </header>
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
