import React from 'react';
import { ArrowRightIcon, WifiIcon, AcIcon, PowerIcon } from './components/icons';
import AdBanner from './components/AdBanner';

const searchResults = [
  { id: 1, company: 'Volcano Express', departureTime: '07:00 AM', arrivalTime: '10:30 AM', duration: '3h 30m', price: '4,500 FRW', availableSeats: 23, amenities: ['WiFi', 'AC'] },
  { id: 2, company: 'Horizon Express', departureTime: '08:30 AM', arrivalTime: '12:15 PM', duration: '3h 45m', price: '4,800 FRW', availableSeats: 15, amenities: ['AC', 'Charging'] },
  { id: 3, company: 'RITCO', departureTime: '09:00 AM', arrivalTime: '12:30 PM', duration: '3h 30m', price: '4,500 FRW', availableSeats: 30, amenities: ['WiFi', 'AC', 'Charging'] },
  { id: 4, company: 'Volcano Express', departureTime: '11:00 AM', arrivalTime: '02:30 PM', duration: '3h 30m', price: '4,500 FRW', availableSeats: 5, amenities: ['AC'] },
];

interface SearchResultsPageProps {
  onTripSelect: (trip: any) => void;
}

const AmenityIcon: React.FC<{ amenity: string }> = ({ amenity }) => {
    const iconClass = "w-4 h-4 text-gray-500 dark:text-gray-400";
    if (amenity === 'WiFi') return <WifiIcon className={iconClass} />;
    if (amenity === 'AC') return <AcIcon className={iconClass} />;
    if (amenity === 'Charging') return <PowerIcon className={iconClass} />;
    return null;
};

const SearchResultCard: React.FC<{ result: any, onSelect: () => void }> = ({ result, onSelect }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-6 transform hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
        <div className="flex-shrink-0 w-full sm:w-auto text-center sm:text-left">
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
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{result.price}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">hasigaye imyanya {result.availableSeats}</p>
        </div>
        <button onClick={onSelect} className="w-full sm:w-auto flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#0033A0] font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-md">
            Hitamo Imyanya <ArrowRightIcon className="w-5 h-5 ml-2" />
        </button>
    </div>
);


const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ onTripSelect }) => {
  return (
    <div className="bg-gray-100/50 dark:bg-gray-900/50 min-h-full py-12">
      <div className="container mx-auto px-6">
        <AdBanner type="banner" />
        <div className="my-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Ibyavuye mu Gushakisha</h1>
            <p className="text-gray-600 dark:text-gray-400">Kigali - Rubavu, 28 Ukwakira, 2024</p>
        </div>
        <div className="space-y-6">
            {searchResults.map(result => (
                <SearchResultCard key={result.id} result={result} onSelect={() => onTripSelect(result)} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;