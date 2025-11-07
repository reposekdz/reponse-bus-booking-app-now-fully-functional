import React, { useState, useEffect } from 'react';
import SearchResultCard from './components/SearchResultCard';
import { allSearchResults } from './BookingSearchPage';
import { Page } from './App';
import { StarIcon } from './components/icons';

interface FavoritesPageProps {
    onNavigate: (page: Page, data?: any) => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ onNavigate }) => {
    const [favoriteTrips, setFavoriteTrips] = useState<any[]>([]);

    const loadFavorites = () => {
        const storedFavorites = localStorage.getItem('favoriteTrips');
        const favoriteIds: number[] = storedFavorites ? JSON.parse(storedFavorites) : [];
        const favorited = allSearchResults.filter(trip => favoriteIds.includes(trip.id));
        setFavoriteTrips(favorited);
    };

    useEffect(() => {
        loadFavorites();
        // Listen for changes from other tabs/windows
        window.addEventListener('storage', loadFavorites);
        // Listen for changes from the same tab (e.g., from search results page)
        window.addEventListener('favoritesChanged', loadFavorites);
        return () => {
            window.removeEventListener('storage', loadFavorites);
            window.removeEventListener('favoritesChanged', loadFavorites);
        };
    }, []);

    const toggleFavorite = (tripId: number) => {
        const storedFavorites = localStorage.getItem('favoriteTrips');
        let favoriteIds: number[] = storedFavorites ? JSON.parse(storedFavorites) : [];
        // On this page, toggling always means removing
        favoriteIds = favoriteIds.filter(id => id !== tripId);
        localStorage.setItem('favoriteTrips', JSON.stringify(favoriteIds));
        // Dispatch event for same-tab components to update, although loadFavorites will handle it here
        window.dispatchEvent(new CustomEvent('favoritesChanged'));
    };
    
    return (
        <div className="bg-gray-100/50 dark:bg-gray-900/50 min-h-screen">
            <header className="bg-white dark:bg-gray-800 shadow-sm pt-12 pb-8">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">My Favorite Trips</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Your saved trips for easy access and booking.</p>
                </div>
            </header>
            <main className="container mx-auto px-6 py-8">
                <div className="space-y-6">
                    {favoriteTrips.length > 0 ? (
                        favoriteTrips.map((trip, index) => (
                             <SearchResultCard 
                                key={trip.id} 
                                result={trip} 
                                onSelect={() => onNavigate('seatSelection', trip)}
                                isFavorite={true}
                                onToggleFavorite={() => toggleFavorite(trip.id)}
                                style={{ animationDelay: `${index * 100}ms` }}
                                className="stagger-fade-in"
                            />
                        ))
                    ) : (
                        <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                            <StarIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto" />
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-4">No Favorite Trips Yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Click the star icon on search results to save trips here.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default FavoritesPage;