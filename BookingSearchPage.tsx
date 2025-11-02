

import React, { useState, useMemo, useEffect } from 'react';
// FIX: Corrected import to point to the existing BookingForm component
import BookingForm from './components/BookingForm';
import { ClockIcon, ArrowRightIcon, WifiIcon, AcIcon, PowerIcon, StarIcon, SparklesIcon, FilterIcon, TruckIcon } from './components/icons';
import SearchResultSkeleton from './components/SearchResultSkeleton';

const searchResults = [
  { id: 1, company: 'Volcano Express', departureTime: '07:00 AM', arrivalTime: '10:30 AM', duration: '3h 30m', price: 4500, availableSeats: 23, amenities: ['WiFi', 'AC'], tag: 'Ikunzwe Cyane', busType: 'Luxury' },
  { id: 2, company: 'Horizon Express', departureTime: '08:30 AM', arrivalTime: '12:15 PM', duration: '3h 45m', price: 4800, availableSeats: 15, amenities: ['AC', 'Charging'], busType: 'Standard' },
  { id: 3, company: 'RITCO', departureTime: '09:00 AM', arrivalTime: '12:30 PM', duration: '3h 30m', price: 4500, availableSeats: 30, amenities: ['WiFi', 'AC', 'Charging'], tag: 'Byuzuye', busType: 'Standard' },
  { id: 4, company: 'Volcano Express', departureTime: '11:00 AM', arrivalTime: '02:30 PM', duration: '3h 30m', price: 4500, availableSeats: 5, amenities: ['AC'], busType: 'Standard' },
  { id: 5, company: 'Volcano Express', departureTime: '14:00 AM', arrivalTime: '17:30 PM', duration: '3h 30m', price: 4500, availableSeats: 18, amenities: ['AC', 'WiFi'], busType: 'Luxury' },
  { id: 6, company: 'RITCO', departureTime: '16:00 AM', arrivalTime: '19:30 PM', duration: '3h 30m', price: 4500, availableSeats: 40, amenities: ['AC', 'Charging'], busType: 'Standard' },
  { id: 7, company: 'Night Cruiser', departureTime: '22:00 PM', arrivalTime: '05:30 AM', duration: '7h 30m', price: 9000, availableSeats: 12, amenities: ['WiFi', 'AC', 'Charging'], busType: 'Sleeper' },
];

