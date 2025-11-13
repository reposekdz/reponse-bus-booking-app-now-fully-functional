import React, { useState } from 'react';
import { MegaphoneIcon, PlusIcon, PencilSquareIcon, TrashIcon } from '../components/icons';
import Modal from '../components/Modal';
import ConfirmationModal from '../components/ConfirmationModal';

const mockAds = [
    { id: 1, title: 'Gura Isabune ya MENYA NEZA!', description: 'Isuku n\'ubuzima. Boneka mu maduka yose.', type: 'banner', status: 'Active' },
    { id: 2, title: 'Inyange Juice Promotion', description: 'Buy 2 get 1 free.', type: 'sidebar', status: 'Active' },
    { id: 3, title: 'MTN Mobile Data', description: 'Get 5GB for 1000 RWF.', type: 'inline', status: 'Inactive' },
];

const AdForm = ({ ad, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'banner',
        status: 'Active',
        ...ad
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ad Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ad Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                        <option value="banner">Banner</option>
                        <option value="sidebar">Sidebar</option>
                        <option value="inline">Inline</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                        <option>Active</option>
                        <option>Inactive</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold border rounded-lg dark:border-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Ad</button>
            </div>
        </form>
    );
};


const ManageAds: React.FC = () => {
    const [ads, setAds] = useState(mockAds);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAd, setCurrentAd] = useState<any | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const openModal = (ad = null) => {
        setCurrentAd(ad);
        setIsModalOpen(true);
    };

    const handleSave = (adData) => {
        if (currentAd) {
            setAds(ads.map(ad => ad.id === currentAd.id ? { ...ad, ...adData } : ad));
        } else {
            setAds([...ads, { ...adData, id: Date.now() }]);
        }
        setIsModalOpen(false);
    };

    const handleDeleteClick = (id: number) => {
        setItemToDelete(id);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete === null) return;
        setAds(ads.filter(ad => ad.id !== itemToDelete));
        setIsConfirmModalOpen(false);
        setItemToDelete(null);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">Manage Advertisements</h1>
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                <div className="flex justify-end mb-4">
                     <button onClick={() => openModal()} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
                        <PlusIcon className="w-5 h-5 mr-2" /> Create Ad
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="p-3">Title</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ads.map(ad => (
                                <tr key={ad.id} className="border-t dark:border-gray-700">
                                    <td className="p-3 font-semibold dark:text-white">{ad.title}</td>
                                    <td className="capitalize">{ad.type}</td>
                                    <td>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ad.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{ad.status}</span>
                                    </td>
                                    <td className="flex space-x-2 p-3">
                                        <button onClick={() => openModal(ad)} className="p-1 text-gray-500 hover:text-blue-600"><PencilSquareIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDeleteClick(ad.id)} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentAd ? 'Edit Ad' : 'Create New Ad'}>
                <AdForm ad={currentAd} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Ad"
                message="Are you sure you want to delete this advertisement? This action cannot be undone."
            />
        </div>
    );
};

export default ManageAds;
