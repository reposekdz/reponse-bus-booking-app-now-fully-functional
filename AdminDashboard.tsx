import React, { useState, useMemo, ChangeEvent, FormEvent, useEffect } from 'react';
import { 
    SunIcon, MoonIcon, BellIcon, CogIcon, UsersIcon, ChartBarIcon, BuildingOfficeIcon, 
    ArrowLeftIcon, PlusIcon, PencilSquareIcon, TrashIcon, ArrowUpTrayIcon, SearchIcon, MapIcon, BusIcon, XIcon,
    WalletIcon, CreditCardIcon, TagIcon, ShieldCheckIcon, PaintBrushIcon, LanguageIcon, LockClosedIcon
} from './components/icons';
import ActivityFeed from './components/ActivityFeed';

interface AdminDashboardProps {
  onLogout: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  companies: any[];
  onUpdateCompanies: (companies: any[]) => void;
}

// MOCK DATA ENHANCED WITH WALLET INFO
export const mockCompaniesData = [
    {
        id: 'volcano_express',
        name: 'Volcano Express',
        password: 'password123',
        logoUrl: 'https://seeklogo.com/images/V/volcano-express-logo-F735513A51-seeklogo.com.png',
        coverUrl: 'https://images.unsplash.com/photo-1593256398246-8853b3815c32?q=80&w=2070&auto=format&fit=crop',
        description: "Volcano Express ni ikigo cy'ubwikorezi mu Rwanda, kizwiho kubahiriza igihe no gutanga serivisi nziza ku bakiriya.",
        contactEmail: 'contact@volcano.rw',
        fleetSize: 120,
        totalPassengers: 3500000,
        totalRevenue: 15_750_000_000,
        wallet: {
            balance: 12540000,
            currency: 'RWF',
            transactions: [
                { id: 1, type: 'payout', description: 'Weekly Settlement', amount: -10000000, date: '2024-10-25', status: 'Completed' },
                { id: 2, type: 'fee', description: 'Platform Fee - October', amount: -1500000, date: '2024-10-24', status: 'Completed' },
                { id: 3, type: 'adjustment', description: 'Refund TX-123', amount: 4500, date: '2024-10-22', status: 'Completed' }
            ]
        },
        routes: [
            { id: 'r1', from: 'Kigali', to: 'Rubavu', price: 4500, tripsToday: 15, avgPassengers: 550 },
            { id: 'r2', from: 'Kigali', to: 'Musanze', price: 3500, tripsToday: 20, avgPassengers: 800 },
        ],
        fleetDetails: [
            { id: 'V01', model: 'Yutong Explorer', capacity: 55, status: 'Active', assignedRoute: 'Kigali - Rubavu' },
            { id: 'V02', model: 'Coaster Bus', capacity: 30, status: 'Active', assignedRoute: 'Kigali - Musanze' },
            { id: 'V03', model: 'Yutong Grand', capacity: 65, status: 'Maintenance', assignedRoute: '-' },
        ],
        recentPassengers: [
            { name: 'Mugisha F.', route: 'Kigali - Rubavu', ticketId: 'VK-83AD1', date: '2024-10-28', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop' },
            { name: 'Keza C.', route: 'Kigali - Musanze', ticketId: 'VK-83AD2', date: '2024-10-28', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop' },
        ],
        weeklyIncome: [ { day: 'M', income: 4500000 }, { day: 'T', income: 4200000 }, { day: 'W', income: 4800000 }, { day: 'T', income: 4600000 }, { day: 'F', income: 5500000 }, { day: 'S', income: 6200000 }, { day: 'S', income: 5900000 }],
        dailyTickets: [ { day: 'M', tickets: 980 }, { day: 'T', tickets: 920 }, { day: 'W', tickets: 1050 }, { day: 'T', tickets: 1000 }, { day: 'F', tickets: 1250 }, { day: 'S', tickets: 1400 }, { day: 'S', tickets: 1350 }],
        promotions: [
            { id: 'VOLC01', title: 'Weekend Discount', description: 'Get 10% off on all weekend trips.', code: 'WEEKEND10', expiryDate: '2024-12-31' }
        ],
        schedule: {
          'Kigali-Rubavu': [
            { id: 'sch1', time: '07:00', busId: 'V01', price: 4500 },
            { id: 'sch2', time: '08:30', busId: 'V01', price: 4500 },
          ],
          'Kigali-Musanze': [
            { id: 'sch3', time: '09:00', busId: 'V02', price: 3500 },
          ]
        },
    },
    {
        id: 'ritco',
        name: 'RITCO',
        password: 'password456',
        logoUrl: 'https://www.ritco.rw/wp-content/uploads/2021/03/logo.svg',
        coverUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2048&auto=format&fit=crop',
        description: "RITCO itanga serivisi zo gutwara abantu mu gihugu hose ifite imodoka nini kandi zigezweho.",
        contactEmail: 'info@ritco.rw',
        fleetSize: 85,
        totalPassengers: 2000000,
        totalRevenue: 9_000_000_000,
        wallet: {
            balance: 8750000,
            currency: 'RWF',
            transactions: [
                { id: 1, type: 'payout', description: 'Weekly Settlement', amount: -7500000, date: '2024-10-25', status: 'Completed' },
                { id: 2, type: 'fee', description: 'Platform Fee - October', amount: -900000, date: '2024-10-24', status: 'Completed' },
            ]
        },
        routes: [
            { id: 'r3', from: 'Kigali', to: 'Huye', price: 3000, tripsToday: 25, avgPassengers: 1200 },
            { id: 'r4', from: 'Kigali', to: 'Nyungwe', price: 7000, tripsToday: 5, avgPassengers: 200 },
        ],
        fleetDetails: [
             { id: 'R01', model: 'Yutong Grand', capacity: 65, status: 'Active', assignedRoute: 'Kigali - Huye' },
             { id: 'R02', model: 'Scania Marcopolo', capacity: 70, status: 'Active', assignedRoute: 'Kigali - Nyungwe' },
        ],
        recentPassengers: [
             { name: 'Umutoni G.', route: 'Kigali - Huye', ticketId: 'RT-98CD3', date: '2024-10-27', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop' },
        ],
        weeklyIncome: [ { day: 'M', income: 3200000 }, { day: 'T', income: 3100000 }, { day: 'W', income: 3400000 }, { day: 'T', income: 3300000 }, { day: 'F', income: 4000000 }, { day: 'S', income: 4500000 }, { day: 'S', income: 4300000 }],
        dailyTickets: [ { day: 'M', tickets: 1100 }, { day: 'T', tickets: 1050 }, { day: 'W', tickets: 1150 }, { day: 'T', tickets: 1120 }, { day: 'F', tickets: 1350 }, { day: 'S', tickets: 1500 }, { day: 'S', tickets: 1450 }],
        promotions: [
            { id: 'RITCO01', title: 'Student Discount', description: '15% off for students with valid ID.', code: 'STUDENT15', expiryDate: '2024-12-31' }
        ],
        schedule: {
            'Kigali-Huye': [
                { id: 'sch4', time: '06:00', busId: 'R01', price: 3000 },
                { id: 'sch5', time: '08:00', busId: 'R01', price: 3000 },
            ],
            'Kigali-Nyungwe': [
                { id: 'sch6', time: '07:00', busId: 'R02', price: 7000 },
            ]
        },
    }
];

const mockUsersData = [
    { id: 1, name: 'Kalisa Jean', email: 'kalisa.j@example.com', role: 'Umugenzi', joinedDate: '2023-01-15', status: 'Active', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop' },
    { id: 2, name: 'Umutoni Grace', email: 'grace.u@example.com', role: 'Umugenzi', joinedDate: '2023-03-22', status: 'Active', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop' },
    { id: 3, name: 'Volcano Express', email: 'contact@volcano.rw', role: 'Ikigo', joinedDate: '2022-11-01', status: 'Active', avatarUrl: 'https://seeklogo.com/images/V/volcano-express-logo-F735513A51-seeklogo.com.png' },
    { id: 4, name: 'Mugisha Frank', email: 'frank.m@example.com', role: 'Umugenzi', joinedDate: '2023-08-10', status: 'Suspended', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop' },
    { id: 5, name: 'RITCO', email: 'info@ritco.rw', role: 'Ikigo', joinedDate: '2022-10-20', status: 'Active', avatarUrl: 'https://www.ritco.rw/wp-content/uploads/2021/03/logo.svg' },
    { id: 6, name: 'Admin Reponse', email: 'reponse@gmail.com', role: 'Admin', joinedDate: '2022-09-01', status: 'Active', avatarUrl: null },
];

const StatCard = ({ title, value, icon, format = true }) => (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 text-gray-200/20 dark:text-gray-900/20 group-hover:scale-110 transition-transform duration-300">
            {React.cloneElement(icon, { className: "w-28 h-28" })}
        </div>
        <div className="relative">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {format && typeof value === 'number' ? new Intl.NumberFormat('fr-RW').format(value) : value}
            </p>
        </div>
    </div>
);

const LiveBookingsFeed = ({ companies }) => {
    const [bookings, setBookings] = useState<any[]>([]);
    const passengerNames = ['Kalisa', 'Umutoni', 'Mugisha', 'Keza', 'Niyonsenga', 'Gatete'];
    
    useEffect(() => {
        const interval = setInterval(() => {
            if (companies.length === 0) return;
            const company = companies[Math.floor(Math.random() * companies.length)];
            if (!company.routes || company.routes.length === 0) return;
            const route = company.routes[Math.floor(Math.random() * company.routes.length)];
            const name = passengerNames[Math.floor(Math.random() * passengerNames.length)];
            const newBooking = {
                id: Date.now(),
                passenger: `${name} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}.`,
                route: `${route.from} - ${route.to}`,
                company: company.name,
                amount: route.price,
                logoUrl: company.logoUrl,
            };
            setBookings(prev => [newBooking, ...prev.slice(0, 5)]);
        }, 3000 + Math.random() * 2000); // every 3-5 seconds

        return () => clearInterval(interval);
    }, [companies]);

    return (
        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
            <h3 className="font-bold mb-4 dark:text-white">Amatike Ari Gukatwa</h3>
            <div className="space-y-4 h-72 overflow-y-auto custom-scrollbar">
                {bookings.length > 0 ? bookings.map(b => (
                    <div key={b.id} className="flex items-center space-x-4 animate-fade-in">
                        <img src={b.logoUrl} alt={b.company} className="w-10 h-10 rounded-full object-contain bg-gray-100 dark:bg-gray-700 p-1" />
                        <div>
                            <p className="text-sm font-semibold dark:text-white">{b.passenger} yaguze itike</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{b.route} na {b.company}</p>
                        </div>
                        <p className="text-sm font-bold text-green-600 dark:text-green-400 ml-auto">+{new Intl.NumberFormat('fr-RW').format(b.amount)}</p>
                    </div>
                )) : <p className="text-sm text-gray-500 dark:text-gray-400 text-center pt-24">Dutegereje amatike mashya...</p>}
            </div>
        </div>
    );
};

const DashboardHome = ({ companies }) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500 dark:from-blue-400 dark:to-green-300 mb-6">Imbonerahamwe Rusange</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard title="Amafaranga Yose" value={companies.reduce((acc, c) => acc + c.totalRevenue, 0)} icon={<ChartBarIcon className="w-6 h-6 text-blue-500" />} />
                <StatCard title="Abagenzi Bose" value={companies.reduce((acc, c) => acc + c.totalPassengers, 0)} icon={<UsersIcon className="w-6 h-6 text-blue-500" />} />
                <StatCard title="Ibigo Byose" value={companies.length} icon={<BuildingOfficeIcon className="w-6 h-6 text-blue-500" />} format={false}/>
                <StatCard title="Ingendo Zikora" value={companies.reduce((acc, c) => acc + (c.routes?.length || 0), 0)} icon={<MapIcon className="w-6 h-6 text-blue-500" />} format={false}/>
            </div>
        </div>
        <div className="lg:col-span-1 space-y-6">
            <LiveBookingsFeed companies={companies} />
            <ActivityFeed />
        </div>
    </div>
);

const CompanyFormModal = ({ company, onSave, onClose }) => {
    const [formData, setFormData] = useState(company || {
        name: '', contactEmail: '', password: '', description: '', fleetSize: 0,
    });
    const [logoPreview, setLogoPreview] = useState(company?.logoUrl || null);
    const [coverPreview, setCoverPreview] = useState(company?.coverUrl || null);
    const isNew = !company;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            if (type === 'logo') setLogoPreview(previewUrl);
            if (type === 'cover') setCoverPreview(previewUrl);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const finalData = { ...formData, logoUrl: logoPreview, coverUrl: coverPreview };
        onSave(finalData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full relative max-h-[90vh] overflow-y-auto custom-scrollbar">
                <button onClick={onClose} className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"><XIcon className="w-6 h-6" /></button>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <h2 className="text-2xl font-bold dark:text-white">{isNew ? 'Ongeramo Ikigo Gishya' : "Hindura Amakuru y'Ikigo"}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium dark:text-gray-300">Ikirango cy'Ikigo</label>
                            <div className="mt-1 flex items-center space-x-4">
                                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                                    {logoPreview ? <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover"/> : <span className="text-xs text-gray-500">Ifoto</span>}
                                </div>
                                <label htmlFor="logo-upload" className="cursor-pointer text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                                    Ongeraho Ikirango
                                    <input id="logo-upload" name="logoUrl" type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'logo')} />
                                </label>
                            </div>
                        </div>
                         <div>
                            <label className="text-sm font-medium dark:text-gray-300">Ifoto yo Hanze</label>
                            <div className="mt-1 flex items-center space-x-4">
                                <div className="w-32 h-20 rounded-md bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                                    {coverPreview ? <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover"/> : <span className="text-xs text-gray-500">Ifoto</span>}
                                </div>
                                <label htmlFor="cover-upload" className="cursor-pointer text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                                    Ongeraho Ifoto
                                    <input id="cover-upload" name="coverUrl" type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'cover')} />
                                </label>
                            </div>
                        </div>
                    </div>

                     <div>
                        <label className="text-sm font-medium dark:text-gray-300">Izina ry'Ikigo</label>
                        <input name="name" type="text" value={formData.name} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required/>
                    </div>
                     <div>
                        <label className="text-sm font-medium dark:text-gray-300">Imeri (yo kwinjiriraho)</label>
                        <input name="contactEmail" type="email" value={formData.contactEmail} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required/>
                    </div>
                     <div>
                        <label className="text-sm font-medium dark:text-gray-300">Ijambobanga</label>
                        <input name="password" type="password" placeholder={isNew ? "" : "Shyiramo rishya kugirango uhindure"} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required={isNew}/>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4 border-t dark:border-gray-700">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg dark:border-gray-600 dark:text-gray-300">Bireke</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Bika Ikigo</button>
                    </div>
                </form>
            </div>
        </div>
    )
};

const CompanyCard: React.FC<{
    company: any;
    onSelect: (id: any) => void;
    onEdit: (company: any) => void;
    onDelete: (id: any) => void;
}> = ({ company, onSelect, onEdit, onDelete }) => (
    <div className="group perspective">
        <div className="relative preserve-3d w-full h-80 rounded-2xl shadow-lg transition-transform duration-500 group-hover:[transform:rotateY(10deg)] bg-gray-200 dark:bg-gray-800">
            {/* Background Image */}
            <img src={company.coverUrl} alt={`${company.name} cover`} className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-2xl"></div>

            {/* Content */}
            <div className="relative p-5 h-full flex flex-col justify-end">
                <img src={company.logoUrl} alt={`${company.name} logo`} className="w-16 h-16 object-contain bg-white/80 dark:bg-gray-900/80 p-1 rounded-full shadow-md border-2 border-white dark:border-gray-700 mb-2"/>
                <h3 className="text-xl font-bold text-white drop-shadow-lg">{company.name}</h3>
                
                <div className="flex justify-between items-end mt-4">
                    <div className="text-white">
                        <p className="text-xs opacity-80">Amafaranga</p>
                        <p className="font-bold text-lg">{(company.totalRevenue / 1_000_000_000).toFixed(1)}B <span className="font-normal text-sm opacity-80">RWF</span></p>
                    </div>
                    <button onClick={() => onSelect(company.id)} className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-lg hover:bg-white/30 transition-colors">
                        Reba Ibindi
                    </button>
                </div>
            </div>

            {/* Hover Actions */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <button onClick={(e) => { e.stopPropagation(); onEdit(company); }} className="p-2 text-white bg-black/40 rounded-full hover:bg-black/60 backdrop-blur-sm"><PencilSquareIcon className="w-5 h-5"/></button>
                 <button onClick={(e) => { e.stopPropagation(); onDelete(company.id); }} className="p-2 text-white bg-black/40 rounded-full hover:bg-black/60 backdrop-blur-sm"><TrashIcon className="w-5 h-5"/></button>
            </div>
        </div>
    </div>
);


const CompanyManagement = ({ companies, onSelectCompany, onUpdateCompanies }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);

    const handleAdd = () => {
        setEditingCompany(null);
        setIsModalOpen(true);
    };

    const handleEdit = (company) => {
        setEditingCompany(company);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Urifuza gusiba iki kigo?")) {
            onUpdateCompanies(companies.filter(c => c.id !== id));
        }
    };
    
    const handleSave = (companyData) => {
        const isNew = !editingCompany;
        if (isNew) {
            const newCompany = { 
                ...companyData, 
                id: companyData.name.toLowerCase().replace(/\s+/g, '_') + Date.now(), 
                totalPassengers: 0, totalRevenue: 0, fleetSize: 0, weeklyIncome: Array(7).fill({income:0}).map((d,i)=> ({...d, day: 'L M K G T S S'[i]})), dailyTickets: Array(7).fill({tickets:0}).map((d,i)=> ({...d, day: 'L M K G T S S'[i]})), routes: [], fleetDetails: [], recentPassengers: [],
                wallet: { balance: 0, currency: 'RWF', transactions: [] },
                schedule: {},
                promotions: [],
            };
            onUpdateCompanies([...companies, newCompany]);
        } else {
            onUpdateCompanies(companies.map(c => c.id === editingCompany.id ? { ...c, ...companyData } : c));
        }
        setIsModalOpen(false);
        setEditingCompany(null);
    };


    return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500 dark:from-blue-400 dark:to-green-300">Gucunga Ibigo</h1>
            <button onClick={handleAdd} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/50">
                <PlusIcon className="w-5 h-5 mr-2" />
                Ongeramo Ikigo
            </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
           {companies.map(company => (
               <CompanyCard 
                key={company.id} 
                company={company} 
                onSelect={onSelectCompany}
                onEdit={handleEdit}
                onDelete={handleDelete}
               />
           ))}
        </div>
        {isModalOpen && <CompanyFormModal company={editingCompany} onSave={handleSave} onClose={() => setIsModalOpen(false)} />}
    </div>
    )
};

