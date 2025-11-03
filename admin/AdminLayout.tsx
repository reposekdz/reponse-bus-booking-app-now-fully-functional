

import React, { useState } from 'react';
import { SunIcon, MoonIcon, CogIcon, UsersIcon, ChartBarIcon, BusIcon, BriefcaseIcon, TagIcon, ArchiveBoxIcon, BuildingOfficeIcon, CurrencyDollarIcon, MegaphoneIcon } from '../components/icons';
import { Page } from '../App';
import AdminDashboard, { mockCompaniesData } from './AdminDashboard';
import ManageCompanies from './ManageCompanies';
import ManageDrivers from './ManageDrivers';
import ManageAgents from './ManageAgents';
import ManagePassengers from './ManagePassengers';
import ManageAds from './ManageAds';
import ManagePromotions from './ManagePromotions';
import ManageUsers from './ManageUsers';
import AdminFinancials from './AdminFinancials';
import PlatformAnnouncements from './PlatformAnnouncements';

interface AdminLayoutProps {
    onLogout: () => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    navigate: (page: Page, data?: any) => void;
}

const mockDrivers = [
    { id: 1, name: 'John Doe', companyId: 'volcano', assignedBusId: 'VB01', phone: '0788111222', status: 'Active', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop', email: 'driver@volcano.rw', joinDate: '2022-03-10', bio: 'Experienced driver with over 10 years on the road. Specialized in long-distance routes.', certifications: [{id: 'CERT-001', name: 'Professional Driving Permit', expiry: '2025-12-31'}]},
    { id: 2, name: 'Peter Jones', companyId: 'ritco', assignedBusId: 'RT05', phone: '0788222333', status: 'Active', avatarUrl: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?q=80&w=1964&auto=format&fit=crop', email: 'p.jones@ritco.rw', joinDate: '2021-08-20', bio: 'Safety-first driver, with a passion for customer service.', certifications: [] },
];

const mockAgents = [
    { id: 1, name: 'Jane Smith', location: 'Nyabugogo', commissionRate: 0.05, totalDeposits: 4500000, status: 'Active', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop', email: 'jane.s@agent.rw', phone: '0788444555' },
    { id: 2, name: 'Chris Lee', location: 'Gitarama', commissionRate: 0.05, totalDeposits: 2800000, status: 'Active', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop', email: 'chris.l@agent.rw', phone: '0788666777' },
];

const mockBuses = [
    { id: 1, plate: 'RAD 123 B', companyId: 'volcano', capacity: 55, status: 'Operational' },
    { id: 2, plate: 'RAE 456 C', companyId: 'ritco', capacity: 70, status: 'On Route' },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout, theme, setTheme, navigate }) => {
    const [view, setView] = useState('dashboard');
    const [companies, setCompanies] = useState(mockCompaniesData);
    const [drivers, setDrivers] = useState(mockDrivers);
    const [agents, setAgents] = useState(mockAgents);

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    const crudHandlers = {
        addCompany: (company) => setCompanies(prev => [...prev, { ...company, id: Date.now().toString(), totalPassengers: 0, totalRevenue: 0, routes: [] }]),
        updateCompany: (updatedCompany) => setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c)),
        deleteCompany: (id) => setCompanies(prev => prev.filter(c => c.id !== id)),
        // Placeholder handlers for others
        addDriver: (driver) => setDrivers(prev => [...prev, { ...driver, id: Date.now() }]),
        updateDriver: (updatedDriver) => setDrivers(prev => prev.map(d => d.id === updatedDriver.id ? updatedDriver : d)),
        deleteDriver: (id) => setDrivers(prev => prev.filter(d => d.id !== id)),
        addAgent: (agent) => setAgents(prev => [...prev, { ...agent, id: Date.now(), totalDeposits: 0 }]),
        updateAgent: (updatedAgent) => setAgents(prev => prev.map(a => a.id === updatedAgent.id ? updatedAgent : a)),
        deleteAgent: (id) => setAgents(prev => prev.filter(a => a.id !== id)),
    };

    const NavLink = ({ viewName, label, icon: Icon }) => (
      <button onClick={() => setView(viewName)} className={`group w-full flex items-center px-4 py-3 transition-all duration-300 rounded-lg relative ${view === viewName ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
          <div className={`absolute left-0 top-0 h-full w-1 rounded-r-full bg-yellow-400 transition-all duration-300 ${view === viewName ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-50'}`}></div>
          <Icon className="w-6 h-6 mr-4 transition-transform duration-300 group-hover:scale-110" />
          <span className="font-semibold">{label}</span>
      </button>
    );

    const renderContent = () => {
        switch(view) {
            case 'companies': return <ManageCompanies companies={companies} crudHandlers={crudHandlers} />;
            case 'drivers': return <ManageDrivers drivers={drivers} companies={companies} crudHandlers={crudHandlers} navigate={navigate} />;
            case 'agents': return <ManageAgents agents={agents} crudHandlers={crudHandlers} navigate={navigate} />;
            case 'passengers': return <ManagePassengers />;
            case 'users': return <ManageUsers />;
            case 'financials': return <AdminFinancials />;
            case 'announcements': return <PlatformAnnouncements />;
            case 'ads': return <ManageAds />;
            case 'promotions': return <ManagePromotions />;
            case 'dashboard':
            default:
                return <AdminDashboard companies={companies} drivers={drivers} agents={agents} buses={mockBuses} />;
        }
    };

    return (
        <div className={`min-h-screen flex ${theme}`}>
            <aside className="w-64 bg-gradient-to-b from-gray-800 via-gray-900 to-black text-gray-300 flex-col hidden lg:flex border-r border-gray-700/50">
                <div className="h-16 flex items-center justify-center text-white font-bold text-xl border-b border-white/10">ADMIN</div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <NavLink viewName="dashboard" label="Dashboard" icon={ChartBarIcon} />
                    <NavLink viewName="financials" label="Financials" icon={CurrencyDollarIcon} />
                    <NavLink viewName="users" label="User Management" icon={UsersIcon} />
                    <NavLink viewName="companies" label="Manage Companies" icon={BuildingOfficeIcon} />
                    <NavLink viewName="drivers" label="Manage Drivers" icon={BusIcon} />
                    <NavLink viewName="agents" label="Manage Agents" icon={BriefcaseIcon} />
                    <NavLink viewName="promotions" label="Promotions" icon={TagIcon} />
                    <NavLink viewName="announcements" label="Announcements" icon={MegaphoneIcon} />
                </nav>
            </aside>
            <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900">
                <header className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm flex items-center justify-between px-6 border-b dark:border-gray-700/50">
                    <div className="font-bold text-gray-800 dark:text-white">Admin Portal</div>
                    <div className="flex items-center space-x-4">
                        <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400">{theme === 'light' ? <MoonIcon className="w-6 h-6"/> : <SunIcon className="w-6 h-6"/>}</button>
                        <button onClick={onLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Logout</button>
                    </div>
                </header>
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                   <div className="animate-fade-in">{renderContent()}</div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
