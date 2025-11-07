import React from 'react';
import { ChartBarIcon, UsersIcon, BuildingOfficeIcon, BriefcaseIcon } from '../components/icons';
import ActivityFeed from '../components/ActivityFeed';

// FIX: Exporting mock data to resolve module not found errors in other components.
export const mockCompaniesData = [
  { id: 'volcano', name: 'Volcano Express', status: 'Active', totalRevenue: 5_800_000_000, totalPassengers: 3_500_000, routesCount: 30, logoUrl: 'https://pbs.twimg.com/profile_images/1237839357116452865/p-28c8o-_400x400.jpg', coverUrl: 'https://images.unsplash.com/photo-1593256398246-8853b3815c32?q=80&w=2070&auto=format&fit=crop', description: 'Volcano Express is one of the most popular transport companies in Rwanda, known for its excellent service, cleanliness, and punctuality.' },
  { id: 'ritco', name: 'RITCO', status: 'Active', totalRevenue: 8_200_000_000, totalPassengers: 2_100_000, routesCount: 25, logoUrl: 'https://www.ritco.rw/wp-content/uploads/2021/04/ritco-logo-single.png', coverUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2048&auto=format&fit=crop', description: 'RITCO is a public-private partnership providing reliable country-wide transportation with a modern fleet of large buses.' },
  { id: 'horizon', name: 'Horizon Express', status: 'Active', totalRevenue: 3_100_000_000, totalPassengers: 1_800_000, routesCount: 22, logoUrl: 'https://media.licdn.com/dms/image/C4D0BAQHL8G_LgDIeew/company-logo_200_200/0/1630656360706/horizon_express_ltd_logo?e=2147483647&v=beta&t=o1QkClM7J5Z8Y4b3b2A1e2a5f6a8b7c5d4e3f2a1', coverUrl: 'https://images.unsplash.com/photo-1605641793224-6512a_d8363b?q=80&w=1974&auto=format&fit=crop', description: 'Horizon Express connects major towns with a focus on customer comfort and safety.' },
  { id: 'stellart', name: 'STELLART', status: 'Inactive', totalRevenue: 1_500_000_000, totalPassengers: 950_000, routesCount: 15, logoUrl: 'https://pbs.twimg.com/profile_images/1364539655823495169/DE-O7wXJ_400x400.jpg', coverUrl: 'https://images.unsplash.com/photo-1616372819235-9b2e1577a2d4?q=80&w=2070&auto=format&fit=crop', description: 'STELLART provides affordable travel options across the country.' },
  { id: 'kbs', name: 'Kigali Bus Services', status: 'Active', totalRevenue: 4_500_000_000, totalPassengers: 4_200_000, routesCount: 45, logoUrl: 'https://www.kigalitoday.com/IMG/arton42907.jpg?1688975878', coverUrl: 'https://live.staticflickr.com/4379/36598511743_3276841c30_b.jpg', description: 'The primary public transport provider within Kigali city and its surroundings.' },
];

export const mockDriversData = [
    { 
        id: 'd1', 
        name: 'John Doe', 
        companyId: 'volcano', 
        assignedBusId: 'RAD 123 B', 
        phone: '0788111222', 
        status: 'Active', 
        avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
        coverUrl: 'https://images.unsplash.com/photo-1533104816-588941750c11?q=80&w=1974&auto=format&fit=crop',
        performance: { onTimeRate: 98.5, averageRating: 4.8, completionRate: 100, safetyScore: 99, totalTrips: 245 },
        tripHistory: [
            {id: 'TRIP-501', route: 'Kigali - Rubavu', date: '2024-10-28', status: 'Completed', passengers: 54},
            {id: 'TRIP-504', route: 'Kigali - Rubavu', date: '2024-10-29', status: 'Upcoming', passengers: 0},
        ],
        documents: [{id: 'DL-RW-12345', name: 'Driver\'s License Category D', expiry: '2026-08-15'}]
    },
    { 
        id: 'd2', 
        name: 'Peter Jones', 
        companyId: 'ritco', 
        assignedBusId: 'RAF 456 C', 
        phone: '0788333444', 
        status: 'Active', 
        avatarUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
        coverUrl: 'https://images.unsplash.com/photo-1611316217997-d4a9893952f4?q=80&w=2070&auto=format&fit=crop',
        performance: { onTimeRate: 95.2, averageRating: 4.6, completionRate: 99, safetyScore: 95, totalTrips: 180 },
        tripHistory: [{id: 'TRIP-601', route: 'Kigali - Huye', date: '2024-10-28', status: 'Completed', passengers: 60}],
        documents: [{id: 'DL-RW-67890', name: 'Driver\'s License Category D', expiry: '2027-01-20'}]
    },
    { 
        id: 'd3', 
        name: 'Mary Anne', 
        companyId: 'volcano', 
        assignedBusId: 'RAE 789 A', 
        phone: '0788555666', 
        status: 'On Leave', 
        avatarUrl: 'https://randomuser.me/api/portraits/women/6.jpg',
        coverUrl: 'https://images.unsplash.com/photo-1605641793224-6512a_d8363b?q=80&w=1974&auto=format&fit=crop',
        performance: { onTimeRate: 99.1, averageRating: 4.9, completionRate: 100, safetyScore: 100, totalTrips: 312 },
        tripHistory: [{id: 'TRIP-701', route: 'Kigali - Musanze', date: '2024-10-27', status: 'Completed', passengers: 25}],
        documents: [{id: 'DL-RW-11223', name: 'Driver\'s License Category D', expiry: '2025-05-10'}]
    },
];


const StatCard = ({ title, value, icon, change, changeType }) => (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
        <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
        </div>
        <div className={`text-xs mt-2 font-semibold ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
            {change} vs last month
        </div>
    </div>
);

const AdminDashboard: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">Admin Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value="25.8M RWF" icon={<ChartBarIcon className="w-6 h-6 text-blue-600"/>} change="+5.2%" changeType="increase" />
                <StatCard title="Total Passengers" value="8.6M" icon={<UsersIcon className="w-6 h-6 text-blue-600"/>} change="+2.1%" changeType="increase" />
                <StatCard title="Active Companies" value="5" icon={<BuildingOfficeIcon className="w-6 h-6 text-blue-600"/>} change="+1" changeType="increase" />
                <StatCard title="Registered Agents" value="2" icon={<BriefcaseIcon className="w-6 h-6 text-blue-600"/>} change="+0%" changeType="increase" />
            </div>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold dark:text-white">Platform Analytics</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-4">Charts showing revenue, passenger growth, etc., will be here.</p>
                </div>
                <ActivityFeed />
            </div>
        </div>
    );
};

export default AdminDashboard;