const BarChart = ({ data, dataKey, labelKey, title, colorClass }) => {
    const maxValue = Math.max(...(data?.map(d => d[dataKey]) || [0]));
    return (
        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
            <h3 className="font-bold mb-4 dark:text-white">{title}</h3>
            <div className="flex items-end h-40 space-x-2">
                {data.map(item => (
                    <div key={item[labelKey]} className="flex-1 flex flex-col items-center justify-end group">
                        <div className="text-xs font-bold text-gray-800 dark:text-white bg-white/50 dark:bg-black/20 px-2 py-1 rounded-md mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {new Intl.NumberFormat('fr-RW').format(item[dataKey])}
                        </div>
                        <div className={`w-full ${colorClass} rounded-t-lg hover:opacity-80 transition-opacity`} style={{height: `${(item[dataKey] / (maxValue || 1)) * 100}%`}}></div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item[labelKey]}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CompanyDetails = ({ company, onBack }) => {
    const [activeTab, setActiveTab] = useState('routes');

    return (
        <div className="space-y-8">
             <button onClick={onBack} className="flex items-center text-gray-600 dark:text-gray-300 font-semibold hover:text-gray-800 dark:hover:text-white mb-2">
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Subira ku Bigo Byose
            </button>
            <div className="flex items-center space-x-4">
                <img src={company.logoUrl} alt={company.name} className="w-20 h-20 object-contain bg-white dark:bg-gray-700 p-2 rounded-full shadow-md"/>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">{company.name}</h1>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard title="Amafaranga Yose" value={company.totalRevenue} icon={<ChartBarIcon className="w-6 h-6 text-blue-500" />} />
                    <StatCard title="Abagenzi Bose" value={company.totalPassengers} icon={<UsersIcon className="w-6 h-6 text-blue-500" />} />
                    <div className="md:col-span-2">
                         <BarChart data={company.weeklyIncome} dataKey="income" labelKey="day" title="Amafaranga y'Icyumweru (RWF)" colorClass="bg-green-200 dark:bg-green-800/80" />
                    </div>
                     <div className="md:col-span-2">
                         <BarChart data={company.dailyTickets} dataKey="tickets" labelKey="day" title="Amatike Yaguzwe ku Munsi" colorClass="bg-yellow-200 dark:bg-yellow-800/80" />
                    </div>
                </div>
                 <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-xl shadow-lg">
                        <p className="text-sm opacity-80">Amafaranga ari mu Ikofi</p>
                        <p className="text-3xl font-bold mt-1 mb-4">{new Intl.NumberFormat('fr-RW').format(company.wallet.balance)} <span className="text-xl font-normal opacity-80">RWF</span></p>
                        <h4 className="font-semibold text-sm border-t border-white/30 pt-3">Ibikorwa bya Vuba</h4>
                        <ul className="text-xs mt-2 space-y-1">
                            {company.wallet.transactions.slice(0, 2).map(tx => (
                                <li key={tx.id} className="flex justify-between"><span className="opacity-80">{tx.description}</span> <span>{tx.amount.toLocaleString()}</span></li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-md">
                        <h4 className="font-bold text-sm mb-2 dark:text-white">Amakuru yo Kwinjira</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Imeri yo kwinjiriraho:</p>
                        <p className="text-sm text-gray-800 dark:text-gray-200 font-mono">{company.contactEmail}</p>
                        <button className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">Subizamo Ijambobanga Rishya</button>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-md">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button onClick={() => setActiveTab('routes')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'routes' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500'}`}>Ingendo</button>
                        <button onClick={() => setActiveTab('fleet')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'fleet' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500'}`}>Imodoka</button>
                        <button onClick={() => setActiveTab('passengers')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'passengers' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500'}`}>Abagenzi ba Vuba</button>
                    </nav>
                </div>
                <div className="pt-4 overflow-x-auto">
                    {activeTab === 'routes' && (
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"><tr><th className="px-4 py-2">Uva</th><th className="px-4 py-2">Ujya</th><th className="px-4 py-2">Igiciro</th><th className="px-4 py-2">Ingendo ku munsi</th><th className="px-4 py-2">Abagenzi (avg)</th></tr></thead>
                            <tbody>{company.routes.map(r => <tr key={r.id} className="border-b dark:border-gray-700"><td className="px-4 py-2 font-medium dark:text-white">{r.from}</td><td className="px-4 py-2">{r.to}</td><td className="px-4 py-2">{r.price}</td><td className="px-4 py-2">{r.tripsToday}</td><td className="px-4 py-2">{r.avgPassengers}</td></tr>)}</tbody>
                        </table>
                    )}
                    {activeTab === 'fleet' && (
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"><tr><th className="px-4 py-2">ID</th><th className="px-4 py-2">Ubwoko</th><th className="px-4 py-2">Imyanya</th><th className="px-4 py-2">Uko Ihagaze</th><th className="px-4 py-2">Urugendo Ikora</th></tr></thead>
                            <tbody>{company.fleetDetails.map(f => <tr key={f.id} className="border-b dark:border-gray-700"><td className="px-4 py-2 font-medium dark:text-white">{f.id}</td><td className="px-4 py-2">{f.model}</td><td className="px-4 py-2">{f.capacity}</td><td className="px-4 py-2"><span className={`px-2 py-1 text-xs rounded-full ${f.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{f.status}</span></td><td className="px-4 py-2">{f.assignedRoute}</td></tr>)}</tbody>
                        </table>
                    )}
                     {activeTab === 'passengers' && (
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"><tr><th className="px-4 py-2">Izina</th><th className="px-4 py-2">Urugendo</th><th className="px-4 py-2">ID y'Itike</th><th className="px-4 py-2">Itariki</th></tr></thead>
                            <tbody>{company.recentPassengers.map(p => (
                                <tr key={p.ticketId} className="border-b dark:border-gray-700">
                                    <td className="px-4 py-3 font-medium dark:text-white flex items-center space-x-3">
                                        <img src={p.avatarUrl} alt={p.name} className="w-10 h-10 rounded-full object-cover shadow-sm"/>
                                        <span>{p.name}</span>
                                    </td>
                                    <td className="px-4 py-3">{p.route}</td>
                                    <td className="px-4 py-3">{p.ticketId}</td>
                                    <td className="px-4 py-3">{p.date}</td>
                                </tr>
                            ))}</tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

const TransactionsPage = ({ companies }) => {
    const allTransactions = useMemo(() => {
        return companies.flatMap(c => 
            (c.wallet?.transactions || []).map(t => ({ ...t, companyName: c.name, logoUrl: c.logoUrl }))
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [companies]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Ibikorwa Byose by'Imari</h1>
            <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-4 py-3">Ikigo</th>
                                <th className="px-4 py-3">Icyakozwe</th>
                                <th className="px-4 py-3">Itariki</th>
                                <th className="px-4 py-3">Uko Byagenze</th>
                                <th className="px-4 py-3 text-right">Amafaranga (RWF)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allTransactions.map((tx, index) => (
                                <tr key={index} className="border-b dark:border-gray-700">
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                                        <img src={tx.logoUrl} alt={tx.companyName} className="w-6 h-6 object-contain"/>
                                        <span>{tx.companyName}</span>
                                    </td>
                                    <td className="px-4 py-3">{tx.description}</td>
                                    <td className="px-4 py-3">{tx.date}</td>
                                    <td className="px-4 py-3"><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">{tx.status}</span></td>
                                    <td className={`px-4 py-3 text-right font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {new Intl.NumberFormat('fr-RW').format(tx.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const UserManagementPage = () => {
    const [users, setUsers] = useState(mockUsersData);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = useMemo(() => {
        return users.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const handleStatusChange = (userId) => {
        setUsers(users.map(u => u.id === userId ? {...u, status: u.status === 'Active' ? 'Suspended' : 'Active'} : u));
    };

    const StatusBadge = ({ status }) => (
        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
            status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
        }`}>
            {status}
        </span>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Gucunga Abakoresha</h1>
            <div className="bg-white dark:bg-gray-800/50 p-4 sm:p-6 rounded-xl shadow-md">
                <div className="relative mb-4">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Shakisha umukoresha ku izina cyangwa imeri..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-4 py-3">Umukoresha</th>
                                <th className="px-4 py-3">Uruhare</th>
                                <th className="px-4 py-3">Yiyandikishije</th>
                                <th className="px-4 py-3">Uko Ahagaze</th>
                                <th className="px-4 py-3 text-right">Ibyo Gukora</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center space-x-3">
                                            <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name.replace(' ','+')}&background=random`} alt={user.name} className="w-10 h-10 rounded-full object-cover bg-gray-200 dark:bg-gray-700"/>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                                                <p className="text-gray-500 dark:text-gray-400 text-xs">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{user.role}</td>
                                    <td className="px-4 py-3">{user.joinedDate}</td>
                                    <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => handleStatusChange(user.id)} className="font-medium text-blue-600 dark:text-blue-400 hover:underline mr-4">
                                            {user.status === 'Active' ? 'Hagarika' : 'Komyora'}
                                        </button>
                                         <button className="font-medium text-red-600 dark:text-red-400 hover:underline">Siba</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const RouteFormModal = ({ route, companies, onSave, onClose }) => {
    const [formData, setFormData] = useState(route || {
        companyId: companies[0]?.id || '',
        from: '', to: '', price: '', tripsToday: '', avgPassengers: ''
    });
    const isNew = !route;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"><XIcon className="w-6 h-6" /></button>
                <form onSubmit={handleSubmit} className="p-8 space-y-4">
                    <h2 className="text-xl font-bold dark:text-white">{isNew ? 'Ongeramo Urugendo Rushya' : 'Hindura Urugendo'}</h2>
                    <div>
                        <label className="text-sm font-medium dark:text-gray-300">Ikigo</label>
                        <select name="companyId" value={formData.companyId} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" disabled={!isNew} required>
                            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div><label className="text-sm">Uva</label><input name="from" type="text" value={formData.from} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required/></div>
                         <div><label className="text-sm">Ujya</label><input name="to" type="text" value={formData.to} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required/></div>
                    </div>
                     <div className="grid grid-cols-3 gap-4">
                        <div><label className="text-sm">Igiciro</label><input name="price" type="number" value={formData.price} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required/></div>
                        <div><label className="text-sm">Ingendo/Munsi</label><input name="tripsToday" type="number" value={formData.tripsToday} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required/></div>
                        <div><label className="text-sm">Abagenzi (avg)</label><input name="avgPassengers" type="number" value={formData.avgPassengers} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required/></div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4 border-t dark:border-gray-700">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg dark:border-gray-600 dark:text-gray-300">Bireke</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Bika Urugendo</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const RouteManagementPage = ({ companies, onUpdateCompanies }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoute, setEditingRoute] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const allRoutes = useMemo(() => companies.flatMap(company =>
        (company.routes || []).map(route => ({
            ...route,
            companyId: company.id,
            companyName: company.name,
            companyLogo: company.logoUrl,
        }))
    ), [companies]);

    const filteredRoutes = useMemo(() => allRoutes.filter(route =>
        route.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.to.toLowerCase().includes(searchTerm.toLowerCase())
    ), [allRoutes, searchTerm]);
    
    const stats = useMemo(() => {
        if (allRoutes.length === 0) return { total: 0, busiest: 'N/A', mostProfitable: 'N/A' };
        
        const busiest = allRoutes.reduce((prev, current) => (prev.avgPassengers > current.avgPassengers) ? prev : current);
        const mostProfitable = allRoutes.reduce((prev, current) => ((prev.price * prev.avgPassengers) > (current.price * current.avgPassengers)) ? prev : current);

        return {
            total: allRoutes.length,
            busiest: `${busiest.from} - ${busiest.to} (${busiest.companyName})`,
            mostProfitable: `${mostProfitable.from} - ${mostProfitable.to} (${mostProfitable.companyName})`,
        }
    }, [allRoutes]);

    const handleSave = (routeData) => {
        const isNew = !editingRoute;
        const targetCompanyId = routeData.companyId;
        
        const updatedCompanies = companies.map(c => {
            if (c.id === targetCompanyId) {
                let newRoutes;
                if (isNew) {
                    const newRoute = { ...routeData, id: `route_${Date.now()}` };
                    delete newRoute.companyId;
                    delete newRoute.companyName;
                    delete newRoute.companyLogo;
                    newRoutes = [...(c.routes || []), newRoute];
                } else {
                    newRoutes = (c.routes || []).map(r => {
                        if (r.id === editingRoute.id) {
                             const updatedRoute = {...routeData};
                             delete updatedRoute.companyId;
                             delete updatedRoute.companyName;
                             delete updatedRoute.companyLogo;
                            return { ...r, ...updatedRoute };
                        }
                        return r;
                    });
                }
                return { ...c, routes: newRoutes };
            }
            return c;
        });

        onUpdateCompanies(updatedCompanies);
        setIsModalOpen(false);
        setEditingRoute(null);
    };

    const handleDelete = (route) => {
        if (window.confirm('Urifuza koko gusiba uru rugendo?')) {
            const updatedCompanies = companies.map(c => {
                if (c.id === route.companyId) {
                    return { ...c, routes: (c.routes || []).filter(r => r.id !== route.id) };
                }
                return c;
            });
            onUpdateCompanies(updatedCompanies);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Gucunga Ingendo</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard title="Ingendo Zose" value={stats.total} icon={<MapIcon className="w-6 h-6 text-blue-500"/>} format={false} />
                <StatCard title="Urugendo Rukunzwe Cyane" value={stats.busiest} icon={<UsersIcon className="w-6 h-6 text-blue-500"/>} format={false} />
                <StatCard title="Urugendo Rwinjiza Cyane" value={stats.mostProfitable} icon={<ChartBarIcon className="w-6 h-6 text-blue-500"/>} format={false} />
            </div>

            <div className="bg-white dark:bg-gray-800/50 p-4 sm:p-6 rounded-xl shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                     <div className="relative w-full sm:w-72">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" placeholder="Shakisha ingendo..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <button onClick={() => { setEditingRoute(null); setIsModalOpen(true); }} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                        <PlusIcon className="w-5 h-5 mr-2"/>Ongeramo Urugendo
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"><tr>
                            <th className="p-3">Ikigo</th><th>Uva</th><th>Ujya</th><th>Igiciro</th><th>Ibyo gukora</th>
                        </tr></thead>
                        <tbody>
                            {filteredRoutes.map(route => (
                                <tr key={route.id} className="border-t dark:border-gray-700">
                                    <td className="p-3 flex items-center space-x-3">
                                        <img src={route.companyLogo} alt={route.companyName} className="w-8 h-8 object-contain"/>
                                        <span className="font-semibold dark:text-white">{route.companyName}</span>
                                    </td>
                                    <td>{route.from}</td>
                                    <td>{route.to}</td>
                                    <td className="font-mono">{new Intl.NumberFormat('fr-RW').format(route.price)}</td>
                                    <td className="flex space-x-2 py-3">
                                        <button onClick={() => { setEditingRoute(route); setIsModalOpen(true); }} className="p-1 text-gray-500 hover:text-blue-600"><PencilSquareIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(route)} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && <RouteFormModal route={editingRoute} companies={companies} onSave={handleSave} onClose={() => setIsModalOpen(false)} />}
        </div>
    )
}

// FIX: Correctly type the SettingsCard component props to accept children.
const SettingsCard = ({ title, icon: Icon, children }: React.PropsWithChildren<{ title: string; icon: React.ElementType }>) => (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <Icon className="w-6 h-6 mr-3 text-blue-500" />
            {title}
        </h3>
        <div className="space-y-4">{children}</div>
    </div>
);

const SettingToggle = ({ label, description, enabled, onToggle }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700/50 last:border-b-0">
        <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">{label}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <button onClick={onToggle} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

const SettingInputRow = ({ label, type = "text", placeholder, value, onChange }) => (
    <div>
        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</label>
        <input 
            type={type} 
            placeholder={placeholder} 
            value={value}
            onChange={onChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
        />
    </div>
);

const SettingsPage = ({ theme, setTheme }) => {
    const [notifications, setNotifications] = useState({ newUser: true, newCompany: true, monthlyReport: true });
    // FIX: Add state for settings inputs to make them controlled components
    const [appName, setAppName] = useState('Rwanda Bus');
    const [supportEmail, setSupportEmail] = useState('support@rwandabus.rw');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Iboneza</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <SettingsCard title="Iboneza Rusange" icon={CogIcon}>
                        {/* FIX: Add value and onChange to SettingInputRow */}
                        <SettingInputRow label="Izina rya Porogaramu" placeholder="Rwanda Bus" value={appName} onChange={(e) => setAppName(e.target.value)}/>
                        {/* FIX: Add value and onChange to SettingInputRow */}
                        <SettingInputRow label="Imeri yo Kohererezaho" placeholder="support@rwandabus.rw" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)}/>
                        <button className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">Bika Impinduka</button>
                    </SettingsCard>

                    <SettingsCard title="Amabara n'Ururimi" icon={PaintBrushIcon}>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold dark:text-gray-200">Amabara</span>
                            <div className="flex items-center space-x-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                                <button onClick={() => setTheme('light')} className={`px-3 py-1 text-sm rounded-full ${theme === 'light' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}>Umunsi</button>
                                <button onClick={() => setTheme('dark')} className={`px-3 py-1 text-sm rounded-full ${theme === 'dark' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}>Ijoro</button>
                            </div>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="font-semibold dark:text-gray-200">Ururimi</span>
                            <select className="p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">
                                <option>Kinyarwanda</option>
                                <option>English</option>
                                <option>Français</option>
                            </select>
                        </div>
                    </SettingsCard>
                     <SettingsCard title="Amakuru & Kohereza" icon={ArrowUpTrayIcon}>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Ohereza amakuru y'abakoresha n'amatike yaguzwe.</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="px-4 py-2 border rounded-lg font-semibold dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition">Ohereza Abakoresha (CSV)</button>
                            <button className="px-4 py-2 border rounded-lg font-semibold dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition">Ohereza Amatike (CSV)</button>
                        </div>
                    </SettingsCard>
                </div>
                 <div className="space-y-8">
                    <SettingsCard title="Umutekano" icon={ShieldCheckIcon}>
                        <h4 className="font-bold text-gray-700 dark:text-gray-300">Hindura Ijambobanga</h4>
                        {/* FIX: Add placeholder, value and onChange to SettingInputRow */}
                        <SettingInputRow label="Ijambobanga rya Kera" type="password" placeholder="Ijambobanga rya Kera" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                        {/* FIX: Add placeholder, value and onChange to SettingInputRow */}
                        <SettingInputRow label="Ijambobanga Rishya" type="password" placeholder="Ijambobanga Rishya" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        {/* FIX: Add placeholder, value and onChange to SettingInputRow */}
                        <SettingInputRow label="Emeza Ijambobanga Rishya" type="password" placeholder="Emeza Ijambobanga Rishya" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <button className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">Hindura Ijambobanga</button>
                        <SettingToggle 
                            label="Kwemeza Konti mu Byiciro Bibiri (2FA)"
                            description="Rinda konte yawe cyane ukoresheje 2FA."
                            enabled={false}
                            onToggle={() => {}}
                        />
                    </SettingsCard>
                     <SettingsCard title="Ibimenyetso" icon={BellIcon}>
                        <h4 className="font-bold text-gray-700 dark:text-gray-300">Ibimenyetso bya Imeri</h4>
                        <SettingToggle label="Umukoresha mushya" description="Ohereza imeri iyo umukoresha mushya yiyandikishije" enabled={notifications.newUser} onToggle={() => setNotifications(p => ({...p, newUser: !p.newUser}))} />
                        <SettingToggle label="Ikigo gishya" description="Ohereza imeri iyo ikigo gishya cyemewe" enabled={notifications.newCompany} onToggle={() => setNotifications(p => ({...p, newCompany: !p.newCompany}))} />
                        <SettingToggle label="Raporo y'ukwezi" description="Ohereza raporo y'ukwezi ku mibare y'ingenzi" enabled={notifications.monthlyReport} onToggle={() => setNotifications(p => ({...p, monthlyReport: !p.monthlyReport}))} />
                    </SettingsCard>
                </div>
            </div>
        </div>
    );
};


const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, theme, setTheme, companies, onUpdateCompanies }) => {
  const [view, setView] = useState('dashboard');
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  const selectedCompany = useMemo(() => companies.find(c => c.id === selectedCompanyId), [companies, selectedCompanyId]);

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return <DashboardHome companies={companies} />;
      case 'companies':
        return <CompanyManagement 
                    companies={companies} 
                    onSelectCompany={(id) => { setSelectedCompanyId(id); setView('companyDetails'); }}
                    onUpdateCompanies={onUpdateCompanies}
                />;
      case 'transactions':
        return <TransactionsPage companies={companies} />;
      case 'companyDetails':
          return selectedCompany ? <CompanyDetails company={selectedCompany} onBack={() => setView('companies')} /> : <div>Ikigo nticyabonetse.</div>;
      case 'routes':
        return <RouteManagementPage companies={companies} onUpdateCompanies={onUpdateCompanies} />;
      case 'users':
        return <UserManagementPage />;
      case 'settings':
        return <SettingsPage theme={theme} setTheme={setTheme} />;
      default:
        return <DashboardHome companies={companies} />;
    }
  };

  const NavLink = ({ viewName, label, icon: Icon }) => (
      <button onClick={() => setView(viewName)} className={`group w-full flex items-center px-4 py-3 transition-all duration-300 rounded-lg relative ${view === viewName || (view === 'companyDetails' && viewName === 'companies') ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
          <div className={`absolute left-0 top-0 h-full w-1 rounded-r-full bg-yellow-400 transition-all duration-300 ${view === viewName || (view === 'companyDetails' && viewName === 'companies') ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-50'}`}></div>
          <Icon className="w-6 h-6 mr-4 transition-transform duration-300 group-hover:scale-110" />
          <span className="font-semibold">{label}</span>
      </button>
  );

  return (
    <div className={`min-h-screen flex ${theme}`}>
      <aside className="w-64 bg-gradient-to-b from-[#002B7F] via-[#0c2461] to-black text-gray-300 flex-col hidden lg:flex border-r border-gray-700/50 dark:border-gray-800/50">
        <div className="h-20 flex items-center justify-center text-white font-bold text-xl tracking-wider border-b border-white/10">
          RWANDA BUS ADMIN
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
            <NavLink viewName="dashboard" label="Imbonerahamwe" icon={ChartBarIcon} />
            <NavLink viewName="companies" label="Ibigo" icon={BuildingOfficeIcon} />
            <NavLink viewName="routes" label="Ingendo" icon={MapIcon} />
            <NavLink viewName="transactions" label="Ibikorwa by'Imari" icon={CreditCardIcon} />
            <NavLink viewName="users" label="Abakoresha" icon={UsersIcon} />
            <NavLink viewName="settings" label="Iboneza" icon={CogIcon} />
        </nav>
      </aside>

      <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900">
        <header className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm flex items-center justify-between lg:justify-end px-6 border-b dark:border-gray-700/50">
           <div className="lg:hidden text-gray-800 dark:text-white font-bold text-lg">ADMIN</div>
          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
            </button>
            <button className="text-gray-500 dark:text-gray-400">
              <BellIcon className="w-6 h-6" />
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Sohoka
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="animate-fade-in">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;