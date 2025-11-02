import React, { useState, useMemo, ChangeEvent, FormEvent } from 'react';
import {
    SunIcon, MoonIcon, CogIcon, UsersIcon, ChartBarIcon, BuildingOfficeIcon,
    BusIcon, MapIcon, PencilSquareIcon, TrashIcon, PlusIcon, ArrowUpTrayIcon, WalletIcon, ClockIcon, TagIcon, XIcon
} from './components/icons';

interface CompanyDashboardProps {
    onLogout: () => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    companyData: any;
}

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center space-x-4">
        <div className="p-3 bg-blue-100 dark:bg-gray-700 rounded-lg">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {typeof value === 'number' ? new Intl.NumberFormat('fr-RW').format(value) : value}
            </p>
        </div>
    </div>
);

const FormModal = ({ title, children, onClose, onSave, isSaving = false }) => (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold dark:text-white">{title}</h3>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><XIcon className="w-5 h-5"/></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); onSave(e); }} className="space-y-4">
                {children}
                <div className="flex justify-end space-x-4 pt-4 border-t dark:border-gray-700">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg dark:border-gray-600">Cancel</button>
                    <button type="submit" disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    </div>
);

// Management Components
const ProfileManagement = ({ company, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...company });

    // FIX: Add types to event handler
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    
    // FIX: Add types to event handler to match other usages
    const handleSave = (e: FormEvent) => {
        onUpdate(formData);
        setIsEditing(false);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Manage Profile</h1>
                <button onClick={() => setIsEditing(true)} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                    <PencilSquareIcon className="w-5 h-5 mr-2" /> Edit Profile
                </button>
            </div>
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-4">
                <div><strong className="text-gray-500 dark:text-gray-400">Name:</strong> {company.name}</div>
                <div><strong className="text-gray-500 dark:text-gray-400">Email:</strong> {company.contactEmail}</div>
                <div><strong className="text-gray-500 dark:text-gray-400">Description:</strong> {company.description}</div>
            </div>
            {isEditing && (
                <FormModal title="Edit Profile" onClose={() => setIsEditing(false)} onSave={handleSave}>
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Company Name" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
                </FormModal>
            )}
        </div>
    );
};
const FleetManagement = ({ fleet, onUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBus, setEditingBus] = useState(null);

    const handleSave = (e) => {
        const formData = new FormData(e.target);
        const busData = Object.fromEntries(formData.entries());
        if (editingBus) {
            onUpdate(fleet.map(b => b.id === editingBus.id ? {...b, ...busData} : b));
        } else {
            onUpdate([...fleet, { ...busData, id: `bus_${Date.now()}` }]);
        }
        setIsModalOpen(false);
        setEditingBus(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure?')) onUpdate(fleet.filter(b => b.id !== id));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold dark:text-gray-200">Manage Fleet</h1>
                <button onClick={() => { setEditingBus(null); setIsModalOpen(true); }} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
                    <PlusIcon className="w-5 h-5 mr-2"/>Add Bus
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <table className="w-full text-sm">
                    <thead><tr className="text-left text-xs text-gray-500 uppercase"><th className="p-2">Model</th><th>Capacity</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>{fleet.map(bus => (
                        <tr key={bus.id} className="border-t dark:border-gray-700">
                            <td className="p-2 font-semibold dark:text-white">{bus.model}</td>
                            <td>{bus.capacity}</td>
                            <td>{bus.status}</td>
                            <td className="flex space-x-2 py-2">
                                <button onClick={() => { setEditingBus(bus); setIsModalOpen(true); }}><PencilSquareIcon className="w-5 h-5 text-gray-500 hover:text-blue-600"/></button>
                                <button onClick={() => handleDelete(bus.id)}><TrashIcon className="w-5 h-5 text-gray-500 hover:text-red-600"/></button>
                            </td>
                        </tr>
                    ))}</tbody>
                </table>
            </div>
            {isModalOpen && (
                <FormModal title={editingBus ? 'Edit Bus' : 'Add Bus'} onClose={() => setIsModalOpen(false)} onSave={handleSave}>
                    <input name="model" defaultValue={editingBus?.model} placeholder="Bus Model" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/>
                    <input name="capacity" type="number" defaultValue={editingBus?.capacity} placeholder="Capacity" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/>
                    <select name="status" defaultValue={editingBus?.status} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                        <option>Active</option><option>Maintenance</option>
                    </select>
                </FormModal>
            )}
        </div>
    );
};
const RouteManagement = ({ routes, onUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoute, setEditingRoute] = useState(null);

    const handleSave = (e) => {
        const formData = new FormData(e.target);
        const routeData = Object.fromEntries(formData.entries());
        if (editingRoute) {
            onUpdate(routes.map(r => r.id === editingRoute.id ? { ...r, ...routeData } : r));
        } else {
            onUpdate([...routes, { ...routeData, id: `route_${Date.now()}` }]);
        }
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold dark:text-gray-200">Manage Routes</h1>
                <button onClick={() => { setEditingRoute(null); setIsModalOpen(true); }} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
                    <PlusIcon className="w-5 h-5 mr-2"/>Add Route
                </button>
            </div>
            {/* Table and Modal similar to FleetManagement */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                 <table className="w-full text-sm">
                    <thead><tr className="text-left text-xs text-gray-500 uppercase"><th className="p-2">From</th><th>To</th><th>Price (RWF)</th><th>Actions</th></tr></thead>
                    <tbody>{routes.map(route => (
                        <tr key={route.id} className="border-t dark:border-gray-700">
                            <td className="p-2 font-semibold dark:text-white">{route.from}</td>
                            <td>{route.to}</td>
                            <td>{new Intl.NumberFormat('fr-RW').format(route.price)}</td>
                            <td className="flex space-x-2 py-2">
                                <button onClick={() => { setEditingRoute(route); setIsModalOpen(true); }}><PencilSquareIcon className="w-5 h-5 text-gray-500 hover:text-blue-600"/></button>
                                <button onClick={() => onUpdate(routes.filter(r => r.id !== route.id))}><TrashIcon className="w-5 h-5 text-gray-500 hover:text-red-600"/></button>
                            </td>
                        </tr>
                    ))}</tbody>
                </table>
            </div>
            {isModalOpen && (
                <FormModal title={editingRoute ? 'Edit Route' : 'Add Route'} onClose={() => setIsModalOpen(false)} onSave={handleSave}>
                    <input name="from" defaultValue={editingRoute?.from} placeholder="From" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/>
                    <input name="to" defaultValue={editingRoute?.to} placeholder="To" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/>
                    <input name="price" type="number" defaultValue={editingRoute?.price} placeholder="Price" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/>
                </FormModal>
            )}
        </div>
    );
};
const PassengerManagement = ({ passengers }) => (
    <div>
        <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">Recent Passengers</h1>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
            <table className="w-full text-sm">
                <thead><tr className="text-left text-xs text-gray-500 uppercase"><th className="p-2">Name</th><th>Route</th><th>Ticket ID</th><th>Date</th></tr></thead>
                <tbody>{passengers.map(p => (
                    <tr key={p.ticketId} className="border-t dark:border-gray-700"><td className="p-2 font-semibold dark:text-white">{p.name}</td><td>{p.route}</td><td>{p.ticketId}</td><td>{p.date}</td></tr>
                ))}</tbody>
            </table>
        </div>
    </div>
);

const FinancialsManagement = ({ wallet }) => (
    <div>
        <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">Financials</h1>
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-xl shadow-lg mb-6">
            <p className="text-sm opacity-80">Current Wallet Balance</p>
            <p className="text-4xl font-bold mt-1">{new Intl.NumberFormat('fr-RW', { style: 'currency', currency: 'RWF' }).format(wallet.balance)}</p>
        </div>
         <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
            <h3 className="font-bold text-lg mb-2 dark:text-white">Transaction History</h3>
            <table className="w-full text-sm">
                 <thead><tr className="text-left text-xs text-gray-500 uppercase"><th className="p-2">Date</th><th>Description</th><th>Amount</th><th>Status</th></tr></thead>
                 <tbody>{wallet.transactions.map(tx => (
                     <tr key={tx.id} className="border-t dark:border-gray-700">
                        <td className="p-2">{tx.date}</td>
                        <td className="font-semibold dark:text-white">{tx.description}</td>
                        <td className={`font-bold ${tx.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>{new Intl.NumberFormat('fr-RW').format(tx.amount)}</td>
                        <td>{tx.status}</td>
                    </tr>
                 ))}</tbody>
            </table>
        </div>
    </div>
);
const SchedulingManagement = ({ company, onUpdate }) => { return (<div> <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Manage Schedules</h1> <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center"> <ClockIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" /> <h3 className="text-xl font-bold dark:text-white">Coming Soon</h3> <p className="text-gray-500 dark:text-gray-400 mt-2">A powerful scheduling tool to manage departure times for all your routes is under construction.</p> </div> </div> ) };
const PromotionsManagement = ({ company, onUpdate }) => { return (<div> <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Manage Promotions</h1> <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center"> <TagIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" /> <h3 className="text-xl font-bold dark:text-white">Coming Soon</h3> <p className="text-gray-500 dark:text-gray-400 mt-2">Create and manage special offers and discount codes to attract more passengers.</p> </div> </div> ) }

const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ onLogout, theme, setTheme, companyData }) => {
    const [view, setView] = useState('dashboard');
    const [company, setCompany] = useState(companyData);

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
    
    const maxDailyTickets = Math.max(...(company.dailyTickets?.map(d => d.tickets) || [0]));

    const handleUpdate = (updatedData) => {
        setCompany(prev => ({ ...prev, ...updatedData }));
        // Here you would also make an API call to persist the changes
    };

    const renderContent = () => {
        switch (view) {
            case 'dashboard':
                return (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Dashboard</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                           <StatCard title="Total Revenue" value={company.totalRevenue} icon={<ChartBarIcon className="w-6 h-6 text-blue-500" />} />
                           <StatCard title="Total Passengers" value={company.totalPassengers} icon={<UsersIcon className="w-6 h-6 text-blue-500" />} />
                           <StatCard title="Fleet Size" value={company.fleetSize} icon={<BusIcon className="w-6 h-6 text-blue-500" />} />
                           <StatCard title="Active Routes" value={company.routes.length} icon={<MapIcon className="w-6 h-6 text-blue-500" />} />
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                            <h3 className="font-bold mb-4 dark:text-white">Daily Tickets Sold</h3>
                             <div className="flex items-end h-40 space-x-2">
                                {company.dailyTickets.map(data => (
                                    <div key={data.day} className="flex-1 flex flex-col items-center justify-end group">
                                        <div className="text-xs font-bold text-gray-800 dark:text-white bg-white/50 dark:bg-black/20 px-2 py-1 rounded-md mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{data.tickets}</div>
                                        <div className="w-full bg-yellow-200 dark:bg-yellow-800/80 rounded-t-lg hover:bg-yellow-300 dark:hover:bg-yellow-700 transition-colors" style={{height: `${(data.tickets / (maxDailyTickets || 1)) * 100}%`}}></div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{data.day}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'profile':
                return <ProfileManagement company={company} onUpdate={handleUpdate} />;
            case 'fleet':
                return <FleetManagement fleet={company.fleetDetails} onUpdate={(newFleet) => handleUpdate({ fleetDetails: newFleet, fleetSize: newFleet.length })} />;
            case 'routes':
                return <RouteManagement routes={company.routes} onUpdate={(newRoutes) => handleUpdate({ routes: newRoutes })} />;
            case 'passengers':
                return <PassengerManagement passengers={company.recentPassengers} />;
            case 'financials':
                return <FinancialsManagement wallet={company.wallet} />;
             case 'scheduling':
                return <SchedulingManagement company={company} onUpdate={handleUpdate} />;
            case 'promotions':
                return <PromotionsManagement company={company} onUpdate={handleUpdate} />;
            default:
                 return <div><h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Page Not Found</h1></div>;
        }
    };

    const NavLink = ({ viewName, label, icon: Icon }) => (
        <button onClick={() => setView(viewName)} className={`w-full flex items-center px-4 py-3 transition-colors duration-200 ${view === viewName ? 'text-white bg-gray-700' : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'} rounded-md`}>
            <Icon className="w-5 h-5 mr-3" />
            <span>{label}</span>
        </button>
    );

    return (
        <div className={`min-h-screen flex ${theme}`}>
            <aside className="w-64 bg-gray-800 text-gray-300 flex-col hidden lg:flex">
                <div className="h-16 flex items-center justify-center text-white font-bold text-xl border-b border-gray-700">
                    COMPANY PORTAL
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <NavLink viewName="dashboard" label="Dashboard" icon={ChartBarIcon} />
                    <NavLink viewName="profile" label="Profile" icon={BuildingOfficeIcon} />
                    <NavLink viewName="financials" label="Financials" icon={WalletIcon} />
                    <NavLink viewName="routes" label="Routes" icon={MapIcon} />
                    <NavLink viewName="fleet" label="Fleet" icon={BusIcon} />
                    <NavLink viewName="scheduling" label="Scheduling" icon={ClockIcon} />
                    <NavLink viewName="promotions" label="Promotions" icon={TagIcon} />
                    <NavLink viewName="passengers" label="Passengers" icon={UsersIcon} />
                    <NavLink viewName="settings" label="Settings" icon={CogIcon} />
                </nav>
            </aside>

            <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900">
                <header className="h-16 bg-white dark:bg-gray-800 shadow-md flex items-center justify-between px-6">
                    <div className="text-gray-800 dark:text-white font-bold">{company.name}</div>
                    <div className="flex items-center space-x-4">
                        <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400">
                            {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
                        </button>
                        <button onClick={onLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                            Logout
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default CompanyDashboard;