
import React from 'react';
import { BusIcon } from '../components/icons';

const FleetMonitoring: React.FC<{ buses: any[] }> = ({ buses }) => {
    const onRouteBuses = buses.filter(b => b.status === 'On Route');

    return (
        <div>
            <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">Live Fleet Monitoring</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg h-[600px] flex flex-col">
                    <h2 className="text-xl font-bold dark:text-white mb-4">Bus Locations</h2>
                    <div className="flex-grow bg-gray-200 dark:bg-gray-700/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <img src="https://www.africa-expert.com/wp-content/uploads/2018/12/kigali-city-rwanda.jpg" alt="Map of Kigali" className="w-full h-full object-cover opacity-20" />
                        <p className="text-gray-500 z-10">Live Map View Coming Soon</p>
                        {/* Mock bus icons */}
                        <div className="absolute top-[20%] left-[30%] text-blue-500"><BusIcon className="w-8 h-8"/></div>
                        <div className="absolute top-[50%] left-[60%] text-blue-500"><BusIcon className="w-8 h-8"/></div>
                        <div className="absolute top-[70%] left-[45%] text-blue-500"><BusIcon className="w-8 h-8"/></div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold dark:text-white mb-4">Buses On Route ({onRouteBuses.length})</h2>
                    <div className="space-y-3 h-[520px] overflow-y-auto custom-scrollbar">
                        {onRouteBuses.map(bus => (
                            <div key={bus.id} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                <p className="font-bold dark:text-white">{bus.plate}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{bus.model}</p>
                                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-600">
                                  <div className="bg-green-600 h-1.5 rounded-full" style={{width: `${Math.random() * 80 + 10}%`}}></div>
                                </div>
                                <p className="text-xs text-right text-gray-400 mt-1">On Time</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FleetMonitoring;
