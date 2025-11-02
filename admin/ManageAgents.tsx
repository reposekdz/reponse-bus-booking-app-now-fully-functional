import React, { useState } from 'react';
import { BriefcaseIcon, SearchIcon, PlusIcon, PencilSquareIcon, TrashIcon } from '../components/icons';
import Modal from '../components/Modal';

interface ManageAgentsProps {
    agents: any[];
    crudHandlers: any;
}

const AgentForm = ({ agent, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        status: 'Active',
        ...agent
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Agent Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                    <option>Active</option>
                    <option>Probation</option>
                    <option>Inactive</option>
                </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold border rounded-lg dark:border-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Agent</button>
            </div>
        </form>
    );
};

const ManageAgents: React.FC<ManageAgentsProps> = ({ agents, crudHandlers }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAgent, setCurrentAgent] = useState<any | null>(null);

    const openModal = (agent = null) => {
        setCurrentAgent(agent);
        setIsModalOpen(true);
    };

    const handleSave = (agentData) => {
        if (currentAgent) {
            crudHandlers.updateAgent(agentData);
        } else {
            crudHandlers.addAgent(agentData);
        }
        setIsModalOpen(false);
    };
    
    return (
        <div>
            <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">Manage Agents</h1>
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                 <div className="flex justify-between items-center mb-4">
                    <div className="relative w-full max-w-xs">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search agents..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                    <button onClick={() => openModal()} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
                        <PlusIcon className="w-5 h-5 mr-2" /> Add Agent
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="p-3">Agent Name</th>
                                <th className="p-3">Location</th>
                                <th className="p-3">Total Deposits</th>
                                <th className="p-3">Commission Earned</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agents.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase())).map(agent => (
                                <tr key={agent.id} className="border-t dark:border-gray-700">
                                    <td className="p-3 font-semibold dark:text-white">{agent.name}</td>
                                    <td>{agent.location}</td>
                                    <td>{new Intl.NumberFormat('fr-RW').format(agent.totalDeposits)} RWF</td>
                                    <td>{new Intl.NumberFormat('fr-RW').format(agent.commission)} RWF</td>
                                    <td>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${agent.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'}`}>
                                            {agent.status}
                                        </span>
                                    </td>
                                    <td className="flex space-x-2 p-3">
                                        <button onClick={() => openModal(agent)} className="p-1 text-gray-500 hover:text-blue-600"><PencilSquareIcon className="w-5 h-5"/></button>
                                        <button onClick={() => crudHandlers.deleteAgent(agent.id)} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentAgent ? "Edit Agent" : "Add New Agent"}>
                <AgentForm agent={currentAgent} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default ManageAgents;
