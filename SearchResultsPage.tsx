import React, { useState, useMemo } from 'react';
import SearchResultCard from './components/SearchResultCard';
import { FilterIcon, ClockIcon, CurrencyDollarIcon, TagIcon, CheckCircleIcon } from './components/icons';
import { useLanguage } from './contexts/LanguageContext';

interface SearchResultsPageProps {
  results: any[];
  onTripSelect: (trip: any) => void;
  favoriteTripIds: string[];
  onToggleFavorite: (tripId: string) => void;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ results, onTripSelect, favoriteTripIds, onToggleFavorite }) => {
  const { t } = useLanguage();
  
  // Internal Filter State
  const [priceRange, setPriceRange] = useState<number>(20000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [departureTime, setDepartureTime] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('fastest');

  // Derived Data for Filters
  const maxPrice = useMemo(() => {
      return results.length > 0 ? Math.max(...results.map(r => r.dynamicPrice)) : 20000;
  }, [results]);

  const allAmenities = useMemo(() => {
      const amenities = new Set<string>();
      results.forEach(r => r.amenities?.forEach((a: string) => amenities.add(a)));
      return Array.from(amenities);
  }, [results]);

  // Filtering Logic
  const filteredResults = useMemo(() => {
      return results.filter(trip => {
          // Price Filter
          if (trip.dynamicPrice > priceRange) return false;
          
          // Amenity Filter
          if (selectedAmenities.length > 0) {
              const tripAmenities = trip.amenities || [];
              const hasAll = selectedAmenities.every(a => tripAmenities.includes(a));
              if (!hasAll) return false;
          }

          // Time Filter (Departure)
          if (departureTime !== 'all') {
              const hour = parseInt(trip.departureTime.split(':')[0]);
              if (departureTime === 'morning' && (hour < 5 || hour >= 12)) return false;
              if (departureTime === 'afternoon' && (hour < 12 || hour >= 18)) return false;
              if (departureTime === 'evening' && hour < 18) return false;
          }

          return true;
      }).sort((a, b) => {
          // Sorting Logic
          switch (sortOption) {
              case 'cheapest': return a.dynamicPrice - b.dynamicPrice;
              case 'fastest': return a.durationMinutes - b.durationMinutes;
              case 'earliest': 
                return new Date(`1970/01/01 ${a.departureTime}`).getTime() - new Date(`1970/01/01 ${b.departureTime}`).getTime();
              case 'latest':
                return new Date(`1970/01/01 ${b.departureTime}`).getTime() - new Date(`1970/01/01 ${a.departureTime}`).getTime();
              default: return 0;
          }
      });
  }, [results, priceRange, selectedAmenities, departureTime, sortOption]);

  const toggleAmenity = (amenity: string) => {
      setSelectedAmenities(prev => 
          prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
      );
  };

  return (
    <div className="min-h-full flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="lg:w-1/4 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md sticky top-24 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg dark:text-white flex items-center">
                        <FilterIcon className="w-5 h-5 mr-2 text-blue-600"/> 
                        {t('filter_title')}
                    </h3>
                    <button 
                        onClick={() => { setPriceRange(maxPrice); setSelectedAmenities([]); setDepartureTime('all'); }}
                        className="text-xs text-blue-500 hover:underline"
                    >
                        {t('filter_reset')}
                    </button>
                </div>

                {/* Price Slider */}
                <div className="mb-6">
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">{t('filter_price_range')}</label>
                        <span className="text-sm font-bold text-blue-600">{new Intl.NumberFormat('fr-RW').format(priceRange)} RWF</span>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max={maxPrice} 
                        step="100"
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>0</span>
                        <span>{new Intl.NumberFormat('fr-RW').format(maxPrice)}</span>
                    </div>
                </div>

                {/* Departure Time */}
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3 flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1"/> {t('filter_time')}
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                        {['all', 'morning', 'afternoon', 'evening'].map(time => (
                            <button
                                key={time}
                                onClick={() => setDepartureTime(time)}
                                className={`px-3 py-2 text-sm rounded-lg text-left transition-all duration-200 flex justify-between items-center ${
                                    departureTime === time 
                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-700' 
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                                }`}
                            >
                                <span className="capitalize">{t(`filter_time_${time}`) || time}</span>
                                {departureTime === time && <CheckCircleIcon className="w-4 h-4"/>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Amenities */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3 flex items-center">
                        <TagIcon className="w-4 h-4 mr-1"/> {t('filter_amenities')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {allAmenities.map(amenity => (
                            <button
                                key={amenity}
                                onClick={() => toggleAmenity(amenity)}
                                className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                                    selectedAmenities.includes(amenity)
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : 'bg-transparent border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-400'
                                }`}
                            >
                                {amenity}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </aside>

        {/* Results Area */}
        <div className="lg:w-3/4 space-y-4">
            {/* Sorting Header */}
            <div className="flex flex-wrap items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {filteredResults.length} {t('search_results_count', { count: filteredResults.length })}
                </p>
                <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                    <span className="text-sm text-gray-500 hidden sm:inline">{t('filter_sort_by')}:</span>
                    <select 
                        value={sortOption} 
                        onChange={(e) => setSortOption(e.target.value)}
                        className="text-sm border-none bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white font-semibold cursor-pointer"
                    >
                        <option value="fastest">{t('filter_sort_fastest')}</option>
                        <option value="cheapest">{t('filter_sort_cheapest')}</option>
                        <option value="earliest">{t('filter_sort_earliest')}</option>
                        <option value="latest">Latest Departure</option>
                    </select>
                </div>
            </div>

            {/* Cards List */}
            <div className="space-y-6">
                {filteredResults.length > 0 ? (
                    filteredResults.map((result, index) => (
                        <SearchResultCard 
                            key={result.id} 
                            result={result} 
                            onSelect={() => onTripSelect(result)}
                            isFavorite={favoriteTripIds.includes(result.id)}
                            onToggleFavorite={() => onToggleFavorite(result.id)}
                            style={{ animationDelay: `${index * 100}ms` }}
                            className="stagger-fade-in"
                        />
                    ))
                ) : (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-dashed border-gray-300 dark:border-gray-600">
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                            <FilterIcon className="w-10 h-10 text-gray-400"/>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t('search_no_results')}</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your filters or search criteria.</p>
                        <button 
                            onClick={() => { setPriceRange(maxPrice); setSelectedAmenities([]); setDepartureTime('all'); }}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default SearchResultsPage;