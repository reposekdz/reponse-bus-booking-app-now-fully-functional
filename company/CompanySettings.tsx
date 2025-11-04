import React, { useState } from 'react';
import { CogIcon, BuildingOfficeIcon } from '../components/icons';

interface CompanySettingsProps {
    companyData: any;
}

const CompanySettings: React.FC<CompanySettingsProps> = ({ companyData }) => {
    const [formData, setFormData] = useState({
        name: companyData.name || '',
        email: companyData.email || '',
        description: companyData.description || 'Volcano Express is one of the most popular transport companies...',
    });

    const handleSave = () => {
        // In a real app, this would be an API call
        alert('Company settings saved!');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">Company Settings</h1>
            <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
                <h2 className="text-xl font-bold dark:text-white mb-6 flex items-center"><BuildingOfficeIcon className="w-6 h-6 mr-3 text-blue-500"/> Company Profile</h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Email</label>
                        <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Public Description</label>
                        <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                </div>
                <div className="text-right mt-6">
                    <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompanySettings;