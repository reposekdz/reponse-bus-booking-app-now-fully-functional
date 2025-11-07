import React, { useState } from 'react';
import { BusIcon } from '../components/icons';

const mockBuses = [
    { id: 'b1', plate: 'RAD 123 B', model: 'Yutong Explorer', driver: 'John Doe', status: 'On Route', maintenanceDate: '2024-12-15', route: 'Kigali - Rubavu', progress: 75 },
    { id: 'b2', plate: 'RAE 789 A', model: 'Coaster', driver: 'Mary Anne', status: 'On Route', maintenanceDate: '2024-11-30', route: 'Kigali - Huye', progress: 40 },
    { id: 'b3', plate: 'RAG 246 D', model: 'Yutong Explorer', driver: 'Peter Pan', status: 'Idle', maintenanceDate: '2025-01-20', route: 'N/A', progress: 0 },
];

const FleetMonitoring: React.FC = () => {
    const onRouteBuses = mockBuses.filter(b => b.status === 'On Route');
    const [selectedBus, setSelectedBus] = useState<any>(onRouteBuses[0] || null);

    return (
        <div>
            <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">Live Fleet Monitoring</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg h-[600px] flex flex-col">
                    <h2 className="text-xl font-bold dark:text-white mb-4">Bus Locations</h2>
                    <div className="flex-grow bg-gray-200 dark:bg-gray-700/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <img src="https://www.researchgate.net/publication/322968537/figure/fig1/AS:631631525920800@1527604113101/Administrative-map-of-Rwanda-showing-the-four-provinces-and-the-capital-city-Kigali.png" alt="Map of Rwanda" className="w-full h-full object-contain opacity-20 dark:opacity-10"/>
                        
                        <button onClick={() => setSelectedBus(mockBuses[0])} className="absolute text-blue-500 animate-bus-path-1">
                             <BusIcon className="w-7 h-7" />
                        </button>
                        <button onClick={() => setSelectedBus(mockBuses[1])} className="absolute text-green-500 animate-bus-path-2">
                             <BusIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold dark:text-white mb-4">Selected Bus Details</h2>
                        {selectedBus ? (
                            <div className="space-y-3">
                                <p className="font-bold text-2xl text-blue-600 dark:text-blue-400">{selectedBus.plate}</p>
                                <p><span className="font-semibold">Route:</span> {selectedBus.route}</p>
                                <p><span className="font-semibold">Driver:</span> {selectedBus.driver}</p>
                                <p><span className="font-semibold">Status:</span> <span className="text-green-500">{selectedBus.status}</span></p>
                                <div>
                                    <label className="text-xs font-semibold">Progress</label>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                                        <div className="bg-green-600 h-2.5 rounded-full" style={{width: `${selectedBus.progress}%`}}></div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">Click a bus on the map to see details.</p>
                        )}
                    </div>
                    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold dark:text-white mb-4">All Buses On Route ({onRouteBuses.length})</h2>
                        <div className="space-y-3 h-[260px] overflow-y-auto custom-scrollbar">
                            {onRouteBuses.map(bus => (
                                <button key={bus.id} onClick={() => setSelectedBus(bus)} className={`w-full text-left bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border-2 ${selectedBus?.id === bus.id ? 'border-blue-500' : 'border-transparent'}`}>
                                    <p className="font-bold dark:text-white">{bus.plate}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{bus.route}</p>
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