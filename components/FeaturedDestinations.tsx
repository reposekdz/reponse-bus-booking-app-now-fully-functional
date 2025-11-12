
import React from 'react';
import { ArrowRightIcon } from './icons';

const destinations = [
  { from: 'Kigali', to: 'Rubavu', price: 4500, image: 'https://images.unsplash.com/photo/1590632313655-e9c5220c4273?q=80&w=2070&auto=format&fit=crop' },
  { from: 'Kigali', to: 'Musanze', price: 3500, image: 'https://www.andbeyond.com/wp-content/uploads/sites/5/one-of-the-reasons-to-visit-rwanda-gorilla.jpg' },
  { from: 'Kigali', to: 'Huye', price: 3000, image: 'https://live.staticflickr.com/3775/13360251415_a76b7a5449_b.jpg' },
  { from: 'Kigali', to: 'Nyungwe', price: 7000, image: 'https://visitnyungwe.com/wp-content/uploads/2020/09/Nyungwe-Canopy-Walk.jpg' },
];

interface DestinationCardProps {
    dest: typeof destinations[0];
    onSearch: (from: string, to: string) => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ dest, onSearch }) => (
    <div className="group relative rounded-2xl overflow-hidden shadow-lg h-96">
        <img src={dest.image} alt={`Image of ${dest.to}`} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold">{dest.to}</h3>
            <p className="text-sm opacity-90">From {dest.from}</p>
            <div className="mt-4 flex justify-between items-center">
                <div>
                    <p className="text-xs">Starting from</p>
                    <p className="text-xl font-bold text-yellow-300">{new Intl.NumberFormat('fr-RW').format(dest.price)} RWF</p>
                </div>
                <button 
                    onClick={() => onSearch(dest.from, dest.to)} 
                    className="px-4 py-2 rounded-lg bg-yellow-400 text-blue-900 font-bold text-sm transition-transform transform group-hover:scale-105"
                >
                    Book Now
                </button>
            </div>
        </div>
    </div>
);

interface FeaturedDestinationsProps {
    onSearch: (from?: string, to?: string) => void;
}

const FeaturedDestinations: React.FC<FeaturedDestinationsProps> = ({ onSearch }) => {
    return (
        <section>
            <div className="container mx-auto px-6">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-4xl">Top Destinations</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                        Explore Rwanda's most popular routes and start your adventure today.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {destinations.map(dest => (
                        <DestinationCard key={dest.to} dest={dest} onSearch={onSearch} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedDestinations;
