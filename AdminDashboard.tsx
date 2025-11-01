import React, { useState, useMemo } from 'react';
import { 
    SunIcon, MoonIcon, BellIcon, UserCircleIcon, CogIcon, UsersIcon, ChartBarIcon, BuildingOfficeIcon, 
    ArrowLeftIcon, PlusIcon, PencilSquareIcon, TrashIcon, ArrowUpTrayIcon, SearchIcon, TicketIcon, MapIcon, BusIcon
} from './components/icons';

interface AdminDashboardProps {
  onLogout: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

// MOCK DATA
const mockCompaniesData = [
    {
        id: 'volcano_express',
        name: 'Volcano Express',
        logoUrl: 'https://seeklogo.com/images/V/volcano-express-logo-F735513A51-seeklogo.com.png',
        coverUrl: 'https://images.unsplash.com/photo-1593256398246-8853b3815c32?q=80&w=2070&auto=format&fit=crop',
        description: "Volcano Express is a leading transport company in Rwanda, known for its punctuality and excellent customer service.",
        contactEmail: 'contact@volcano.rw',
        fleetSize: 120,
        totalPassengers: 3500000,
        totalRevenue: 15_750_000_000,
        routes: [
            { from: 'Kigali', to: 'Rubavu', price: 4500, tripsToday: 15, avgPassengers: 550 },
            { from: 'Kigali', to: 'Musanze', price: 3500, tripsToday: 20, avgPassengers: 800 },
        ],
        fleetDetails: [
            { id: 'V01', model: 'Yutong Explorer', capacity: 55, status: 'Active', assignedRoute: 'Kigali - Rubavu' },
            { id: 'V02', model: 'Coaster Bus', capacity: 30, status: 'Active', assignedRoute: 'Kigali - Musanze' },
            { id: 'V03', model: 'Yutong Grand', capacity: 65, status: 'Maintenance', assignedRoute: '-' },
        ],
        recentPassengers: [
            { name: 'Mugisha F.', route: 'Kigali - Rubavu', ticketId: 'VK-83AD1' },
            { name: 'Keza C.', route: 'Kigali - Musanze', ticketId: 'VK-83AD2' },
        ],
        weeklyIncome: [ { day: 'M', income: 4500000 }, { day: 'T', income: 4200000 }, { day: 'W', income: 4800000 }, { day: 'T', income: 4600000 }, { day: 'F', income: 5500000 }, { day: 'S', income: 6200000 }, { day: 'S', income: 5900000 }],
        dailyTickets: [ { day: 'M', tickets: 980 }, { day: 'T', tickets: 920 }, { day: 'W', tickets: 1050 }, { day: 'T', tickets: 1000 }, { day: 'F', tickets: 1250 }, { day: 'S', tickets: 1400 }, { day: 'S', tickets: 1350 }],
    },
    {
        id: 'ritco',
        name: 'RITCO',
        logoUrl: 'https://www.ritco.rw/wp-content/uploads/2021/03/logo.svg',
        coverUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2048&auto=format&fit=crop',
        description: "RITCO offers country-wide public transport with a large and modern fleet of buses.",
        contactEmail: 'info@ritco.rw',
        fleetSize: 85,
        totalPassengers: 2000000,
        totalRevenue: 9_000_000_000,
        routes: [
            { from: 'Kigali', to: 'Huye', price: 3000, tripsToday: 25, avgPassengers: 1200 },
            { from: 'Kigali', to: 'Nyungwe', price: 7000, tripsToday: 5, avgPassengers: 200 },
        ],
        fleetDetails: [
             { id: 'R01', model: 'Yutong Grand', capacity: 65, status: 'Active', assignedRoute: 'Kigali - Huye' },
             { id: 'R02', model: 'Scania Marcopolo', capacity: 70, status: 'Active', assignedRoute: 'Kigali - Nyungwe' },
        ],
        recentPassengers: [
             { name: 'Umutoni G.', route: 'Kigali - Huye', ticketId: 'RT-98CD3' },
        ],
        weeklyIncome: [ { day: 'M', income: 3200000 }, { day: 'T', income: 3100000 }, { day: 'W', income: 3400000 }, { day: 'T', income: 3300000 }, { day: 'F', income: 4000000 }, { day: 'S', income: 4500000 }, { day: 'S', income: 4300000 }],
        dailyTickets: [ { day: 'M', tickets: 1100 }, { day: 'T', tickets: 1050 }, { day: 'W', tickets: 1150 }, { day: 'T', tickets: 1120 }, { day: 'F', tickets: 1350 }, { day: 'S', tickets: 1500 }, { day: 'S', tickets: 1450 }],
    }
];

const StatCard = ({ title, value, icon, format = true }) => (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center space-x-4">
        <div className="p-3 bg-blue-100 dark:bg-gray-700 rounded-lg">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {format && typeof value === 'number' ? new Intl.NumberFormat('fr-RW').format(value) : value}
            </p>
        </div>
    </div>
);

const DashboardHome = () => (
    <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Revenue" value="24,750,000,000 FRW" icon={<ChartBarIcon className="w-6 h-6 text-blue-500" />} format={false} />
            <StatCard title="Total Passengers" value={5500000} icon={<UsersIcon className="w-6 h-6 text-blue-500" />} />
            <StatCard title="Companies" value={mockCompaniesData.length} icon={<BuildingOfficeIcon className="w-6 h-6 text-blue-500" />} format={false}/>
            <StatCard title="Active Routes" value={35} icon={<MapIcon className="w-6 h-6 text-blue-500" />} format={false}/>
        </div>
    </div>
);

const CompanyManagement = ({ companies, onSelectCompany, onEdit, onDelete, onAdd }) => (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Manage Companies</h1>
            <button onClick={onAdd} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                <PlusIcon className="w-5 h-5 mr-2" />
                Add New Company
            </button>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Company</th>
                            <th className="px-6 py-3">Passengers</th>
                            <th className="px-6 py-3">Revenue (FRW)</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map(company => (
                            <tr key={company.id} className="border-b dark:border-gray-700">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center space-x-3">
                                    <img src={company.logoUrl} alt={company.name} className="w-8 h-8 object-contain"/>
                                    <span>{company.name}</span>
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{company.totalPassengers.toLocaleString()}</td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{company.totalRevenue.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => onSelectCompany(company.id)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold">View Details</button>
                                        <button onClick={() => onEdit(company)} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"><PencilSquareIcon className="w-5 h-5"/></button>
                                        <button onClick={() => onDelete(company.id)} className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const CompanyDetails = ({ company, onBack }) => {
    const maxIncome = Math.max(...company.weeklyIncome.map(d => d.income));
    const maxTickets = Math.max(...company.dailyTickets.map(d => d.tickets));

    return (
        <div>
             <button onClick={onBack} className="flex items-center text-gray-600 dark:text-gray-300 font-semibold hover:text-gray-800 dark:hover:text-white mb-6">
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Companies
            </button>
            <div className="flex items-center space-x-4 mb-6">
                <img src={company.logoUrl} alt={company.name} className="w-16 h-16 object-contain bg-white dark:bg-gray-700 p-2 rounded-full shadow-md"/>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">{company.name}</h1>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Revenue" value={`${(company.totalRevenue / 1_000_000_000).toFixed(2)}B FRW`} icon={<ChartBarIcon className="w-6 h-6 text-blue-500" />} format={false} />
                <StatCard title="Total Passengers" value={`${(company.totalPassengers / 1_000_000).toFixed(1)}M`} icon={<UsersIcon className="w-6 h-6 text-blue-500" />} format={false} />
                <StatCard title="Fleet Size" value={company.fleetSize} icon={<BusIcon className="w-6 h-6 text-blue-500" />} format={false}/>
                <StatCard title="Active Routes" value={company.routes.length} icon={<MapIcon className="w-6 h-6 text-blue-500" />} format={false}/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="font-bold mb-4 dark:text-white">Weekly Income (FRW)</h3>
                    <div className="flex items-end h-48 space-x-2">
                        {company.weeklyIncome.map(data => (
                            <div key={data.day} className="flex-1 flex flex-col items-center justify-end group">
                                <div className="text-xs font-bold text-gray-800 dark:text-white bg-white/50 dark:bg-black/20 px-2 py-1 rounded-md mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {(data.income / 1000000).toFixed(1)}M
                                </div>
                                <div className="w-full bg-green-200 dark:bg-green-800/80 rounded-t-lg hover:bg-green-300 dark:hover:bg-green-700 transition-colors" style={{height: `${(data.income / maxIncome) * 100}%`}}></div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{data.day}</div>
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="font-bold mb-4 dark:text-white">Daily Tickets Sold</h3>
                    <div className="flex items-end h-48 space-x-2">
                        {company.dailyTickets.map(data => (
                            <div key={data.day} className="flex-1 flex flex-col items-center justify-end group">
                                <div className="text-xs font-bold text-gray-800 dark:text-white bg-white/50 dark:bg-black/20 px-2 py-1 rounded-md mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {data.tickets}
                                </div>
                                <div className="w-full bg-yellow-200 dark:bg-yellow-800/80 rounded-t-lg hover:bg-yellow-300 dark:hover:bg-yellow-700 transition-colors" style={{height: `${(data.tickets / maxTickets) * 100}%`}}></div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{data.day}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tables for Routes, Fleet, Passengers */}
            <div className="space-y-8">
                 <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                    <h3 className="font-bold mb-4 dark:text-white px-2">Route Management</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                           {/* ... Table for Routes ... */}
                        </table>
                    </div>
                </div>
                {/* ... Other tables for Fleet and Passengers ... */}
            </div>
        </div>
    );
};

// ... More components like UserManagement, Settings could be added here

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, theme, setTheme }) => {
  const [view, setView] = useState('companies');
  const [companies, setCompanies] = useState(mockCompaniesData);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  const selectedCompany = useMemo(() => companies.find(c => c.id === selectedCompanyId), [companies, selectedCompanyId]);

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return <DashboardHome />;
      case 'companies':
        return <CompanyManagement 
                    companies={companies} 
                    onSelectCompany={(id) => { setSelectedCompanyId(id); setView('companyDetails'); }}
                    onAdd={() => alert("Add new company form would open here.")}
                    onEdit={(company) => alert(`Editing ${company.name}`)}
                    onDelete={(id) => {
                        if (window.confirm("Are you sure you want to delete this company?")) {
                            setCompanies(prev => prev.filter(c => c.id !== id));
                        }
                    }}
                />;
      case 'companyDetails':
          return selectedCompany ? <CompanyDetails company={selectedCompany} onBack={() => setView('companies')} /> : <div>Company not found.</div>;
      case 'users':
        return <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">User Management</h1>;
      case 'settings':
        return <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Settings</h1>;
      default:
        return <DashboardHome />;
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
          RWANDA BUS ADMIN
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
            <NavLink viewName="dashboard" label="Dashboard" icon={ChartBarIcon} />
            <NavLink viewName="companies" label="Ibigo" icon={BuildingOfficeIcon} />
            <NavLink viewName="users" label="Abakoresha" icon={UsersIcon} />
            <NavLink viewName="settings" label="Iboneza" icon={CogIcon} />
        </nav>
      </aside>

      <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900">
        <header className="h-16 bg-white dark:bg-gray-800 shadow-md flex items-center justify-between lg:justify-end px-6">
           <div className="lg:hidden text-gray-800 dark:text-white font-bold text-lg">ADMIN</div>
          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
            </button>
            <button className="text-gray-500 dark:text-gray-400">
              <BellIcon className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <UserCircleIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
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

export default AdminDashboard;
