import React, { useState, useMemo } from 'react';
import StarRating from './components/StarRating';
import { SearchIcon } from './components/icons';
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
    <button onClick={onSelect} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300 w-full">
        <div className="h-24 w-24 bg-gray-100 dark:bg-gray-700 border-4 border-white dark:border-gray-600 -mt-16 mb-4 rounded-full flex items-center justify-center shadow-lg">
            <p className="font-bold text-gray-700 dark:text-gray-300 tracking-widest text-sm">{company.logoText}</p>
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{company.name}</h3>
        <div className="flex items-center space-x-2">
            <StarRating rating={company.rating} />
            <span className="text-sm text-gray-500 dark:text-gray-400">({company.reviews} ibitekerezo)</span>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
          {filteredAndSortedCompanies.map(company => (
            <CompanyCard key={company.id} company={company} onSelect={() => onNavigate('companyProfile', company)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;