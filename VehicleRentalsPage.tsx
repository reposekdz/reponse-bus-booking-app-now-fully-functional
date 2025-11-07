import React, { useState } from 'react';
import { Page } from './App';
import { KeyIcon } from './components/icons';

const mockVehicles = {
    'Kigali': [
        { name: 'Toyota RAV4', type: 'Car', price: 50000, image: 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/140507/rav4-exterior-right-front-three-quarter.jpeg?is-pending-processing=1' },
        { name: 'AGERA TVS', type: 'Moto', price: 15000, image: 'https://global.tvsmotor.com/media/1t2n2dpl/motorcycle-black.png' }
    ],
    'Rubavu': [
        { name: 'AGERA TVS', type: 'Moto', price: 12000, image: 'https://global.tvsmotor.com/media/1t2n2dpl/motorcycle-black.png' }
    ]
}

const VehicleRentalsPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const [location, setLocation] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setResults(mockVehicles[location] || []);
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex space-x-2">
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Enter pickup city..." className="flex-grow p-2 border rounded-md dark:bg-gray-700" required />
                <button type="submit" className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg">Find Vehicles</button>
            </form>
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                {isLoading && <p>Searching...</p>}
                {results.map(vehicle => (
                    <div key={vehicle.name} className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-700/50 p-2 rounded-lg">
                        <img src={vehicle.image} alt={vehicle.name} className="w-24 h-16 object-contain rounded-md"/>
                        <div className="flex-grow">
                            <p className="font-bold">{vehicle.name}</p>
                            <p className="text-xs text-gray-500">{vehicle.type}</p>
                            <p className="font-semibold text-green-600">{new Intl.NumberFormat('fr-RW').format(vehicle.price)} RWF / day</p>
                        </div>
                        <button className="px-3 py-1 bg-green-500 text-white text-xs rounded-md">Rent Now</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VehicleRentalsPage;