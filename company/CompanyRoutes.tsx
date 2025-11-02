import React, { useState } from 'react';
import { MapIcon, SearchIcon, PlusIcon, PencilSquareIcon, TrashIcon, ClockIcon, ArrowRightIcon } from '../components/icons';
import Modal from '../components/Modal';

interface CompanyRoutesProps {
    routes: any[];
    crudHandlers: any;
    companyId: string;
}

const RouteForm = ({ route, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        from: '',
        to: '',
        duration: '',
        basePrice: '',
        ...route
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, basePrice: parseFloat(formData.basePrice) });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">From</label>
                    <input type="text" name="from" value={formData.from} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">To</label>
                    <input type="text" name="to" value={formData.to} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Duration (e.g., 3.5h)</label>
                <input type="text" name="duration" value={formData.duration} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Base Price (RWF)</label>
                <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold border rounded-lg dark:border-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Route</button>
            </div>
        </form>
    );
};

const CompanyRoutes: React.FC<CompanyRoutesProps> = ({ routes, crudHandlers, companyId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRoute, setCurrentRoute] = useState<any | null>(null);

    const openModal = (route = null) => {
        setCurrentRoute(route);
        setIsModalOpen(true);
    };

    const handleSave = (routeData) => {
        if (currentRoute) {
            crudHandlers.updateRoute(routeData);
        } else {
            crudHandlers.addRoute({ ...routeData, companyId, activeSchedules: 0 });
        }
        setIsModalOpen(false);
    };
    
    return (
        <div>
            <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">Manage Routes & Schedules</h1>
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                 <div className="flex justify-between items-center mb-4">
                    <div className="relative w-full max-w-xs">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search routes..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                    <button onClick={() => openModal()} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
                        <PlusIcon className="w-5 h-5 mr-2" /> Add Route
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="p-3">Route</th>
                                <th className="p-3">Duration</th>
                                <th className="p-3">Base Price</th>
                                <th className="p-3">Schedules</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {routes.filter(r => `${r.from}-${r.to}`.toLowerCase().includes(searchTerm.toLowerCase())).map(route => (
                                <tr key={route.id} className="border-t dark:border-gray-700">
                                    <td className="p-3 font-semibold dark:text-white flex items-center">
                                        {route.from} <ArrowRightIcon className="w-4 h-4 mx-2 text-gray-400"/> {route.to}
                                    </td>
                                    <td><ClockIcon className="w-4 h-4 inline mr-1 text-gray-400"/>{route.duration}</td>
                                    <td>{new Intl.NumberFormat('fr-RW').format(route.basePrice)} RWF</td>
                                    <td>{route.activeSchedules} active</td>
                                    <td className="flex space-x-2 p-3">
                                        <button onClick={() => openModal(route)} className="p-1 text-gray-500 hover:text-blue-600"><PencilSquareIcon className="w-5 h-5"/></button>
                                        <button onClick={() => crudHandlers.deleteRoute(route.id)} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentRoute ? "Edit Route" : "Add New Route"}>
                <RouteForm route={currentRoute} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default CompanyRoutes;
