import React, { useState, useMemo, useEffect } from 'react';
import { ArrowRightIcon, FilterIcon, LocationMarkerIcon, CalendarIcon, UserCircleIcon, WifiIcon, AcIcon, PowerIcon, StarIcon } from './components/icons';
import SearchResultsPage from './SearchResultsPage';
import { Page } from './App';

interface BookingSearchPageProps {
  onSearch: (from: string, to: string) => void;
  navigate: (page: Page, data?: any) => void;
}

const locations = ['Kigali', 'Rubavu', 'Musanze', 'Huye', 'Rusizi', 'Nyagatare', 'Muhanga'];

export const allSearchResults = [
  { id: 1, company: 'Volcano Express', departureTime: '07:00', arrivalTime: '10:30', durationMinutes: 210, basePrice: 4500, availableSeats: 23, amenities: ['WiFi', 'AC'], tag: 'Ikunzwe Cyane' },
  { id: 2, company: 'Horizon Express', departureTime: '08:30', arrivalTime: '12:15', durationMinutes: 225, basePrice: 4800, availableSeats: 15, amenities: ['AC', 'Charging'] },
  { id: 3, company: 'RITCO', departureTime: '09:00', arrivalTime: '12:30', durationMinutes: 210, basePrice: 4500, availableSeats: 30, amenities: ['WiFi', 'AC', 'Charging'] },
  { id: 4, company: 'Volcano Express', departureTime: '11:00', arrivalTime: '14:30', durationMinutes: 210, basePrice: 4500, availableSeats: 5, amenities: ['AC'] },
  { id: 5, company: 'International', departureTime: '06:30', arrivalTime: '10:15', durationMinutes: 225, basePrice: 4200, availableSeats: 18, amenities: ['Charging'] },
  { id: 6, company: 'RITCO', departureTime: '13:00', arrivalTime: '16:30', durationMinutes: 210, basePrice: 4600, availableSeats: 40, amenities: ['WiFi', 'AC'] },
  { id: 7, company: 'Horizon Express', departureTime: '15:00', arrivalTime: '18:45', durationMinutes: 225, basePrice: 5000, availableSeats: 10, amenities: ['AC', 'Charging'] },
  { id: 8, company: 'Volcano Express', departureTime: '18:00', arrivalTime: '21:30', durationMinutes: 210, basePrice: 4700, availableSeats: 12, amenities: ['WiFi', 'AC', 'Charging'] },
];

