import React, { useState, useMemo } from 'react';
import StarRating from './components/StarRating';
import { SearchIcon, ChevronRightIcon } from './components/icons';
import type { Page } from './App';

interface CompaniesPageProps {
  onNavigate: (page: Page, data?: any) => void;
}

const companies = [
  { id: 'ritco', name: 'RITCO', rating: 4.5, reviews: 120, logoText: 'RITCO' },
  { id: 'volcano', name: 'Volcano Express', rating: 4.8, reviews: 250, logoText: 'VOLCANO' },
  { id: 'horizon', name: 'Horizon Express', rating: 4.2, reviews: 98, logoText: 'HORIZON' },
  { id: 'onatra', name: 'ONATRACOM', rating: 3.9, reviews: 75, logoText: 'ONATRA' },
  { id: 'stellart', name: 'STELLART', rating: 4.6, reviews: 150, logoText: 'STELLART' },
  { id: 'select', name: 'SELECT', rating: 4.1, reviews: 60, logoText: 'SELECT' },
];

const CompanyCard: React.FC<{ company: typeof companies[0], onSelect: () => void }> = ({ company, onSelect }) => (
    <button 
        onClick={onSelect} 
        className="w-full text-left bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex items-center space-x-5 border-2 border-transparent hover:border-blue-500/50 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
    >
        <div className="flex-shrink-0 h-20 w-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center shadow-inner">
            <p className="font-bold text-blue-800 dark:text-gray-200 tracking-widest text-base">{company.logoText}</p>
        </div>
        <div className="flex-grow">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{company.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
                <StarRating rating={company.rating} />
                <span className="text-sm text-yellow-500 font-bold">{company.rating.toFixed(1)}</span>
            </div>
             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{company.reviews} ibitekerezo</p>
        </div>
        <div className="flex-shrink-0">
            <ChevronRightIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
        </div>
    </button>
);

const CompaniesPage: React.FC<CompaniesPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('rating_desc');

  const filteredAndSortedCompanies = useMemo(() => {
    return companies
      .filter(company => company.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        switch (sortOrder) {
          case 'rating_desc':
            return b.rating - a.rating;
          case 'rating_asc':
            return a.rating - b.rating;
          case 'name_asc':
            return a.name.localeCompare(b.name);
          case 'name_desc':
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
  }, [searchTerm, sortOrder]);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-16 sm:py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Ibigo Twizera Dukorana</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Dukorana n'ibigo bya bisi by'imena mu Rwanda kugira ngo tukwizere urugendo rwiza kandi rutekanye.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl shadow-md mb-12 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-grow w-full">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Shakisha ikigo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-yellow-500"
                />
            </div>
            <div className="flex-shrink-0">
                <select 
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-yellow-500"
                >
                    <option value="rating_desc">Tondeka ku manota (menshi)</option>
                    <option value="rating_asc">Tondeka ku manota (make)</option>
                    <option value="name_asc">Tondeka ku izina (A-Z)</option>
                    <option value="name_desc">Tondeka ku izina (Z-A)</option>
                </select>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {filteredAndSortedCompanies.map(company => (
            <CompanyCard key={company.id} company={company} onSelect={() => onNavigate('companyProfile', company)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;