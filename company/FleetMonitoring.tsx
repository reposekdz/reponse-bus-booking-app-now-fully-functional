
import React, { useState, useEffect, useCallback } from 'react';
import { BusIcon, MapIcon } from '../components/icons';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import * as api from '../services/apiService';

// Rough coordinates for Rwanda map percentage calculation
const RWANDA_BOUNDS = {
    minLat: -2.8, maxLat: -1.0,
    minLng: 28.8, maxLng: 30.9
};

const mapLatLngToPercentage = (lat: number, lng: number) => {
    const top = 100 - ((lat - RWANDA_BOUNDS.minLat) / (RWANDA_BOUNDS.maxLat - RWANDA_BOUNDS.minLat)) * 100;
    const left = ((lng - RWANDA_BOUNDS.minLng) / (RWANDA_BOUNDS.maxLng - RWANDA_BOUNDS.minLng)) * 100;
    return { top: `${top}%`, left: `${left}%` };
};

// Generate random movement for demo purposes if no real drivers
const simulateMovement = (lat: number, lng: number) => {
    return {
        lat: lat + (Math.random() - 0.5) * 0.01,
        lng: lng + (Math.random() - 0.5) * 0.01
    };
};

const FleetMonitoring: React.FC = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const socket = useSocket();
    const [onRouteBuses, setOnRouteBuses] = useState<any[]>([]);
    const [selectedBus, setSelectedBus] = useState<any>(null);
    const [busLocations, setBusLocations] = useState<{ [driverId: string]: { lat: number; lng: number; speed: number, lastUpdate: string } }>({});
    const [isLoading, setIsLoading] = useState(true);
    
    // Mock initial locations for visualization
    const initialLocations = {
        '4': { lat: -1.9441, lng: 30.0619 }, // Kigali
        '5': { lat: -1.6760, lng: 29.2385 }, // Rubavu
        '6': { lat: -2.6004, lng: 29.7397 }  // Huye
    };

    useEffect(() => {
        const fetchBusesOnRoute = async () => {
            try {
                const allDrivers = await api.companyGetMyDrivers();
                const buses = (await api.companyGetMyBuses()).map(b => {
                    const driver = allDrivers.find(d => d.assigned_bus_id === b.id);
                    return { ...b, driver_id: driver?.id, driver_name: driver?.name, route: 'Kigali - Huye' } // Mock route
                });
                const activeBuses = buses.filter(b => b.status === 'On Route');
                setOnRouteBuses(activeBuses);
                if(activeBuses.length > 0) {
                    setSelectedBus(activeBuses[0]);
                }
                
                // Initialize mock locations for demo
                const initialMap = {};
                activeBuses.forEach(b => {
                    if (b.driver_id) {
                         // Distribute them around map
                         const base = initialLocations[Object.keys(initialLocations)[Math.floor(Math.random() * 3)] as any] || { lat: -1.9441, lng: 30.0619 };
                         initialMap[b.driver_id] = { ...base, speed: 60, lastUpdate: new Date().toISOString() };
                    }
                });
                setBusLocations(prev => ({...prev, ...initialMap}));

            } catch (error) {
                console.error("Failed to fetch fleet data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBusesOnRoute();
    }, []);

    // Simulation Effect (Move buses slightly every 3 seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            setBusLocations(prev => {
                const newLocs = { ...prev };
                Object.keys(newLocs).forEach(key => {
                    const moved = simulateMovement(newLocs[key].lat, newLocs[key].lng);
                    newLocs[key] = { ...newLocs[key], ...moved, speed: Math.floor(Math.random() * 20) + 40, lastUpdate: new Date().toISOString() };
                });
                return newLocs;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (socket && user?.role === 'company') {
            socket.on('fleetLocationUpdate', ({ driverId, location, speed, lastUpdate }) => {
                setBusLocations(prev => ({
                    ...prev,
                    [driverId]: { ...location, speed, lastUpdate }
                }));
            });

            return () => {
                socket.off('fleetLocationUpdate');
            };
        }
    }, [socket, user]);

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">{t('fleet_live_title')}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg h-[600px] flex flex-col">
                    <h2 className="text-xl font-bold dark:text-white mb-4 flex items-center">
                        <MapIcon className="w-6 h-6 mr-2 text-blue-500"/>
                        {t('fleet_bus_locations')}
                    </h2>
                    <div className="flex-grow bg-gray-100 dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center relative overflow-hidden group">
                        {/* Map Background */}
                        <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Rwanda_location_map.svg/1200px-Rwanda_location_map.svg.png" 
                            alt="Map of Rwanda" 
                            className="w-full h-full object-contain opacity-50 dark:opacity-30 grayscale hover:grayscale-0 transition-all duration-500"
                        />
                        
                        {/* Markers */}
                        {onRouteBuses.map(bus => {
                             const location = busLocations[bus.driver_id];
                             if(!location) return null;
                             
                             const { top, left } = mapLatLngToPercentage(location.lat, location.lng);
                             const isSelected = selectedBus?.id === bus.id;

                             return (
                                 <div 
                                     key={bus.id}
                                     onClick={() => setSelectedBus(bus)}
                                     className={`absolute transition-all duration-[3000ms] ease-linear cursor-pointer flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 ${isSelected ? 'z-20 scale-110' : 'z-10'}`}
                                     style={{ top, left }}
                                 >
                                     <div className={`p-2 rounded-full shadow-lg ${isSelected ? 'bg-blue-600 text-white animate-bounce' : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-white'}`}>
                                        <BusIcon className="w-5 h-5" />
                                     </div>
                                     <div className={`mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full shadow-md ${isSelected ? 'bg-blue-600 text-white' : 'bg-white/80 dark:bg-black/80 text-black dark:text-white'}`}>
                                         {bus.plate_number}
                                     </div>
                                 </div>
                             );
                        })}
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold dark:text-white mb-4">{t('fleet_selected_details')}</h2>
                        {selectedBus ? (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center border-b dark:border-gray-700 pb-2">
                                    <span className="text-gray-500 dark:text-gray-400 text-sm">Plate</span>
                                    <span className="font-bold text-xl text-blue-600 dark:text-blue-400">{selectedBus.plate_number}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 dark:text-gray-400 text-sm">{t('fleet_status_on_route')}</span>
                                    <span className="text-sm font-semibold dark:text-white">{selectedBus.route}</span>
                                </div>
                                 <div className="flex justify-between items-center">
                                    <span className="text-gray-500 dark:text-gray-400 text-sm">{t('fleet_driver')}</span>
                                    <span className="text-sm font-semibold dark:text-white">{selectedBus.driver_name}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 dark:text-gray-400 text-sm">{t('live_tracking_status')}</span>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">{selectedBus.status}</span>
                                </div>
                                
                                {busLocations[selectedBus.driver_id] && (
                                    <div className="mt-4 pt-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-gray-500">{t('fleet_speed')}</span>
                                            <span className="font-mono font-bold">{busLocations[selectedBus.driver_id].speed} km/h</span>
                                        </div>
                                         <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">{t('fleet_last_update')}</span>
                                            <span className="font-mono">{new Date(busLocations[selectedBus.driver_id].lastUpdate).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8 italic">Click a bus on the map to see details.</p>
                        )}
                    </div>
                    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg flex-grow">
                        <h2 className="text-xl font-bold dark:text-white mb-4">{t('fleet_all_buses')} <span className="text-sm text-gray-500 font-normal">({onRouteBuses.length})</span></h2>
                        <div className="space-y-3 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                            {onRouteBuses.map(bus => (
                                <button key={bus.id} onClick={() => setSelectedBus(bus)} className={`w-full text-left p-3 rounded-lg border-2 transition-all ${selectedBus?.id === bus.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-transparent bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold dark:text-white text-sm">{bus.plate_number}</p>
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{bus.route}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FleetMonitoring;
