
import React, { useState } from 'react';
import { BusIcon, SearchIcon, PlusIcon, PencilSquareIcon, TrashIcon } from '../components/icons';

interface CompanyBusesProps {
    buses: any[];
    crudHandlers: any;
}

const CompanyBuses: React.FC<CompanyBusesProps> = ({ buses, crudHandlers }) => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div>
            <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">Manage Buses</h1>
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                 <div className="flex justify-between items-center mb-4">
                    <div className="relative w-full max-w-xs">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by plate or model..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                    <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
                        <PlusIcon className="w-5 h-5 mr-2" /> Add Bus
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="p-3">Plate Number</th>
                                <th className="p-3">Model</th>
                                <th className="p-3">Capacity</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buses.filter(b => b.plate.toLowerCase().includes(searchTerm.toLowerCase()) || b.model.toLowerCase().includes(searchTerm.toLowerCase())).map(bus => (
                                <tr key={bus.id} className="border-t dark:border-gray-700">
                                    <td className="p-3 font-semibold dark:text-white">{bus.plate}</td>
                                    <td>{bus.model}</td>
                                    <td>{bus.capacity} seats</td>
                                    <td>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${bus.status === 'On Route' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                            {bus.status}
                                        </span>
                                    </td>
                                    <td className="flex space-x-2 p-3">
                                        <button className="p-1 text-gray-500 hover:text-blue-600"><PencilSquareIcon className="w-5 h-5"/></button>
                                        <button className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5"/></button>
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

export default CompanyBuses;
