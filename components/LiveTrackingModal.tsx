
import React, { useEffect, useState } from 'react';
import { XIcon, BusIcon, MapIcon, ClockIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useSocket } from '../contexts/SocketContext';

interface LiveTrackingModalProps {
  onClose: () => void;
  tripId?: string; // Pass tripId to listen for specific updates
}

const LiveTrackingModal: React.FC<LiveTrackingModalProps> = ({ onClose, tripId }) => {
  const { t } = useLanguage();
  const socket = useSocket();
  const [eta, setEta] = useState('45 min');
  const [status, setStatus] = useState('On Time');
  const [busPosition, setBusPosition] = useState({ top: '50%', left: '50%' });
  const [speed, setSpeed] = useState(60);

  useEffect(() => {
      // Simulate movement if no real data
      const interval = setInterval(() => {
          setBusPosition(prev => {
              const currentLeft = parseFloat(prev.left);
              // Oscillate left/right to simulate movement
              const newLeft = currentLeft + (Math.random() > 0.5 ? 1 : -1);
              return { ...prev, left: `${Math.min(Math.max(newLeft, 20), 80)}%` };
          });
          setSpeed(Math.floor(Math.random() * 10) + 55);
      }, 2000);

      if (socket && tripId) {
          socket.emit('joinTripRoom', tripId);
          socket.on('tripLocationUpdate', (data) => {
              setSpeed(data.speed);
              // In a real app, mapping lat/lng to the image percentage would happen here
              setEta('Updated just now');
          });
          socket.on('tripStatusUpdate', (data) => {
              setStatus(data.status);
          });
      }

      return () => {
          clearInterval(interval);
          if (socket && tripId) {
             socket.off('tripLocationUpdate');
             socket.off('tripStatusUpdate');
             socket.emit('leaveTripRoom', tripId);
          }
      };
  }, [socket, tripId]);

  return (
    <div className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full h-[70vh] flex flex-col relative overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between flex-shrink-0 z-10">
          <h2 className="text-lg font-bold flex items-center">
            <MapIcon className="w-5 h-5 mr-2" />
            {t('live_tracking_modal_title')}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <XIcon className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-grow bg-gray-200 dark:bg-gray-900 relative group">
          {/* Map Image */}
          <img 
             src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Rwanda_location_map.svg/1200px-Rwanda_location_map.svg.png" 
             alt="Map" 
             className="w-full h-full object-cover opacity-40 grayscale"
          />
          
          {/* Route Line Simulation */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path d="M 200 400 Q 400 300 600 200" stroke="#3b82f6" strokeWidth="4" fill="none" strokeDasharray="10 5" className="animate-pulse"/>
          </svg>

          {/* Bus Marker */}
          <div 
            className="absolute transition-all duration-[2000ms] ease-in-out flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2"
            style={busPosition}
          >
             <div className="relative">
                <div className="w-12 h-12 bg-blue-600/30 rounded-full absolute -top-1 -left-1 animate-ping"></div>
                <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-xl flex items-center justify-center border-2 border-blue-600 z-10 relative">
                    <BusIcon className="w-6 h-6 text-blue-600" />
                </div>
             </div>
             <div className="mt-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">
                 RAD 123 B
             </div>
          </div>
        </main>

        <footer className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex-shrink-0">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-bold text-lg dark:text-white">Kigali <span className="text-gray-400 font-normal">to</span> Rubavu</p>
                    <div className="flex items-center space-x-3 mt-1">
                         <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                             <span className={`w-2 h-2 rounded-full mr-2 ${status === 'On Time' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                             {status}
                         </p>
                         <p className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">{speed} km/h</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{t('live_tracking_eta')}</p>
                    <p className="font-bold text-2xl text-blue-600 flex items-center justify-end">
                        <ClockIcon className="w-5 h-5 mr-2" />
                        {eta}
                    </p>
                </div>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default LiveTrackingModal;
