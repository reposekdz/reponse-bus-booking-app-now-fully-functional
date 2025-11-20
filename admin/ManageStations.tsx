
import React, { useState, useEffect } from 'react';
import { MapPinIcon, PlusIcon, PencilSquareIcon, TrashIcon, SearchIcon } from '../components/icons';
import * as api from '../services/apiService';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmationModal from '../components/ConfirmationModal';
import { getDistrictList } from '../lib/stations';

const StationForm = ({ station, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: station?.name || '',
        district: station?.district || '',
        province: station?.province || '',
        type: station?.type || 'major',
    });
    
    const districts = getDistrictList();

    const handleChange = e => setFormData(p => ({...p, [e.target.name]: e.target.value}));

    const handleSubmit = e => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label className="block text-sm font-medium">Station Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">District</label>
                    <select name="district" value={formData.district} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700" required>
                        <option value="">Select District</option>
                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Province</label>
                    <select name="province" value={formData.province} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700" required>
                        <option value="">Select Province</option>
                        <option value="Kigali">Kigali</option>
                        <option value="North">North</option>
                        <option value="South">South</option>
                        <option value="East">East</option>
                        <option value="West">West</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium">Type</label>
                 <select name="type" value={formData.type} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700" required>
                    <option value="terminal">Terminal (Main)</option>
                    <option value="major">Major Stop</option>
                    <option value="minor">Minor Stop</option>
                </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg dark:border-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
            </div>
        </form>
    );
};

const ManageStations: React.FC = () => {
    const [stations, setStations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStation, setCurrentStation] = useState<any | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [error, setError] = useState('');

    const fetchStations = async () => {
        setIsLoading(true);
        try {
            const data = await api.getStations();
            setStations(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStations();
    }, []);

    const openModal = (station = null) => {
        setCurrentStation(station);
        setIsModalOpen(true);
    };

    const handleSave = async (data) => {
        setIsModalOpen(false);
        try {
            if (currentStation) {
                await api.adminUpdateStation(currentStation.id, data);
            } else {
                await api.adminCreateStation(data);
            }
            fetchStations();
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleDeleteClick = (id: number) => {
        setItemToDelete(id);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (itemToDelete === null) return;
        try {
            await api.adminDeleteStation(itemToDelete);
            fetchStations();
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsConfirmModalOpen(false);
            setItemToDelete(null);
        }
    };

    return (
        <div>
            {isLoading && <LoadingSpinner />}
            <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">Manage Bus Stations</h1>
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <div className="relative w-full max-w-xs">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search stations..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                    <button onClick={() => openModal()} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
                        <PlusIcon className="w-5 h-5 mr-2" /> Add Station
                    </button>
                </div>
                
                {error && <p className="text-red-500 my-2">{error}</p>}

                <div className="overflow-x-auto max-h-[600px]">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 sticky top-0">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">District</th>
                                <th className="p-3">Province</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stations.filter((s:any) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.district.toLowerCase().includes(searchTerm.toLowerCase())).map((station: any) => (
                                <tr key={station.id} className="border-t dark:border-gray-700">
                                    <td className="p-3 font-semibold dark:text-white">{station.name}</td>
                                    <td>{station.district}</td>
                                    <td>{station.province}</td>
                                    <td>
                                        <span className={`px-2 py-1 text-xs rounded-full ${station.type === 'terminal' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {station.type}
                                        </span>
                                    </td>
                                    <td className="flex space-x-2 p-3">
                                        <button onClick={() => openModal(station)} className="p-1 text-gray-500 hover:text-blue-600"><PencilSquareIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDeleteClick(station.id)} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentStation ? "Edit Station" : "Add New Station"}>
                <StationForm station={currentStation} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
             <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Station"
                message="Are you sure you want to delete this station?"
            />
        </div>
    );
};

export default ManageStations;
