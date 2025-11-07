import React, { useState, useEffect } from 'react';
import SearchResultCard from './components/SearchResultCard';

interface SearchResultsPageProps {
  results: any[];
  onTripSelect: (trip: any) => void;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ results, onTripSelect }) => {
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
    // Dispatch a custom event so other components on the same page can react in real-time
    window.dispatchEvent(new CustomEvent('favoritesChanged'));
  };

  return (
    <div className="min-h-full">
        <div className="space-y-6">
            {results.length > 0 ? (
                results.map((result, index) => (
                    <SearchResultCard 
                        key={result.id} 
                        result={result} 
                        onSelect={() => onTripSelect(result)}
                        isFavorite={favoriteTrips.includes(result.id)}
                        onToggleFavorite={() => toggleFavorite(result.id)}
                        style={{ animationDelay: `${index * 100}ms` }}
                        className="stagger-fade-in"
                    />
                ))
            ) : (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Nta Ngendo Zibonetse</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Gerageza guhindura ibyo washatse.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default SearchResultsPage;