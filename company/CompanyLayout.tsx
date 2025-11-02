
import React, { useState } from 'react';
import CompanyDashboard from './CompanyDashboard';
import CompanyBuses from './CompanyBuses';
import CompanyDrivers from './CompanyDrivers';
import CompanyRoutes from './CompanyRoutes';
import CompanyPassengers from './CompanyPassengers';
import { ChartBarIcon, BuildingOfficeIcon, UsersIcon, BusIcon, MapIcon, SunIcon, MoonIcon } from '../components/icons';

interface CompanyLayoutProps {
    onLogout: () => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    companyData: any;
}

const CompanyLayout: React.FC<CompanyLayoutProps> = ({ onLogout, theme, setTheme, companyData }) => {
    const [activeView, setActiveView] = useState('dashboard');
    const [drivers, setDrivers] = useState([
        { id: 1, name: 'John Doe', assignedBusId: 'VB01', phone: '0788111222', license: 'D12345', status: 'Active' },
    ]);
    const [buses, setBuses] = useState([
        { id: 'VB01', plate: 'RAD 123 B', model: 'Yutong Explorer', capacity: 55, status: 'On Route' },
        { id: 'VB02', plate: 'RAD 124 B', model: 'Coaster Bus', capacity: 30, status: 'Idle' },
    ]);
    const [routes, setRoutes] = useState([
        { id: 1, from: 'Kigali', to: 'Rubavu', duration: '3.5h', basePrice: 4500, activeSchedules: 4 },
        { id: 2, from: 'Kigali', to: 'Musanze', duration: '2h', basePrice: 3500, activeSchedules: 2 },
    ]);

    const crudHandlers = {
        // Mock handlers
        addRoute: (data) => setRoutes(prev => [...prev, { ...data, id: Date.now() }]),
        updateRoute: (data) => setRoutes(prev => prev.map(r => r.id === data.id ? data : r)),
        deleteRoute: (id) => setRoutes(prev => prev.filter(r => r.id !== id)),
    };
    
    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    const renderView = () => {
        switch (activeView) {
            case 'dashboard': return <CompanyDashboard drivers={drivers} buses={buses} routes={routes} />;
            case 'buses': return <CompanyBuses buses={buses} crudHandlers={{}} />;
            case 'drivers': return <CompanyDrivers drivers={drivers} crudHandlers={{}} />;
            case 'routes': return <CompanyRoutes routes={routes} crudHandlers={crudHandlers} companyId={companyData.id} />;
            case 'passengers': return <CompanyPassengers />;
            default: return <CompanyDashboard drivers={drivers} buses={buses} routes={routes} />;
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
                <div className="h-20 flex items-center justify-center text-white font-bold text-xl border-b border-white/10">{companyData.name}</div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <NavLink view="dashboard" label="Dashboard" icon={ChartBarIcon} />
                    <NavLink view="buses" label="Buses" icon={BusIcon} />
                    <NavLink view="drivers" label="Drivers" icon={UsersIcon} />
                    <NavLink view="routes" label="Routes" icon={MapIcon} />
                    <NavLink view="passengers" label="Passengers" icon={UsersIcon} />
                </nav>
            </aside>
            <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900">
                <header className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm flex items-center justify-between px-6 border-b dark:border-gray-700/50">
                    <div className="font-bold text-gray-800 dark:text-white">Company Portal</div>
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

export default CompanyLayout;
