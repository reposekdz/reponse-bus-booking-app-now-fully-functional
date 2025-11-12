
import React, { useState, useEffect, useMemo } from 'react';
import SearchResultCard from './components/SearchResultCard';
import { Page } from './App';
import { StarIcon } from './components/icons';
import * as api from './services/apiService';

interface FavoritesPageProps {
    onNavigate: (page: Page, data?: any) => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ onNavigate }) => {
    const [allTrips, setAllTrips] = useState<any[]>([]);
    const [favoriteTrips, setFavoriteTrips] = useState<any[]>([]);

    const loadFavorites = () => {
        const storedFavorites = localStorage.getItem('favoriteTrips');
        const favoriteIds: string[] = storedFavorites ? JSON.parse(storedFavorites) : [];
        
        const processedTrips = allTrips.map(trip => ({
            id: trip._id,
            company: trip.route.company.name,
            departureTime: new Date(trip.departureTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            arrivalTime: new Date(trip.arrivalTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            durationMinutes: trip.route.estimatedDurationMinutes,
            basePrice: trip.route.basePrice,
            dynamicPrice: trip.route.basePrice,
            availableSeats: Object.values(trip.seatMap).filter(s => s === 'available').length,
            amenities: trip.bus.amenities,
        }));

        const favorited = processedTrips.filter(trip => favoriteIds.includes(trip.id));
        setFavoriteTrips(favorited);
    };

    useEffect(() => {
        const fetchAllTrips = async () => {
            try {
                // Fetch common routes to act as a pool of all trips for this demo
                const [kigaliRubavu, kigaliHuye] = await Promise.all([
                    api.searchTrips('Kigali', 'Rubavu', new Date().toISOString().split('T')[0]),
                    api.searchTrips('Kigali', 'Huye', new Date().toISOString().split('T')[0]),
                ]);
                setAllTrips([...kigaliRubavu, ...kigaliHuye]);
            } catch (e) {
                console.error("Failed to fetch trips for favorites", e);
            }
        };
        fetchAllTrips();
    }, []);

    useEffect(() => {
        if(allTrips.length > 0) {
            loadFavorites();
        }
        // Listen for changes from other tabs/windows
        window.addEventListener('storage', loadFavorites);
        // Listen for changes from the same tab (e.g., from search results page)
        window.addEventListener('favoritesChanged', loadFavorites);
        return () => {
            window.removeEventListener('storage', loadFavorites);
            window.removeEventListener('favoritesChanged', loadFavorites);
        };
    }, [allTrips]);

    // FIX: Changed tripId from number to string to match backend _id
    const toggleFavorite = (tripId: string) => {
        const storedFavorites = localStorage.getItem('favoriteTrips');
        let favoriteIds: string[] = storedFavorites ? JSON.parse(storedFavorites) : [];
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
                                onSelect={() => onNavigate('seatSelection', { tripId: trip.id })}
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
