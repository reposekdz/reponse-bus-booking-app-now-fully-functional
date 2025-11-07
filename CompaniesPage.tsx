
import React, { useState, useMemo } from 'react';
import StarRating from './components/StarRating';
import { SearchIcon, ChevronRightIcon, StarIcon } from './components/icons';
import type { Page } from './App';
import { mockCompaniesData } from './admin/AdminDashboard';

interface CompaniesPageProps {
  onNavigate: (page: Page, data?: any) => void;
}

const FeaturedCompanyCard: React.FC<{ company: any, onSelect: () => void }> = ({ company, onSelect }) => (
    <button 
        onClick={onSelect} 
        className="group relative w-full h-64 rounded-xl overflow-hidden shadow-lg transform hover:-translate-y-1 transition-all duration-300"
    >
        <img src={company.coverUrl} alt={company.name} className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="relative h-full flex flex-col justify-end p-5 text-white">
            <div className="flex items-center space-x-3 mb-2">
                <img src={company.logoUrl} alt={`${company.name} logo`} className="w-14 h-14 object-contain bg-white/80 dark:bg-gray-900/80 p-1 rounded-full shadow-md border-2 border-white dark:border-gray-700"/>
                <div>
                    <h3 className="text-xl font-bold drop-shadow-lg">{company.name}</h3>
                    <div className="flex items-center space-x-1">
                        <StarRating rating={4.8} size="small"/>
                        <span className="text-xs text-yellow-300 font-bold">{(company.totalPassengers / 1_000_000).toFixed(1)}M+ abagenzi</span>
                    </div>
                </div>
            </div>
            <p className="text-xs text-gray-200 line-clamp-2">{company.description}</p>
        </div>
        <div className="absolute top-4 right-4 bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full shadow-md transform group-hover:scale-110 transition-transform">
            By'Imena
        </div>
    </button>
);


const CompanyCard: React.FC<{ company: any, onSelect: () => void }> = ({ company, onSelect }) => (
    <button 
        onClick={onSelect} 
        className="w-full text-left bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex items-center space-x-5 border-2 border-transparent hover:border-blue-500/50 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
    >
        <div className="flex-shrink-0 h-20 w-20 bg-white dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center shadow-inner">
            <img src={company.logoUrl} alt={`${company.name} logo`} className="h-16 w-16 object-contain p-1"/>
        </div>
        <div className="flex-grow">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{company.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
                <StarRating rating={4.5} />
                <span className="text-sm text-yellow-500 font-bold">{(company.totalPassengers / 1_000_000).toFixed(1)}M+</span>
            </div>
             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{company.routesCount} ingendo</p>
        </div>
        <div className="flex-shrink-0">
            <ChevronRightIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
        </div>
    </button>
);

const CompaniesPage: React.FC<CompaniesPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('rating_desc');
  const [ratingFilter, setRatingFilter] = useState(0);

  const featuredCompanies = useMemo(() => mockCompaniesData.filter(c => (c.totalPassengers / 1_000_000) >= 2.0), []);
  const regularCompanies = useMemo(() => mockCompaniesData.filter(c => !featuredCompanies.some(fc => fc.id === c.id)), [featuredCompanies]);

  const filteredAndSortedCompanies = useMemo(() => {
    return regularCompanies
      .filter(company => 
          company.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (company.totalRevenue / 1_000_000_000 * 5) >= ratingFilter // Using revenue as a proxy for rating
      )
      .sort((a, b) => {
        switch (sortOrder) {
          case 'rating_desc':
            return b.totalPassengers - a.totalPassengers;
          case 'rating_asc':
            return a.totalPassengers - b.totalPassengers;
          case 'name_asc':
            return a.name.localeCompare(b.name);
          case 'name_desc':
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
  }, [searchTerm, sortOrder, ratingFilter, regularCompanies]);
  

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
       <header className="bg-white dark:bg-gray-800/50 shadow-sm pt-12 pb-8">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Ibigo Twizera Dukorana</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                    Dukorana n'ibigo bya bisi by'imena mu Rwanda kugira ngo tukwizere urugendo rwiza kandi rutekanye.
                </p>
            </div>
        </header>
        <main className="container mx-auto px-6 py-12">
            
            <section className="mb-16">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Top Rated & Popular</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {featuredCompanies.map(company => (
                        <FeaturedCompanyCard key={company.id} company={company} onSelect={() => onNavigate('companyProfile', company)} />
                    ))}
                 </div>
            </section>
            
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                 <aside className="lg:w-1/4 xl:w-1/5">
                    <div className="sticky top-24 space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                             <h3 className="text-lg font-bold mb-4 dark:text-white">Sefa Ibindi Bigo</h3>
                             <div className="relative mb-4">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Shakisha ikigo..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold dark:text-gray-300">Tondeka</label>
                                <select 
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="mt-1 w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-yellow-500"
                                >
                                    <option value="rating_desc">Ubukunzi (bwinshi)</option>
                                    <option value="rating_asc">Ubukunzi (buke)</option>
                                    <option value="name_asc">Ku izina (A-Z)</option>
                                    <option value="name_desc">Ku izina (Z-A)</option>
                                </select>
                            </div>
                             <div className="mt-4">
                                <label className="text-sm font-semibold dark:text-gray-300">Amanota (min)</label>
                                <div className="flex items-center space-x-2 mt-1">
                                    <input
                                        type="range"
                                        min="0"
                                        max="5"
                                        step="0.5"
                                        value={ratingFilter}
                                        onChange={(e) => setRatingFilter(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                    <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">{ratingFilter.toFixed(1)} <StarIcon className="w-4 h-4 inline-block -mt-1"/></span>
                                </div>
                            </div>
                        </div>
                    </div>
                 </aside>
                <section className="lg:w-3/4 xl:w-4/5">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Ibindi Bigo Byose</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredAndSortedCompanies.length > 0 ? (
                        filteredAndSortedCompanies.map(company => (
                          <CompanyCard key={company.id} company={company} onSelect={() => onNavigate('companyProfile', company)} />
                        ))
                      ) : (
                        <p className="md:col-span-2 text-center text-gray-500 dark:text-gray-400">Nta kigo gihuye n'ishakisha ryawe.</p>
                      )}
                    </div>
                </section>
            </div>
        </main>
    </div>
  );
};

export default CompaniesPage;
