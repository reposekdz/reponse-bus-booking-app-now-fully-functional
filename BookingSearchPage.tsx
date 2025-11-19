
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ArrowRightIcon, FilterIcon, StarIcon, TagIcon, CalendarIcon } from './components/icons';
import SearchResultsPage from './SearchResultsPage';
import { Page } from './types';
import * as api from './services/apiService';
import SearchResultSkeleton from './components/SearchResultSkeleton';
import Modal from './components/Modal';
import SearchableSelect from './components/SearchableSelect';
import PassengerSelector from './components/PassengerSelector';
import ErrorDisplay from './components/ErrorDisplay';
import { rwandaAllStations } from './lib/stations';
import { useLanguage } from './contexts/LanguageContext';

const allAmenities = ['WiFi', 'AC', 'Charging'];
const allDistricts = [...new Set(rwandaAllStations.map(station => station.district))].sort();
const locationToDistrictMap = new Map(rwandaAllStations.map(s => [s.name, s.district]));

interface BookingSearchPageProps {
  searchParams: { from?: string; to?: string; date?: string; passengers?: { adults: number; children: number; }, companyId?: string };
  onNavigate: (page: Page, data?: any) => void;
}

const FilterSidebarContent = ({ 
    t,
    sortOrder, setSortOrder, 
    amenityFilters, setAmenityFilters, 
    timeFilters, setTimeFilters, 
    companyFilters, setCompanyFilters, 
    companies, 
    showFavoritesOnly, setShowFavoritesOnly, 
    handleFilterToggle, 
    originDistrictFilter, setOriginDistrictFilter, 
    destinationDistrictFilter, setDestinationDistrictFilter,
    priceRange, setPriceRange 
}) => (
    <div className="space-y-6">
        <div>
            <h4 className="font-semibold mb-2 dark:text-gray-200">{t('filter_sort_by')}</h4>
            <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                <option value="fastest">{t('filter_sort_fastest')}</option>
                <option value="cheapest">{t('filter_sort_cheapest')}</option>
                <option value="earliest">{t('filter_sort_earliest')}</option>
            </select>
        </div>

         <div className="border-t dark:border-gray-700 pt-4">
            <h4 className="font-semibold mb-2 dark:text-gray-200">{t('filter_price_range')}</h4>
             <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">0</span>
                <input 
                    type="range" 
                    min="0" 
                    max="20000" 
                    step="500" 
                    value={priceRange} 
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <span className="text-sm font-bold text-blue-600">{new Intl.NumberFormat('fr-RW').format(priceRange)}</span>
            </div>
        </div>
        
        <div className="border-t dark:border-gray-700 pt-4">
            <h4 className="font-semibold mb-2 dark:text-gray-200">{t('filter_title')}</h4>
            <div className="space-y-3">
                 <select value={originDistrictFilter} onChange={e => setOriginDistrictFilter(e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                    <option value="">{t('filter_district_origin')}</option>
                    {allDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                 <select value={destinationDistrictFilter} onChange={e => setDestinationDistrictFilter(e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                    <option value="">{t('filter_district_dest')}</option>
                    {allDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>
        </div>
        
        <div className="border-t dark:border-gray-700 pt-4">
            <h4 className="font-semibold mb-2 dark:text-gray-200">{t('filter_amenities')}</h4>
            <div className="space-y-2">
                {allAmenities.map(amenity => (
                    <label key={amenity} className="flex items-center space-x-3 cursor-pointer group">
                        <input type="checkbox" checked={amenityFilters.includes(amenity)} onChange={() => handleFilterToggle(amenityFilters, setAmenityFilters, amenity)} className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 transition-all"/>
                        <span className="group-hover:text-blue-600 transition-colors dark:text-gray-300">{amenity}</span>
                    </label>
                ))}
            </div>
        </div>

         <div className="border-t dark:border-gray-700 pt-4">
            <h4 className="font-semibold mb-2 dark:text-gray-200">{t('filter_time')}</h4>
            <div className="space-y-2">
                {[
                    { label: t('filter_time_morning'), value: 'Morning' },
                    { label: t('filter_time_afternoon'), value: 'Afternoon' },
                    { label: t('filter_time_evening'), value: 'Evening' }
                ].map(time => (
                    <label key={time.value} className="flex items-center space-x-3 cursor-pointer group">
                        <input type="checkbox" checked={timeFilters.includes(time.value)} onChange={() => handleFilterToggle(timeFilters, setTimeFilters, time.value)} className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 transition-all"/>
                        <span className="group-hover:text-blue-600 transition-colors dark:text-gray-300">{time.label}</span>
                    </label>
                ))}
            </div>
        </div>
        
        <div className="border-t dark:border-gray-700 pt-4">
            <h4 className="font-semibold mb-2 dark:text-gray-200">{t('filter_companies')}</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                {companies.map(company => (
                    <label key={company.id} className="flex items-center space-x-3 cursor-pointer group">
                        <input type="checkbox" checked={companyFilters.includes(company.name)} onChange={() => handleFilterToggle(companyFilters, setCompanyFilters, company.name)} className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 transition-all"/>
                        <span className="group-hover:text-blue-600 transition-colors dark:text-gray-300">{company.name}</span>
                    </label>
                ))}
            </div>
        </div>

        <div className="border-t dark:border-gray-700 pt-4">
            <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <h4 className="font-semibold dark:text-gray-200 flex items-center"><StarIcon className="w-5 h-5 mr-2 text-yellow-400"/> {t('filter_show_favorites')}</h4>
                 <div className="relative">
                    <input type="checkbox" checked={showFavoritesOnly} onChange={() => setShowFavoritesOnly(!showFavoritesOnly)} className="sr-only" />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${showFavoritesOnly ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showFavoritesOnly ? 'transform translate-x-4' : ''}`}></div>
                </div>
            </label>
        </div>
    </div>
);


const BookingSearchPage: React.FC<BookingSearchPageProps> = ({ searchParams, onNavigate }) => {
  const { t } = useLanguage();
  const [fromLocation, setFromLocation] = useState(searchParams?.from || 'Kigali');
  const [toLocation, setToLocation] = useState(searchParams?.to || 'Rubavu');
  const [journeyDate, setJourneyDate] = useState(searchParams?.date || new Date().toISOString().split('T')[0]);
  const [passengers, setPassengers] = useState(searchParams?.passengers || { adults: 1, children: 0 });

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [companies, setCompanies] = useState<any[]>([]);
  const [companyName, setCompanyName] = useState('');
  
  // Filters State
  const [sortOrder, setSortOrder] = useState('fastest');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoriteTripIds, setFavoriteTripIds] = useState<string[]>([]);
  const [amenityFilters, setAmenityFilters] = useState<string[]>([]);
  const [companyFilters, setCompanyFilters] = useState<string[]>([]);
  const [timeFilters, setTimeFilters] = useState<string[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [originDistrictFilter, setOriginDistrictFilter] = useState('');
  const [destinationDistrictFilter, setDestinationDistrictFilter] = useState('');
  const [priceRange, setPriceRange] = useState(20000); // Max price filter
  
  const totalPassengers = useMemo(() => passengers.adults + passengers.children, [passengers]);

  // --- Surge Pricing Logic ---
  const calculateSurgePrice = (basePrice: number, availableSeats: number, departureHour: number) => {
      if (!basePrice || isNaN(basePrice)) return 0;
      let multiplier = 1;
      if (availableSeats < 5) multiplier += 0.2;
      else if (availableSeats < 10) multiplier += 0.1;
      if ((departureHour >= 6 && departureHour <= 9) || (departureHour >= 17 && departureHour <= 19)) {
          multiplier += 0.15;
      }
      const calculated = Math.round(basePrice * multiplier);
      return isNaN(calculated) ? basePrice : calculated; 
  };

  const fetchTrips = useCallback(async () => {
      if (!fromLocation || !toLocation || !journeyDate) return;
      setIsLoading(true);
      setError('');
      try {
          const data = await api.searchTrips(fromLocation, toLocation, journeyDate, searchParams?.companyId);
          setResults(data);
      } catch (err) {
          setError((err as Error).message || 'Failed to fetch trips.');
      } finally {
          setIsLoading(false);
      }
  }, [fromLocation, toLocation, journeyDate, searchParams?.companyId]);
  
  useEffect(() => {
    fetchTrips();
    const fetchCompanies = async () => {
        try {
            const companyData = await api.getCompanies();
            setCompanies(companyData);
        } catch (e) {
            console.error("Failed to fetch companies for filter", e);
        }
    };
    fetchCompanies();
  }, [fetchTrips]);

  useEffect(() => {
    if (searchParams?.companyId && companies.length > 0) {
        const company = companies.find(c => c.id.toString() === searchParams.companyId);
        if (company) {
            setCompanyName(company.name);
        }
    } else {
        setCompanyName('');
    }
  }, [searchParams?.companyId, companies]);

  const loadFavorites = () => {
    const storedFavorites = localStorage.getItem('favoriteTrips');
    setFavoriteTripIds(storedFavorites ? JSON.parse(storedFavorites) : []);
  };
  
  useEffect(() => {
    loadFavorites();
    window.addEventListener('favoritesChanged', loadFavorites);
    return () => window.removeEventListener('favoritesChanged', loadFavorites);
  }, []);

  const toggleFavorite = (tripId: string) => {
    const newFavorites = favoriteTripIds.includes(tripId)
      ? favoriteTripIds.filter(id => id !== tripId)
      : [...favoriteTripIds, tripId];
    setFavoriteTripIds(newFavorites);
    localStorage.setItem('favoriteTrips', JSON.stringify(newFavorites));
    window.dispatchEvent(new CustomEvent('favoritesChanged'));
  };

  const handleFilterToggle = (filterList, setFilterList, value) => {
    if (filterList.includes(value)) {
      setFilterList(filterList.filter(item => item !== value));
    } else {
      setFilterList([...filterList, value]);
    }
  };

  const filteredAndSortedResults = useMemo(() => {
    if (!results) return [];
    
    let processedResults = results
      .map((trip: any) => {
          const departureDateObj = new Date(trip.departureTime);
          const arrivalDateObj = new Date(trip.arrivalTime);
          const departureHour = departureDateObj.getHours();

          return {
            id: trip._id,
            from: trip.route.from,
            to: trip.route.to,
            company: trip.route.company.name,
            companyLogo: trip.route.company.logoUrl,
            departureTime: departureDateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            arrivalTime: arrivalDateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            durationMinutes: trip.route.estimatedDurationMinutes,
            basePrice: trip.route.basePrice,
            dynamicPrice: calculateSurgePrice(trip.route.basePrice, trip.availableSeats, departureHour), 
            availableSeats: trip.availableSeats,
            amenities: trip.bus.amenities,
            driver: trip.driver,
        };
      })
      .filter(trip => {
        if (trip.dynamicPrice > priceRange) return false; // Price Filter
        if (trip.availableSeats < totalPassengers) return false;
        if (showFavoritesOnly && !favoriteTripIds.includes(trip.id)) return false;
        if (amenityFilters.length > 0 && !amenityFilters.every(amenity => trip.amenities.includes(amenity))) return false;
        if (companyFilters.length > 0 && !companyFilters.includes(trip.company)) return false;
        
        if (originDistrictFilter && locationToDistrictMap.get(trip.from) !== originDistrictFilter) return false;
        if (destinationDistrictFilter && locationToDistrictMap.get(trip.to) !== destinationDistrictFilter) return false;

        if (timeFilters.length > 0) {
            const hour = parseInt(trip.departureTime.split(':')[0]);
            const isMorning = hour >= 5 && hour < 12;
            const isAfternoon = hour >= 12 && hour < 18;
            const isEvening = hour >= 18;
            
            const timeChecks = [];
            if (timeFilters.includes('Morning')) timeChecks.push(isMorning);
            if (timeFilters.includes('Afternoon')) timeChecks.push(isAfternoon);
            if (timeFilters.includes('Evening')) timeChecks.push(isEvening);

            if(timeChecks.length > 0 && !timeChecks.some(check => check === true)) return false;
        }
        return true;
      });

    processedResults.sort((a, b) => {
      switch (sortOrder) {
        case 'cheapest': return a.dynamicPrice - b.dynamicPrice;
        case 'fastest': return a.durationMinutes - b.durationMinutes;
        case 'earliest': return a.departureTime.localeCompare(b.departureTime);
        default: return 0;
      }
    });

    return processedResults;
  }, [results, sortOrder, showFavoritesOnly, favoriteTripIds, amenityFilters, companyFilters, timeFilters, totalPassengers, originDistrictFilter, destinationDistrictFilter, priceRange]);


  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="bg-white dark:bg-gray-800/50 shadow-sm pt-12 pb-8 sticky top-0 z-20 backdrop-blur-lg bg-opacity-90">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{fromLocation} <ArrowRightIcon className="inline w-6 sm:w-8 h-6 sm:h-8 mx-2 text-blue-500"/> {toLocation}</h1>
                        {companyName && <p className="text-lg text-gray-500 dark:text-gray-400">Filtered by: <span className="font-bold">{companyName}</span></p>}
                        <p className="mt-2 text-md sm:text-lg text-gray-600 dark:text-gray-400">{new Date(journeyDate).toDateString()}, {totalPassengers} {t('form_passengers')} - {isLoading ? t('app_loading') : <span className="font-semibold text-blue-600 dark:text-blue-400">{t('search_results_count', { count: filteredAndSortedResults.length })}</span>}</p>
                    </div>
                </div>
                 <div className="bg-white/50 dark:bg-black/30 p-4 rounded-xl grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-4 items-center border border-gray-200 dark:border-gray-700/50 shadow-sm">
                    <SearchableSelect options={allDistricts} value={fromLocation} onChange={setFromLocation} placeholder={t('form_from')} />
                    <SearchableSelect options={allDistricts} value={toLocation} onChange={setToLocation} placeholder={t('form_to')} />
                    <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                        <input type="date" value={journeyDate} onChange={e => setJourneyDate(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500 transition-colors"/>
                    </div>
                    <div className="min-w-[180px]">
                      <PassengerSelector passengers={passengers} onPassengersChange={setPassengers} className="bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-black dark:text-white" />
                    </div>
                 </div>
            </div>
      </header>
       <main className="container mx-auto px-6 py-8">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
           <aside className="hidden md:block md:col-span-1">
             <div className="sticky top-48 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700/50">
                <h3 className="text-xl font-bold dark:text-white flex items-center mb-4"><FilterIcon className="w-5 h-5 mr-2 text-blue-500"/> {t('filter_title')}</h3>
                <FilterSidebarContent 
                    t={t}
                    sortOrder={sortOrder} setSortOrder={setSortOrder}
                    amenityFilters={amenityFilters} setAmenityFilters={setAmenityFilters}
                    timeFilters={timeFilters} setTimeFilters={setTimeFilters}
                    companyFilters={companyFilters} setCompanyFilters={setCompanyFilters}
                    companies={companies}
                    showFavoritesOnly={showFavoritesOnly} setShowFavoritesOnly={setShowFavoritesOnly}
                    handleFilterToggle={handleFilterToggle}
                    originDistrictFilter={originDistrictFilter} setOriginDistrictFilter={setOriginDistrictFilter}
                    destinationDistrictFilter={destinationDistrictFilter} setDestinationDistrictFilter={setDestinationDistrictFilter}
                    priceRange={priceRange} setPriceRange={setPriceRange}
                />
             </div>
           </aside>
           <div className="md:col-span-3">
               <div className="md:hidden mb-4">
                 <button onClick={() => setIsFilterModalOpen(true)} className="w-full flex items-center justify-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow font-semibold text-blue-600 dark:text-blue-400">
                    <FilterIcon className="w-5 h-5 mr-2"/>
                    {t('filter_apply')}
                 </button>
               </div>
               {isLoading && <SearchResultSkeleton />}
               {error && <ErrorDisplay message={error} onRetry={fetchTrips} />}
               {!isLoading && !error && <SearchResultsPage 
                  results={filteredAndSortedResults} 
                  onTripSelect={(trip) => onNavigate('seatSelection', { tripId: trip.id })}
                  favoriteTripIds={favoriteTripIds}
                  onToggleFavorite={toggleFavorite}
                />}
           </div>
         </div>
       </main>
        <Modal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} title={t('filter_title')}>
            <FilterSidebarContent 
                t={t}
                sortOrder={sortOrder} setSortOrder={setSortOrder}
                amenityFilters={amenityFilters} setAmenityFilters={setAmenityFilters}
                timeFilters={timeFilters} setTimeFilters={setTimeFilters}
                companyFilters={companyFilters} setCompanyFilters={setCompanyFilters}
                companies={companies}
                showFavoritesOnly={showFavoritesOnly} setShowFavoritesOnly={setShowFavoritesOnly}
                handleFilterToggle={handleFilterToggle}
                originDistrictFilter={originDistrictFilter} setOriginDistrictFilter={setOriginDistrictFilter}
                destinationDistrictFilter={destinationDistrictFilter} setDestinationDistrictFilter={setDestinationDistrictFilter}
                priceRange={priceRange} setPriceRange={setPriceRange}
            />
            <div className="mt-6 text-right">
                <button onClick={() => setIsFilterModalOpen(false)} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105">{t('filter_apply')}</button>
            </div>
        </Modal>
    </div>
  );
};

export default BookingSearchPage;
