import React, { useState, useMemo } from 'react';
import { UsersIcon, SearchIcon, EyeIcon } from '../components/icons';
import { Page } from '../App';

const mockUsers = [
  { 
    id: 1, name: 'Kalisa Jean', email: 'kalisa.j@example.com', role: 'passenger', status: 'Active', joinDate: '2023-01-15',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    coverUrl: 'https://images.unsplash.com/photo-1619534103142-93b3f276c120?q=80&w=2070&auto=format&fit=crop',
    walletBalance: 15000,
    bookingHistory: [
      { id: 'TICKET-001', from: 'Kigali', to: 'Rubavu', company: 'Volcano Express', date: '2024-10-28', price: '9,000 FRW' },
      { id: 'TICKET-003', from: 'Kigali', to: 'Musanze', company: 'Horizon Express', date: '2024-10-15', price: '3,500 FRW' },
    ]
  },
  { id: 2, name: 'John Doe', email: 'driver@volcano.rw', role: 'driver', status: 'Active', joinDate: '2022-03-10', avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg', coverUrl: 'https://images.unsplash.com/photo-1533104816-588941750c11?q=80&w=1974&auto=format&fit=crop' },
  { id: 3, name: 'Jane Smith', email: 'jane.s@agent.rw', role: 'agent', status: 'Active', joinDate: '2022-09-01', avatarUrl: 'https://randomuser.me/api/portraits/women/5.jpg', coverUrl: 'https://images.unsplash.com/photo-1614323992655-037a34c19a31?q=80&w=2070&auto=format&fit=crop' },
  { id: 4, name: 'Admin User', email: 'admin@rwandabus.rw', role: 'admin', status: 'Active', joinDate: '2022-01-01', avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg', coverUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop' },
  { 
    id: 5, name: 'Mutesi Aline', email: 'mutesi.a@example.com', role: 'passenger', status: 'Suspended', joinDate: '2023-03-22',
    avatarUrl: 'https://randomuser.me/api/portraits/women/33.jpg',
    coverUrl: 'https://images.unsplash.com/photo-1604928141068-a2acbe86d482?q=80&w=2070&auto=format&fit=crop',
    walletBalance: 2500,
    bookingHistory: [
       { id: 'TICKET-002', from: 'Huye', to: 'Kigali', company: 'RITCO', date: '2024-11-02', price: '3,000 FRW' },
    ]
  },
  { id: 6, name: 'Volcano Mgr', email: 'manager@volcano.rw', role: 'company', status: 'Active', joinDate: '2022-02-15', avatarUrl: 'https://pbs.twimg.com/profile_images/1237839357116452865/p-28c8o-_400x400.jpg', coverUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2048&auto=format&fit=crop' },
];

const ManageUsers: React.FC<{ navigate: (page: Page, data?: any) => void }> = ({ navigate }) => {
    const [users, setUsers] = useState(mockUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');

    const filteredUsers = useMemo(() => {
        return users.filter(user => 
            (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (roleFilter === 'All' || user.role === roleFilter)
        );
    }, [users, searchTerm, roleFilter]);
    
    const toggleStatus = (id: number) => {
        setUsers(users.map(user => user.id === id ? { ...user, status: user.status === 'Active' ? 'Suspended' : 'Active' } : user));
    };
    
    const handleViewProfile = (user: any) => {
        switch(user.role) {
            case 'passenger':
                navigate('passengerProfile', user);
                break;
            case 'driver':
                 // This requires more complete driver data here. For now, it will navigate with partial data.
                navigate('driverProfile', user);
                break;
            case 'agent':
                 // This requires more complete agent data here. For now, it will navigate with partial data.
                navigate('agentProfile', user);
                break;
            default:
                alert(`Profile page for role '${user.role}' is not available.`);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">User Management</h1>
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                 <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                        <div className="relative w-full max-w-xs">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                        <select 
                            value={roleFilter} 
                            onChange={e => setRoleFilter(e.target.value)}
                            className="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        >
                            <option value="All">All Roles</option>
                            <option value="passenger">Passenger</option>
                            <option value="driver">Driver</option>
                            <option value="agent">Agent</option>
                            <option value="company">Company</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Join Date</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="border-t dark:border-gray-700">
                                    <td className="p-3 font-semibold dark:text-white flex items-center space-x-3">
                                        <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                                        <span>{user.name}</span>
                                    </td>
                                    <td>{user.email}</td>
                                    <td className="capitalize">{user.role}</td>
                                    <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-3 flex items-center space-x-3">
                                        <button onClick={() => toggleStatus(user.id)} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                            {user.status === 'Active' ? 'Suspend' : 'Activate'}
                                        </button>
                                        <button onClick={() => handleViewProfile(user)} className="p-1 text-gray-500 hover:text-green-600" title="View Profile">
                                            <EyeIcon className="w-5 h-5"/>
                                        </button>
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

export default ManageUsers;