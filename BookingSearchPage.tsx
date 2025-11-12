import React, { useState, useMemo, useEffect } from 'react';
import { ArrowRightIcon, FilterIcon, StarIcon } from './components/icons';
import SearchResultsPage from './SearchResultsPage';
import { Page } from './App';
import * as api from './services/apiService';
import SearchResultSkeleton from './components/SearchResultSkeleton';

interface BookingSearchPageProps {
  searchParams: { from?: string; to?: string; date?: string; };
  onNavigate: (page: Page, data?: any) => void;
}

const BookingSearchPage: React.FC<BookingSearchPageProps> = ({ searchParams, onNavigate }) => {
  const [fromLocation, setFromLocation] = useState(searchParams?.from || 'Kigali');
  const [toLocation, setToLocation] = useState(searchParams?.to || 'Rubavu');
  const [journeyDate, setJourneyDate] = useState(searchParams?.date || new Date().toISOString().split('T')[0]);

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [sortOrder, setSortOrder] = useState('fastest');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoriteTrips, setFavoriteTrips] = useState<string[]>([]);

  const fetchTrips = async () => {
      if (!fromLocation || !toLocation || !journeyDate) return;
      setIsLoading(true);
      setError('');
      try {
          const data = await api.searchTrips(fromLocation, toLocation, journeyDate);
          setResults(data);
      } catch (err) {
          setError(err.message || 'Failed to fetch trips.');
      } finally {
          setIsLoading(false);
      }
  };
  
  useEffect(() => {
    fetchTrips();
  }, [fromLocation, toLocation, journeyDate]);

  useEffect(() => {
    const loadFavorites = () => {
        const storedFavorites = localStorage.getItem('favoriteTrips');
        setFavoriteTrips(storedFavorites ? JSON.parse(storedFavorites) : []);
    };
    loadFavorites();
    window.addEventListener('favoritesChanged', loadFavorites);
    return () => window.removeEventListener('favoritesChanged', loadFavorites);
  }, []);

  const filteredAndSortedResults = useMemo(() => {
    let processedResults = results
      .map(trip => {
          return {
              id: trip._id,
              company: trip.route.company.name,
              departureTime: new Date(trip.departureTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
              arrivalTime: new Date(trip.arrivalTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
              durationMinutes: trip.route.estimatedDurationMinutes,
              basePrice: trip.route.basePrice,
              dynamicPrice: trip.route.basePrice, // Can add dynamic logic here later
              availableSeats: Object.values(trip.seatMap).filter(s => s === 'available').length,
              amenities: trip.bus.amenities,
          };
      })
      .filter(trip => {
        if (showFavoritesOnly && !favoriteTrips.includes(trip.id)) return false;
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
  }, [results, sortOrder, showFavoritesOnly, favoriteTrips]);


  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="bg-white dark:bg-gray-800/50 shadow-sm pt-12 pb-24">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{fromLocation} <ArrowRightIcon className="inline w-8 h-8 mx-2"/> {toLocation}</h1>
                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{journeyDate}, {isLoading ? '...' : `${filteredAndSortedResults.length} trips found`}</p>
                    </div>
                </div>
            </div>
      </header>
       <main className="container mx-auto px-6 py-8 -mt-20">
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           <aside className="lg:col-span-1">
             <div className="sticky top-24 space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold dark:text-white flex items-center mb-4"><FilterIcon className="w-5 h-5 mr-2"/> Filters</h3>
                    
                    <div className="border-b dark:border-gray-700 pb-4">
                        <h4 className="font-semibold mb-2 dark:text-gray-200">Sort by</h4>
                        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                            <option value="fastest">Fastest</option>
                            <option value="cheapest">Cheapest</option>
                            <option value="earliest">Earliest Departure</option>
                        </select>
                    </div>

                    <div className="py-4">
                        <label className="flex items-center justify-between cursor-pointer">
                            <h4 className="font-semibold dark:text-gray-200 flex items-center"><StarIcon className="w-5 h-5 mr-2 text-yellow-400"/> Show Favorites Only</h4>
                             <div className="relative">
                                <input type="checkbox" checked={showFavoritesOnly} onChange={() => setShowFavoritesOnly(!showFavoritesOnly)} className="sr-only" />
                                <div className={`block w-10 h-6 rounded-full transition ${showFavoritesOnly ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showFavoritesOnly ? 'transform translate-x-4' : ''}`}></div>
                            </div>
                        </label>
                    </div>
                </div>
             </div>
           </aside>
           <div className="lg:col-span-3">
               {isLoading && <SearchResultSkeleton />}
               {error && <p className="text-red-500">{error}</p>}
               {!isLoading && !error && <SearchResultsPage results={filteredAndSortedResults} onTripSelect={(trip) => onNavigate('seatSelection', { tripId: trip.id })} />}
           </div>
         </div>
       </main>
    </div>
  );
};

export default BookingSearchPage;