const featuredRoutes = [
    { from: 'Kigali', to: 'Rubavu', image: 'https://images.unsplash.com/photo-1590632313655-e9c5220c4273?q=80&w=2070&auto=format&fit=crop' },
    { from: 'Kigali', to: 'Huye', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Ethnographic_Museum_of_Rwanda.jpg' },
    { from: 'Kigali', to: 'Musanze', image: 'https://www.andbeyond.com/wp-content/uploads/sites/5/one-of-the-reasons-to-visit-rwanda-gorilla.jpg' },
    { from: 'Kigali', to: 'Nyungwe', image: 'https://nyungwepark.com/wp-content/uploads/2021/04/Nyungwe-Forest-National-Park.jpg' }
];

// --- Components moved from SearchResultsPage ---

const AmenityIcon: React.FC<{ amenity: string }> = ({ amenity }) => {
    const iconClass = "w-4 h-4 text-gray-500 dark:text-gray-400";
    if (amenity === 'WiFi') return <WifiIcon className={iconClass} />;
    if (amenity === 'AC') return <AcIcon className={iconClass} />;
    if (amenity === 'Charging') return <PowerIcon className={iconClass} />;
    return null;
};

const SearchResultCard: React.FC<{ result: any, onSelect: () => void, isFavorite: boolean, onToggleFavorite: () => void }> = ({ result, onSelect, isFavorite, onToggleFavorite }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-6 transform hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 relative">
        <div className="flex-shrink-0 w-full sm:w-auto text-center sm:text-left">
            {result.tag && (
                <div className="absolute top-0 left-0 transform -translate-x-3 -translate-y-3 -rotate-12 bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {result.tag}
                </div>
            )}
            <p className="font-bold text-gray-700 dark:text-gray-200 text-lg">{result.company}</p>
            <div className="flex items-center justify-center sm:justify-start space-x-3 mt-1">
                {result.amenities.map((amenity: string) => <AmenityIcon key={amenity} amenity={amenity} />)}
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <div className="text-center">
                <p className="font-bold text-xl text-gray-800 dark:text-white">{result.departureTime}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Kigali</p>
            </div>
            <div className="text-center text-gray-400">
                <p className="text-xs">{result.duration}</p>
                <div className="w-20 h-0.5 bg-gray-300 dark:bg-gray-600 my-1"></div>
                <p className="text-xs">Ntaho uhagaze</p>
            </div>
            <div className="text-center">
                <p className="font-bold text-xl text-gray-800 dark:text-white">{result.arrivalTime}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Rubavu</p>
            </div>
        </div>
        <div className="text-center flex-shrink-0">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{new Intl.NumberFormat('fr-RW').format(result.price)} RWF</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">hasigaye imyanya {result.availableSeats}</p>
        </div>
        <div className="flex items-center space-x-2">
            <button 
                onClick={onToggleFavorite}
                className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
                <StarIcon className={`w-6 h-6 transition-colors ${isFavorite ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
            </button>
            <button onClick={onSelect} className="w-full sm:w-auto flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#0033A0] font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-md">
                Hitamo Imyanya <ArrowRightIcon className="w-5 h-5 ml-2" />
            </button>
        </div>
    </div>
);

// --- End of moved components ---

interface BookingSearchPageProps {
    onTripSelect: (trip: any) => void;
}

const BookingSearchPage: React.FC<BookingSearchPageProps> = ({ onTripSelect }) => {
    const [showResults, setShowResults] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState<{ from?: string, to?: string }>({});
    const [priceFilter, setPriceFilter] = useState(10000);
    const [timeFilter, setTimeFilter] = useState<string[]>([]);
    const [amenitiesFilter, setAmenitiesFilter] = useState<string[]>([]);
    const [companyFilter, setCompanyFilter] = useState<string[]>([]);
    const [busTypeFilter, setBusTypeFilter] = useState<string[]>([]);
    const [favoriteTrips, setFavoriteTrips] = useState<number[]>([]);

    useEffect(() => {
        const storedFavorites = localStorage.getItem('favoriteTrips');
        if (storedFavorites) {
            setFavoriteTrips(JSON.parse(storedFavorites));
        }
    }, []);

    const toggleFavorite = (tripId: number) => {
        const newFavorites = favoriteTrips.includes(tripId)
          ? favoriteTrips.filter(id => id !== tripId)
          : [...favoriteTrips, tripId];
        
        setFavoriteTrips(newFavorites);
        localStorage.setItem('favoriteTrips', JSON.stringify(newFavorites));
    };
    
    const handleSearch = (from?: string, to?: string) => {
        setIsSearching(true);
        setShowResults(true);
        setSearchCriteria({ from, to });
        // Simulate API call
        setTimeout(() => {
            setIsSearching(false);
        }, 1500);
    };

    const handleTimeFilter = (time: string) => {
        setTimeFilter(prev => prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]);
    };
    
    const handleAmenityFilter = (amenity: string) => {
        setAmenitiesFilter(prev => prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]);
    }

    const handleCompanyFilter = (company: string) => {
        setCompanyFilter(prev => prev.includes(company) ? prev.filter(c => c !== company) : [...prev, company]);
    };

    const handleBusTypeFilter = (busType: string) => {
        setBusTypeFilter(prev => prev.includes(busType) ? prev.filter(bt => bt !== busType) : [...prev, busType]);
    };

    const companies = useMemo(() => [...new Set(searchResults.map(r => r.company))], []);
    const busTypes = useMemo(() => [...new Set(searchResults.map(r => r.busType))], []);

    const filteredResults = useMemo(() => {
        return searchResults.filter(result => {
            if (result.price > priceFilter) return false;

            if (timeFilter.length > 0) {
                const hour = parseInt(result.departureTime.split(':')[0]);
                const isMorning = hour >= 5 && hour < 12;
                const isAfternoon = hour >= 12 && hour < 18;
                const isEvening = hour >= 18;
                
                let matchesTime = false;
                if (timeFilter.includes('morning') && isMorning) matchesTime = true;
                if (timeFilter.includes('afternoon') && isAfternoon) matchesTime = true;
                if (timeFilter.includes('evening') && isEvening) matchesTime = true;
                if (!matchesTime) return false;
            }

            if (amenitiesFilter.length > 0) {
                if (!amenitiesFilter.every(amenity => result.amenities.includes(amenity))) return false;
            }
            
            if (companyFilter.length > 0) {
                if (!companyFilter.includes(result.company)) return false;
            }

            if (busTypeFilter.length > 0) {
                if (!busTypeFilter.includes(result.busType)) return false;
            }

            return true;
        });
    }, [priceFilter, timeFilter, amenitiesFilter, companyFilter, busTypeFilter]);

    return (
        <div className="min-h-full">
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Aside */}
                    <aside className="lg:w-1/3 xl:w-1/4">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-gradient-to-br from-blue-600 to-green-600 dark:from-gray-800 dark:to-gray-900/50 p-6 rounded-2xl shadow-2xl text-white">
                                {/* FIX: Corrected component usage to BookingForm */}
                                <BookingForm onSearch={handleSearch} />
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                                <h3 className="text-xl font-bold mb-4 dark:text-white flex items-center"><FilterIcon className="w-6 h-6 mr-2 text-blue-500"/> Filters</h3>
                                {/* Price Filter */}
                                <div className="mb-6">
                                    <label className="font-semibold dark:text-gray-200">Igiciro Ntarenze</label>
                                    <div className="flex items-center space-x-3">
                                        <input type="range" min="3000" max="10000" step="100" value={priceFilter} onChange={e => setPriceFilter(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/>
                                        <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">{new Intl.NumberFormat('fr-RW').format(priceFilter)}</span>
                                    </div>
                                </div>
                                {/* Time Filter */}
                                <div className="mb-6">
                                    <label className="font-semibold dark:text-gray-200 block mb-2">Igihe cyo Guhaguruka</label>
                                    <div className="flex space-x-2">
                                        {['morning', 'afternoon', 'evening'].map(time => (
                                            <button key={time} onClick={() => handleTimeFilter(time)} className={`w-full py-2 text-sm rounded-md border-2 transition-colors ${timeFilter.includes(time) ? 'bg-blue-500 text-white border-blue-500' : 'bg-transparent border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                                {time.charAt(0).toUpperCase() + time.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {/* Bus Type Filter */}
                                <div className="mb-6">
                                    <label className="font-semibold dark:text-gray-200 block mb-2">Ubwoko bwa Bisi</label>
                                    <div className="space-y-2">
                                        {busTypes.map(busType => (
                                            <label key={busType} className="flex items-center space-x-3 cursor-pointer">
                                                <input type="checkbox" checked={busTypeFilter.includes(busType)} onChange={() => handleBusTypeFilter(busType)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                                                <span className="text-sm dark:text-gray-300">{busType}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                 {/* Company Filter */}
                                <div className="mb-6">
                                    <label className="font-semibold dark:text-gray-200 block mb-2">Ibigo</label>
                                    <div className="space-y-2">
                                        {companies.map(company => (
                                            <label key={company} className="flex items-center space-x-3 cursor-pointer">
                                                <input type="checkbox" checked={companyFilter.includes(company)} onChange={() => handleCompanyFilter(company)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                                                <span className="text-sm dark:text-gray-300">{company}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                {/* Amenities Filter */}
                                <div>
                                    <label className="font-semibold dark:text-gray-200 block mb-2">Iby'Ingirakamaro</label>
                                    <div className="space-y-2">
                                        {['WiFi', 'AC', 'Charging'].map(amenity => (
                                            <label key={amenity} className="flex items-center space-x-3 cursor-pointer">
                                                <input type="checkbox" checked={amenitiesFilter.includes(amenity)} onChange={() => handleAmenityFilter(amenity)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                                                <span className="text-sm dark:text-gray-300">{amenity}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:w-2/3 xl:w-3/4">
                        {!showResults ? (
                             <div className="mt-12 lg:mt-0">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Ingendo Zikunzwe</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {featuredRoutes.map(route => (
                                        <button 
                                            key={`${route.from}-${route.to}`} 
                                            onClick={() => handleSearch(route.from, route.to)}
                                            className="group relative block w-full h-48 rounded-xl overflow-hidden shadow-lg transform hover:-translate-y-1 transition-transform duration-300"
                                        >
                                            <img src={route.image} alt={`View of ${route.to}`} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                                            <div className="absolute bottom-0 left-0 p-4">
                                                <p className="font-bold text-white text-lg drop-shadow-md">{route.from} - {route.to}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                <div className="mb-6">
                                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Ibyavuye mu Gushakisha</h1>
                                    <p className="text-gray-600 dark:text-gray-400">{searchCriteria.from} - {searchCriteria.to} &bull; {!isSearching && `${filteredResults.length} bisi zabonetse`}</p>
                                </div>
                                <div className="space-y-6">
                                    {isSearching ? (
                                        <SearchResultSkeleton count={3} />
                                    ) : filteredResults.length > 0 ? filteredResults.map(result => (
                                        <SearchResultCard 
                                            key={result.id} 
                                            result={result} 
                                            onSelect={() => onTripSelect(result)}
                                            isFavorite={favoriteTrips.includes(result.id)}
                                            onToggleFavorite={() => toggleFavorite(result.id)}
                                        />
                                    )) : (
                                        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                                            <h3 className="text-xl font-bold text-gray-700 dark:text-white">Nta Bisi Zibonetse</h3>
                                            <p className="text-gray-500 dark:text-gray-400 mt-2">Gerageza guhindura akayunguruzo kawe cyangwa usubiremo bundi bushya.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default BookingSearchPage;