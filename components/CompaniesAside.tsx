import React, { useState, useMemo } from 'react';
import { Page } from '../App';
import { XIcon, SearchIcon, BuildingOfficeIcon, ChevronRightIcon } from './icons';
import { mockCompaniesData } from '../admin/AdminDashboard';
import StarRating from './StarRating';

interface CompaniesAsideProps {
    isOpen: boolean;
    onClose: () => void;
    navigate: (page: Page, data?: any) => void;
}

const CompaniesAside: React.FC<CompaniesAsideProps> = ({ isOpen, onClose, navigate }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const featuredCompanies = useMemo(() => mockCompaniesData.filter(c => (c.totalPassengers / 1_000_000) > 3), []);
    const filteredCompanies = useMemo(() => {
        if (!searchTerm) return mockCompaniesData;
        return mockCompaniesData.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm]);

    const handleNavigate = (page: Page, data?: any) => {
        navigate(page, data);
        onClose();
    };

    return (
        <div 
            className={`fixed inset-0 z-[60] transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            <aside 
                className={`absolute top-0 left-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b dark:border-gray-700 flex items-center justify-between flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                        <BuildingOfficeIcon className="w-6 h-6 mr-3 text-blue-500" />
                        Ibigo By'ingendo
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <XIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </header>

                <div className="p-4 flex-shrink-0">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text"
                            placeholder="Shakisha ikigo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar p-4 space-y-6">
                    {!searchTerm && (
                        <div>
                            <h3 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Iby'Imena</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {featuredCompanies.map(company => (
                                    <button key={company.id} onClick={() => handleNavigate('companyProfile', company)} className="group relative block w-full h-24 rounded-lg overflow-hidden text-left shadow-md">
                                        <img src={company.coverUrl} alt={company.name} className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"/>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                        <div className="absolute bottom-2 left-2 text-white">
                                            <p className="font-bold text-sm drop-shadow">{company.name}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">{searchTerm ? 'Ibisubizo' : 'Ibigo Byose'}</h3>
                        <div className="space-y-2">
                             {filteredCompanies.map(company => (
                                <button key={company.id} onClick={() => handleNavigate('companyProfile', company)} className="w-full flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                                    <img src={company.logoUrl} alt={company.name} className="w-12 h-12 object-contain bg-gray-100 dark:bg-gray-700 rounded-full p-1"/>
                                    <div className="flex-grow text-left">
                                        <p className="font-semibold text-gray-800 dark:text-white">{company.name}</p>
                                        <div className="flex items-center space-x-2">
                                            <StarRating rating={4.5} size="small"/>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{ (company.totalPassengers / 1000000).toFixed(1) }M+ passengers</span>
                                        </div>
                                    </div>
                                    <ChevronRightIcon className="w-5 h-5 text-gray-400"/>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <footer className="p-4 border-t dark:border-gray-700 flex-shrink-0">
                    <button onClick={() => handleNavigate('companies')} className="w-full text-center py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all text-sm">
                        Reba Ibigo Byose
                    </button>
                </footer>
            </aside>
        </div>
    );
};

export default CompaniesAside;