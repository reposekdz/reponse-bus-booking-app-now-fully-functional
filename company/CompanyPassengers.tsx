import React, { useState, useMemo } from 'react';
import { UsersIcon, SearchIcon, EyeIcon } from '../components/icons';
import PassengerDetailModal from '../components/PassengerDetailModal';

const mockPassengers = [
  { id: 1, name: 'Kalisa Jean', route: 'Kigali - Rubavu', date: '2024-10-25', ticketId: 'VK-83AD1', seat: 'A5', phone: '0788123456', email: 'kalisa.j@email.com' },
  { id: 2, name: 'Mugisha Frank', route: 'Kigali - Musanze', date: '2024-10-25', ticketId: 'VK-91BC2', seat: 'C2', phone: '0788234567', email: 'mugisha.f@email.com' },
  { id: 3, name: 'Irakoze Grace', route: 'Kigali - Rubavu', date: '2024-10-24', ticketId: 'VK-76DE3', seat: 'B4', phone: '0788345678', email: 'irakoze.g@email.com' },
  { id: 4, name: 'Umutoni Aline', route: 'Kigali - Huye', date: '2024-10-23', ticketId: 'VK-65EF4', seat: 'A1', phone: '0788456789', email: 'umutoni.a@email.com' },
  { id: 5, name: 'Gatete David', route: 'Huye - Kigali', date: '2024-10-22', ticketId: 'VK-54FG5', seat: 'D1', phone: '0788567890', email: 'gatete.d@email.com' },
];

const CompanyPassengers: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [routeFilter, setRouteFilter] = useState('All');
    const [selectedPassenger, setSelectedPassenger] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const uniqueRoutes = useMemo(() => ['All', ...new Set(mockPassengers.map(p => p.route))], []);

    const filteredPassengers = useMemo(() => {
        return mockPassengers.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (routeFilter === 'All' || p.route === routeFilter)
        );
    }, [searchTerm, routeFilter]);

    const viewPassengerDetails = (passenger) => {
        // In a real app, you might fetch more detailed history here
        const history = mockPassengers.filter(p => p.email === passenger.email);
        setSelectedPassenger({ ...passenger, history });
        setIsModalOpen(true);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">Passenger History</h1>
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                 <div className="flex items-center space-x-4 mb-4">
                    <div className="relative w-full max-w-xs">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by passenger name..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                     <select 
                        value={routeFilter} 
                        onChange={e => setRouteFilter(e.target.value)}
                        className="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    >
                        {uniqueRoutes.map(route => <option key={route} value={route}>{route}</option>)}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="p-3">Passenger Name</th>
                                <th className="p-3">Route</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Ticket ID</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPassengers.map(passenger => (
                                <tr key={passenger.id} className="border-t dark:border-gray-700">
                                    <td className="p-3 font-semibold dark:text-white">{passenger.name}</td>
                                    <td>{passenger.route}</td>
                                    <td>{new Date(passenger.date).toLocaleDateString()}</td>
                                    <td className="font-mono">{passenger.ticketId}</td>
                                    <td>
                                        <button onClick={() => viewPassengerDetails(passenger)} className="p-1 text-gray-500 hover:text-blue-600" title="View Details">
                                            <EyeIcon className="w-5 h-5"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
             {isModalOpen && selectedPassenger && (
                <PassengerDetailModal 
                    passenger={selectedPassenger} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </div>
    );
};

export default CompanyPassengers;