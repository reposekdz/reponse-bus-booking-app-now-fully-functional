import React, { useState, useEffect } from 'react';
import { BuildingOfficeIcon, SearchIcon, PlusIcon, PencilSquareIcon, TrashIcon } from '../components/icons';
import Modal from '../components/Modal';

interface ManageCompaniesProps {
    companies: any[];
    crudHandlers: any;
}

const CompanyForm = ({ company, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        logoUrl: '',
        coverUrl: '',
        status: 'Active',
        ...company
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Logo URL</label>
                <input type="text" name="logoUrl" value={formData.logoUrl} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Image URL</label>
                <input type="text" name="coverUrl" value={formData.coverUrl} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                    <option>Active</option>
                    <option>Inactive</option>
                </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold border rounded-lg dark:border-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Company</button>
            </div>
        </form>
    );
};

const ManageCompanies: React.FC<ManageCompaniesProps> = ({ companies, crudHandlers }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCompany, setCurrentCompany] = useState<any | null>(null);

    const openModal = (company = null) => {
        setCurrentCompany(company);
        setIsModalOpen(true);
    };

    const handleSave = (companyData) => {
        if (currentCompany) {
            crudHandlers.updateCompany(companyData);
        } else {
            crudHandlers.addCompany(companyData);
        }
        setIsModalOpen(false);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">Manage Companies</h1>
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                 <div className="flex justify-between items-center mb-4">
                    <div className="relative w-full max-w-xs">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search companies..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                    <button onClick={() => openModal()} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
                        <PlusIcon className="w-5 h-5 mr-2" /> Add Company
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="p-3">Company Name</th>
                                <th className="p-3">Passengers</th>
                                <th className="p-3">Revenue</th>
                                <th className="p-3">Routes</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(company => (
                                <tr key={company.id} className="border-t dark:border-gray-700">
                                    <td className="p-3 font-semibold dark:text-white">{company.name}</td>
                                    <td>{new Intl.NumberFormat().format(company.totalPassengers)}+</td>
                                    <td>{new Intl.NumberFormat('fr-RW', { notation: 'compact' }).format(company.totalRevenue)} RWF</td>
                                    <td>{company.routes.length}</td>
                                    <td>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${company.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                                            {company.status}
                                        </span>
                                    </td>
                                    <td className="flex space-x-2 p-3">
                                        <button onClick={() => openModal(company)} className="p-1 text-gray-500 hover:text-blue-600"><PencilSquareIcon className="w-5 h-5"/></button>
                                        <button onClick={() => crudHandlers.deleteCompany(company.id)} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentCompany ? "Edit Company" : "Add New Company"}>
                <CompanyForm company={currentCompany} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default ManageCompanies;
