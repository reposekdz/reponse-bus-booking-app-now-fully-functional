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
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-transparent to-green-100 dark:from-blue-900/30 dark:via-transparent dark:to-green-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute -right-4 -bottom-4 text-gray-200/20 dark:text-gray-900/20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
            {React.cloneElement(icon, { className: "w-20 h-20" })}
        </div>
        <div className="relative">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {typeof value === 'number' ? new Intl.NumberFormat('fr-RW').format(value) : value}
            </p>
        </div>
    </div>
);


interface FormModalProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    onSave: (e: React.FormEvent<HTMLFormElement>) => void;
    isSaving?: boolean;
}

const FormModal: React.FC<FormModalProps> = ({ title, children, onClose, onSave, isSaving = false }) => (
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

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    
    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
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
             <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-md space-y-4">
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

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget);
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
            <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-md">
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

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget);
        const routeData = Object.fromEntries(formData.entries());
        if (editingRoute) {
            onUpdate(routes.map(r => r.id === editingRoute.id ? { ...r, ...routeData } : r));
        } else {
            onUpdate([...routes, { ...routeData, id: `route_${Date.now()}` }]);
        }
        setIsModalOpen(false);
        setEditingRoute(null);
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
            <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-md">
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
        <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-md">
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
         <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-md">
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
const SchedulingManagement = ({ company, onUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(company.routes.length > 0 ? `${company.routes[0].from}-${company.routes[0].to}` : '');

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget);
        const scheduleData = Object.fromEntries(formData.entries());
        const updatedSchedule = { ...company.schedule };
        const routeSchedules = updatedSchedule[selectedRoute] ? [...updatedSchedule[selectedRoute]] : [];

        if (editingSchedule) {
            const index = routeSchedules.findIndex(s => s.id === editingSchedule.id);
            routeSchedules[index] = { ...routeSchedules[index], ...scheduleData };
        } else {
            routeSchedules.push({ ...scheduleData, id: `sch_${Date.now()}` });
        }
        updatedSchedule[selectedRoute] = routeSchedules;
        onUpdate({ schedule: updatedSchedule });
        setIsModalOpen(false);
        setEditingSchedule(null);
    };

    const handleDelete = (id: string) => {
        if (!window.confirm("Are you sure?")) return;
        const updatedSchedule = { ...company.schedule };
        updatedSchedule[selectedRoute] = updatedSchedule[selectedRoute].filter(s => s.id !== id);
        onUpdate({ schedule: updatedSchedule });
    }

    const currentSchedules = company.schedule?.[selectedRoute] || [];

    return (
        <div>
            <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">Manage Schedules</h1>
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <div>
                        <label htmlFor="route-select" className="text-sm font-medium text-gray-500 dark:text-gray-400">Select Route</label>
                        <select id="route-select" value={selectedRoute} onChange={e => setSelectedRoute(e.target.value)} className="mt-1 block w-full sm:w-64 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                            {company.routes.map(r => <option key={r.id} value={`${r.from}-${r.to}`}>{r.from} to {r.to}</option>)}
                        </select>
                    </div>
                    <button onClick={() => { setEditingSchedule(null); setIsModalOpen(true); }} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700" disabled={!selectedRoute}>
                        <PlusIcon className="w-5 h-5 mr-2"/>Add Departure
                    </button>
                </div>
                <table className="w-full text-sm">
                    <thead><tr className="text-left text-xs text-gray-500 uppercase"><th className="p-2">Time</th><th>Bus ID</th><th>Price (RWF)</th><th>Actions</th></tr></thead>
                    <tbody>
                        {currentSchedules.map(sch => (
                            <tr key={sch.id} className="border-t dark:border-gray-700">
                                <td className="p-2 font-semibold dark:text-white">{sch.time}</td>
                                <td>{sch.busId}</td>
                                <td>{new Intl.NumberFormat('fr-RW').format(sch.price)}</td>
                                <td className="flex space-x-2 py-2">
                                    <button onClick={() => { setEditingSchedule(sch); setIsModalOpen(true); }}><PencilSquareIcon className="w-5 h-5 text-gray-500 hover:text-blue-600"/></button>
                                    <button onClick={() => handleDelete(sch.id)}><TrashIcon className="w-5 h-5 text-gray-500 hover:text-red-600"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {currentSchedules.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4">No schedules for this route.</p>}
            </div>
            {isModalOpen && (
                <FormModal title={editingSchedule ? 'Edit Schedule' : 'Add Schedule'} onClose={() => setIsModalOpen(false)} onSave={handleSave}>
                    <div><label>Time</label><input name="time" type="time" defaultValue={editingSchedule?.time} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/></div>
                    <div><label>Bus</label><select name="busId" defaultValue={editingSchedule?.busId} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required>
                        {company.fleetDetails.map(f => <option key={f.id} value={f.id}>{f.model} ({f.id})</option>)}
                    </select></div>
                    <div><label>Price</label><input name="price" type="number" defaultValue={editingSchedule?.price || company.routes.find(r => `${r.from}-${r.to}` === selectedRoute)?.price} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/></div>
                </FormModal>
            )}
        </div>
    );
};
const PromotionsManagement = ({ promotions, onUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState(null);

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget);
        const promoData = Object.fromEntries(formData.entries());
        if (editingPromo) {
            onUpdate(promotions.map(p => p.id === editingPromo.id ? { ...p, ...promoData } : p));
        } else {
            onUpdate([...promotions, { ...promoData, id: `promo_${Date.now()}` }]);
        }
        setIsModalOpen(false);
        setEditingPromo(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold dark:text-gray-200">Manage Promotions</h1>
                <button onClick={() => { setEditingPromo(null); setIsModalOpen(true); }} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
                    <PlusIcon className="w-5 h-5 mr-2"/>Create Promotion
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-md">
                 <table className="w-full text-sm">
                    <thead><tr className="text-left text-xs text-gray-500 uppercase"><th className="p-2">Title</th><th>Code</th><th>Expires</th><th>Actions</th></tr></thead>
                    <tbody>
                        {promotions.map(promo => (
                            <tr key={promo.id} className="border-t dark:border-gray-700">
                                <td className="p-2 font-semibold dark:text-white">{promo.title}</td>
                                <td className="font-mono">{promo.code}</td>
                                <td>{promo.expiryDate}</td>
                                <td className="flex space-x-2 py-2">
                                    <button onClick={() => { setEditingPromo(promo); setIsModalOpen(true); }}><PencilSquareIcon className="w-5 h-5 text-gray-500 hover:text-blue-600"/></button>
                                    <button onClick={() => onUpdate(promotions.filter(p => p.id !== promo.id))}><TrashIcon className="w-5 h-5 text-gray-500 hover:text-red-600"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <FormModal title={editingPromo ? 'Edit Promotion' : 'Create Promotion'} onClose={() => setIsModalOpen(false)} onSave={handleSave}>
                    <div><label>Title</label><input name="title" defaultValue={editingPromo?.title} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/></div>
                    <div><label>Description</label><textarea name="description" defaultValue={editingPromo?.description} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/></div>
                    <div><label>Promo Code</label><input name="code" defaultValue={editingPromo?.code} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/></div>
                    <div><label>Expiry Date</label><input name="expiryDate" type="date" defaultValue={editingPromo?.expiryDate} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/></div>
                </FormModal>
            )}
        </div>
    );
};

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
                        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-md">
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
                return <PromotionsManagement promotions={company.promotions} onUpdate={(newPromos) => handleUpdate({ promotions: newPromos })} />;
            default:
                 return <div><h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Page Not Found</h1></div>;
        }
    };

    const NavLink = ({ viewName, label, icon: Icon }) => (
      <button onClick={() => setView(viewName)} className={`group w-full flex items-center px-4 py-3 transition-all duration-300 rounded-lg relative ${view === viewName ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
          <div className={`absolute left-0 top-0 h-full w-1 rounded-r-full bg-yellow-400 transition-all duration-300 ${view === viewName ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-50'}`}></div>
          <Icon className="w-6 h-6 mr-4 transition-transform duration-300 group-hover:scale-110" />
          <span className="font-semibold">{label}</span>
      </button>
  );

    return (
        <div className={`min-h-screen flex ${theme}`}>
            <aside className="w-64 bg-gradient-to-b from-gray-800 via-gray-900 to-black text-gray-300 flex-col hidden lg:flex border-r border-gray-700/50">
                <div className="h-20 flex items-center justify-center text-white font-bold text-xl border-b border-white/10">
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
                <header className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm flex items-center justify-between px-6 border-b dark:border-gray-700/50">
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