const BookingSearchPage: React.FC<BookingSearchPageProps> = ({ onSearch: navigateToResults, navigate }) => {
  const [fromLocation, setFromLocation] = useState('Kigali');
  const [toLocation, setToLocation] = useState('Rubavu');
  const [journeyDate, setJourneyDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Filter and Sort State
  const [sortOrder, setSortOrder] = useState('fastest');
  const [priceRange, setPriceRange] = useState(5500);
  const [timeRange, setTimeRange] = useState({ min: 5, max: 23 });
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoriteTrips, setFavoriteTrips] = useState<number[]>([]);

  useEffect(() => {
    const loadFavorites = () => {
        const storedFavorites = localStorage.getItem('favoriteTrips');
        setFavoriteTrips(storedFavorites ? JSON.parse(storedFavorites) : []);
    };
    loadFavorites();

    window.addEventListener('storage', loadFavorites);
    window.addEventListener('favoritesChanged', loadFavorites);

    return () => {
        window.removeEventListener('storage', loadFavorites);
        window.removeEventListener('favoritesChanged', loadFavorites);
    };
  }, []);
  
  const availableCompanies = useMemo(() => [...new Set(allSearchResults.map(res => res.company))], []);

  const handleCompanyToggle = (companyName: string) => {
    setSelectedCompanies(prev => 
      prev.includes(companyName) 
        ? prev.filter(c => c !== companyName) 
        : [...prev, companyName]
    );
  };
  
  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev =>
        prev.includes(amenity)
            ? prev.filter(a => a !== amenity)
            : [...prev, amenity]
    );
  };

  const resetFilters = () => {
    setSortOrder('fastest');
    setPriceRange(5500);
    setTimeRange({ min: 5, max: 23 });
    setSelectedCompanies([]);
    setSelectedAmenities([]);
    setShowFavoritesOnly(false);
  };

  const filteredAndSortedResults = useMemo(() => {
    let results = allSearchResults
      .map(trip => {
          // Dynamic pricing simulation: price increases as seats decrease
          const occupancyRatio = 1 - (trip.availableSeats / 50); // Assuming max 50 seats
          const surgeFactor = 1 + (occupancyRatio * 0.2); // Max 20% surge
          const dynamicPrice = Math.round((trip.basePrice * surgeFactor) / 100) * 100;
          return { ...trip, dynamicPrice };
      })
      .filter(trip => {
        if (priceRange < trip.dynamicPrice) return false;
        
        const departureHour = parseInt(trip.departureTime.split(':')[0], 10);
        if (departureHour < timeRange.min || departureHour > timeRange.max) return false;

        if (selectedCompanies.length > 0 && !selectedCompanies.includes(trip.company)) return false;

        if (selectedAmenities.length > 0 && !selectedAmenities.every(a => trip.amenities.includes(a))) return false;

        if (showFavoritesOnly && !favoriteTrips.includes(trip.id)) return false;
        
        return true;
      });

    results.sort((a, b) => {
      switch (sortOrder) {
        case 'cheapest': return a.dynamicPrice - b.dynamicPrice;
        case 'fastest': return a.durationMinutes - b.durationMinutes;
        case 'earliest': return a.departureTime.localeCompare(b.departureTime);
        case 'seats_desc': return b.availableSeats - a.availableSeats;
        default: return 0;
      }
    });

    return results;
  }, [sortOrder, priceRange, timeRange, selectedCompanies, selectedAmenities, showFavoritesOnly, favoriteTrips]);


  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="bg-white dark:bg-gray-800/50 shadow-sm pt-12 pb-24">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{fromLocation} <ArrowRightIcon className="inline w-8 h-8 mx-2"/> {toLocation}</h1>
                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{journeyDate}, {filteredAndSortedResults.length} ingendo zabonetse</p>
                    </div>
                     <button onClick={() => navigate('bookingSearch')} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 font-semibold rounded-lg hover:bg-gray-200">Hindura Ishakisha</button>
                </div>
            </div>
      </header>
       <main className="container mx-auto px-6 py-8 -mt-20">
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           <aside className="lg:col-span-1">
             <div className="sticky top-24 space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold dark:text-white flex items-center"><FilterIcon className="w-5 h-5 mr-2"/> Sefa</h3>
                        <button onClick={resetFilters} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">Siba byose</button>
                    </div>
                    
                    <div className="border-b dark:border-gray-700 pb-4">
                        <h4 className="font-semibold mb-2 dark:text-gray-200">Tondeka</h4>
                        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                            <option value="fastest">Icyihuta cyane</option>
                            <option value="cheapest">Igihendutse</option>
                            <option value="earliest">Igisohoka mbere</option>
                            <option value="seats_desc">Imyanya myinshi</option>
                        </select>
                    </div>

                    <div className="border-b dark:border-gray-700 py-4">
                        <label className="flex items-center justify-between cursor-pointer">
                            <h4 className="font-semibold dark:text-gray-200 flex items-center"><StarIcon className="w-5 h-5 mr-2 text-yellow-400"/> Show Favorites Only</h4>
                             <div className="relative">
                                <input type="checkbox" checked={showFavoritesOnly} onChange={() => setShowFavoritesOnly(!showFavoritesOnly)} className="sr-only" />
                                <div className={`block w-10 h-6 rounded-full transition ${showFavoritesOnly ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showFavoritesOnly ? 'transform translate-x-4' : ''}`}></div>
                            </div>
                        </label>
                    </div>

                    <div className="border-b dark:border-gray-700 py-4">
                        <h4 className="font-semibold mb-2 dark:text-gray-200">Amenities</h4>
                        <div className="space-y-2">
                           <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" checked={selectedAmenities.includes('WiFi')} onChange={() => handleAmenityToggle('WiFi')} className="h-4 w-4 rounded"/><WifiIcon className="w-4 h-4 ml-1"/><span className="text-sm">WiFi</span></label>
                           <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" checked={selectedAmenities.includes('AC')} onChange={() => handleAmenityToggle('AC')} className="h-4 w-4 rounded"/><AcIcon className="w-4 h-4 ml-1"/><span className="text-sm">A/C</span></label>
                           <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" checked={selectedAmenities.includes('Charging')} onChange={() => handleAmenityToggle('Charging')} className="h-4 w-4 rounded"/><PowerIcon className="w-4 h-4 ml-1"/><span className="text-sm">Charging</span></label>
                        </div>
                    </div>
                    
                    <div className="border-b dark:border-gray-700 py-4">
                        <h4 className="font-semibold mb-2 dark:text-gray-200">Igiciro ntarengwa</h4>
                        <input type="range" min="4000" max="5500" step="100" value={priceRange} onChange={e => setPriceRange(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                        <div className="text-right text-sm font-bold text-gray-700 dark:text-gray-300 mt-1">{new Intl.NumberFormat('fr-RW').format(priceRange)} RWF</div>
                    </div>

                    <div className="border-b dark:border-gray-700 py-4">
                        <h4 className="font-semibold mb-2 dark:text-gray-200">Isaha yo guhaguruka</h4>
                        <input type="range" min="5" max="23" value={timeRange.max} onChange={e => setTimeRange(prev => ({...prev, max: Number(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                        <div className="text-right text-sm font-bold text-gray-700 dark:text-gray-300 mt-1">{timeRange.min}:00 - {timeRange.max}:00</div>
                    </div>

                    <div className="pt-4">
                         <h4 className="font-semibold mb-2 dark:text-gray-200">Ibigo</h4>
                         <div className="space-y-2">
                            {availableCompanies.map(company => (
                                <label key={company} className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" checked={selectedCompanies.includes(company)} onChange={() => handleCompanyToggle(company)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                                    <span className="text-sm dark:text-gray-300">{company}</span>
                                </label>
                            ))}
                         </div>
                    </div>
                </div>
             </div>
           </aside>
           <div className="lg:col-span-3">
               <SearchResultsPage results={filteredAndSortedResults} onTripSelect={(trip) => navigate('seatSelection', trip)} />
           </div>
         </div>
       </main>
    </div>
  );
};

export default BookingSearchPage;