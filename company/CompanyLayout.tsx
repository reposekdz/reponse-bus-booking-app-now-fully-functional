

import React, { useState } from 'react';
import { SunIcon, MoonIcon, CogIcon, UsersIcon, ChartBarIcon, BusIcon, MapIcon, WalletIcon } from '../components/icons';
import CompanyDashboard from './CompanyDashboard';
import CompanyBuses from './CompanyBuses';
import CompanyDrivers from './CompanyDrivers';
import CompanyRoutes from './CompanyRoutes';
import CompanyPassengers from './CompanyPassengers';
import CompanyFinancials from './CompanyFinancials';
import CompanySettings from './CompanySettings';
import FleetMonitoring from './FleetMonitoring';

interface CompanyLayoutProps {
    onLogout: () => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    companyData: any;
}

const mockDrivers = [
    { id: 1, name: 'John Doe', assignedBusId: 'VB01', status: 'Active', phone: '0788111222' },
    { id: 2, name: 'Mike Ross', assignedBusId: 'VB02', status: 'On Leave', phone: '0788222333' },
];

const mockBuses = [
    { id: 1, plate: 'RAD 123 B', model: 'Yutong Explorer', capacity: 55, status: 'Operational', maintenanceDate: '2025-01-15' },
    { id: 2, plate: 'RAE 456 C', model: 'Coaster Bus', capacity: 30, status: 'On Route', maintenanceDate: '2024-12-20' },
];

const mockRoutes = [
    { id: 1, from: 'Kigali', to: 'Rubavu', duration: '3.5h', basePrice: 4500, activeSchedules: 5 },
    { id: 2, from: 'Kigali', to: 'Musanze', duration: '2h', basePrice: 3500, activeSchedules: 3 },
];

const CompanyLayout: React.FC<CompanyLayoutProps> = ({ onLogout, theme, setTheme, companyData }) => {
    const [view, setView] = useState('dashboard');
    const [drivers, setDrivers] = useState(mockDrivers);
    const [buses, setBuses] = useState(mockBuses);
    const [routes, setRoutes] = useState(mockRoutes);

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    const crudHandlers = {
        // Placeholder CRUD handlers
        addBus: (bus) => setBuses(prev => [...prev, { ...bus, id: Date.now() }]),
        updateBus: (updatedBus) => setBuses(prev => prev.map(b => b.id === updatedBus.id ? updatedBus : b)),
        deleteBus: (id) => setBuses(prev => prev.filter(b => b.id !== id)),
        addDriver: (driver) => setDrivers(prev => [...prev, { ...driver, id: Date.now() }]),
        updateDriver: (updatedDriver) => setDrivers(prev => prev.map(d => d.id === updatedDriver.id ? updatedDriver : d)),
        deleteDriver: (id) => setDrivers(prev => prev.filter(d => d.id !== id)),
        addRoute: (route) => setRoutes(prev => [...prev, { ...route, id: Date.now() }]),
        updateRoute: (updatedRoute) => setRoutes(prev => prev.map(r => r.id === updatedRoute.id ? updatedRoute : r)),
        deleteRoute: (id) => setRoutes(prev => prev.filter(r => r.id !== id)),
    };

    const NavLink = ({ viewName, label, icon: Icon }) => (
      <button onClick={() => setView(viewName)} className={`group w-full flex items-center px-4 py-3 transition-all duration-300 rounded-lg relative ${view === viewName ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
          <div className={`absolute left-0 top-0 h-full w-1 rounded-r-full bg-yellow-400 transition-all duration-300 ${view === viewName ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-50'}`}></div>
          <Icon className="w-6 h-6 mr-4" />
          <span className="font-semibold">{label}</span>
      </button>
    );

    const renderContent = () => {
        switch(view) {
            case 'buses': return <CompanyBuses buses={buses} crudHandlers={crudHandlers} companyId={companyData.id}/>;
            case 'drivers': return <CompanyDrivers drivers={drivers} crudHandlers={crudHandlers} companyId={companyData.id}/>;
            case 'routes': return <CompanyRoutes routes={routes} crudHandlers={crudHandlers} companyId={companyData.id}/>;
            case 'fleet': return <FleetMonitoring buses={buses} />;
            case 'passengers': return <CompanyPassengers />;
            case 'financials': return <CompanyFinancials />;
            case 'settings': return <CompanySettings companyData={companyData} />;
            case 'dashboard':
            default:
                return <CompanyDashboard drivers={drivers} buses={buses} routes={routes} companyPin={companyData.pin} />;
        }
    };

    return (
        <div className={`min-h-screen flex ${theme}`}>
            <aside className="w-64 bg-gradient-to-b from-gray-800 via-gray-900 to-black text-gray-300 flex-col hidden lg:flex border-r border-gray-700/50">
                <div className="h-16 flex items-center justify-center border-b border-white/10">
                     <img src={companyData.logoUrl} alt={companyData.name} className="w-10 h-10 object-contain bg-white/10 rounded-full p-1 mr-2"/>
                     <span className="text-white font-bold text-lg">{companyData.name}</span>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <NavLink viewName="dashboard" label="Dashboard" icon={ChartBarIcon} />
                    <NavLink viewName="routes" label="Routes & Schedules" icon={MapIcon} />
                    <NavLink viewName="fleet" label="Fleet Monitoring" icon={BusIcon} />
                    <NavLink viewName="buses" label="Manage Buses" icon={BusIcon} />
                    <NavLink viewName="drivers" label="Manage Drivers" icon={UsersIcon} />
                    <NavLink viewName="passengers" label="Passenger History" icon={UsersIcon} />
                    <NavLink viewName="financials" label="Financials" icon={WalletIcon} />
                    <NavLink viewName="settings" label="Settings" icon={CogIcon} />
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
                   <div className="animate-fade-in">{renderContent()}</div>
                </main>
            </div>
        </div>
    );
};

export default CompanyLayout;
