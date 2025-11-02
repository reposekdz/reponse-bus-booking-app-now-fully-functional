
import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import ManageCompanies from './ManageCompanies';
import ManageDrivers from './ManageDrivers';
import ManageAgents from './ManageAgents';
import ManagePassengers from './ManagePassengers';
import { ChartBarIcon, BuildingOfficeIcon, UsersIcon, BriefcaseIcon, BusIcon, SunIcon, MoonIcon, CogIcon } from '../components/icons';

// Data
import { mockCompaniesData } from './AdminDashboard';

const mockDriversData = [
  { id: 1, name: 'John Doe', companyId: 'volcano', assignedBusId: 'VB01', phone: '0788111222', status: 'Active' },
  { id: 2, name: 'Peter Jones', companyId: 'ritco', assignedBusId: 'RT01', phone: '0788333444', status: 'Active' },
];
const mockAgentsData = [
    { id: 1, name: 'Jane Smith', location: 'Nyabugogo', commissionRate: 0.05, totalDeposits: 1250000, status: 'Active' },
    { id: 2, name: 'Chris Lee', location: 'Huye', commissionRate: 0.05, totalDeposits: 850000, status: 'Active' },
];
const mockBusesData = [
    { id: 'VB01', plate: 'RAD 123 B', companyId: 'volcano', capacity: 55, status: 'On Route' },
    { id: 'RT01', plate: 'RAE 456 C', companyId: 'ritco', capacity: 70, status: 'Idle' },
];

interface AdminLayoutProps {
    onLogout: () => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout, theme, setTheme }) => {
    const [activeView, setActiveView] = useState('dashboard');
    const [companies, setCompanies] = useState(mockCompaniesData);
    const [drivers, setDrivers] = useState(mockDriversData);
    const [agents, setAgents] = useState(mockAgentsData);
    const [buses, setBuses] = useState(mockBusesData);

    const crudHandlers = {
        addCompany: (data) => setCompanies(prev => [...prev, { ...data, id: Date.now().toString(), totalPassengers: 0, totalRevenue: 0, routes: [] }]),
        updateCompany: (data) => setCompanies(prev => prev.map(c => c.id === data.id ? data : c)),
        deleteCompany: (id) => setCompanies(prev => prev.filter(c => c.id !== id)),
    };

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    const renderView = () => {
        switch (activeView) {
            case 'dashboard': return <AdminDashboard companies={companies} drivers={drivers} agents={agents} buses={buses} />;
            case 'companies': return <ManageCompanies companies={companies} crudHandlers={crudHandlers} />;
            case 'drivers': return <ManageDrivers drivers={drivers} crudHandlers={{}} />;
            case 'agents': return <ManageAgents agents={agents} crudHandlers={{}} />;
            case 'passengers': return <ManagePassengers />;
            default: return <AdminDashboard companies={companies} drivers={drivers} agents={agents} buses={buses} />;
        }
    };

    const NavLink = ({ view, label, icon: Icon }) => (
        <button onClick={() => setActiveView(view)} className={`group w-full flex items-center px-4 py-3 transition-all duration-300 rounded-lg relative ${activeView === view ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <div className={`absolute left-0 top-0 h-full w-1 rounded-r-full bg-yellow-400 transition-all duration-300 ${activeView === view ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-50'}`}></div>
            <Icon className="w-6 h-6 mr-4 transition-transform duration-300 group-hover:scale-110" />
            <span className="font-semibold">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen flex">
            <aside className="w-64 bg-gradient-to-b from-gray-800 via-gray-900 to-black text-gray-300 flex-col hidden lg:flex border-r border-gray-700/50">
                <div className="h-20 flex items-center justify-center text-white font-bold text-xl border-b border-white/10">ADMIN PANEL</div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <NavLink view="dashboard" label="Dashboard" icon={ChartBarIcon} />
                    <NavLink view="companies" label="Companies" icon={BuildingOfficeIcon} />
                    <NavLink view="drivers" label="Drivers" icon={UsersIcon} />
                    <NavLink view="agents" label="Agents" icon={BriefcaseIcon} />
                    <NavLink view="passengers" label="Passengers" icon={UsersIcon} />
                </nav>
            </aside>
            <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900">
                <header className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm flex items-center justify-between px-6 border-b dark:border-gray-700/50">
                    <div className="font-bold text-gray-800 dark:text-white">Admin Overview</div>
                    <div className="flex items-center space-x-4">
                        <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400">{theme === 'light' ? <MoonIcon className="w-6 h-6"/> : <SunIcon className="w-6 h-6"/>}</button>
                        <button onClick={onLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Logout</button>
                    </div>
                </header>
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
