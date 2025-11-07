import React from 'react';
import { XIcon, BusIcon } from './icons';

// Simple hash function to generate a "unique" pattern from a string
const simpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

const QRCode: React.FC<{ value: string; size: number, isActive: boolean }> = ({ value, size, isActive }) => {
  const hash = simpleHash(value);
  const gridSize = 15; // QR codes are grids

  return (
    <div className={`p-2 bg-white rounded-lg ${isActive ? 'activated-ticket-glow' : ''}`} style={{ width: size, height: size }}>
      <div className="grid grid-cols-15 w-full h-full">
        {Array.from({ length: gridSize * gridSize }).map((_, i) => {
          const bit = (hash >> (i % 31)) & 1;
          return (
            <div
              key={i}
              className={`w-full h-full ${bit === 1 ? 'bg-black' : 'bg-white'}`}
            ></div>
          );
        })}
      </div>
       <style>{`.grid-cols-15 { grid-template-columns: repeat(15, minmax(0, 1fr)); }`}</style>
    </div>
  );
};


const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="py-3 border-b border-dashed border-gray-300 dark:border-gray-600">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">{label}</p>
        <p className="font-bold text-gray-800 dark:text-white text-lg">{value}</p>
    </div>
);

const TicketModal: React.FC<{ ticket: any; onClose: () => void, isActive?: boolean }> = ({ ticket, onClose, isActive = false }) => {
  if (!ticket) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm transform transition-transform duration-300 scale-95 animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <header className="bg-gradient-to-r from-blue-600 to-green-500 p-6 rounded-t-2xl text-white relative">
            <button onClick={onClose} className="absolute top-3 right-3 p-1 rounded-full bg-white/20 hover:bg-white/40 transition-colors">
                <XIcon className="w-5 h-5"/>
            </button>
            <div className="flex items-center space-x-3">
                 <BusIcon className="w-8 h-8"/>
                 <h2 className="text-2xl font-bold">Boarding Pass</h2>
            </div>
            <p className="text-sm opacity-80 mt-1">{ticket.company}</p>
        </header>

        <main className="p-6">
            <div className="flex items-center justify-center mb-4">
                <QRCode value={ticket.id} size={180} isActive={isActive} />
            </div>
             {isActive ? (
                <p className="text-center font-bold text-lg text-green-500 animate-pulse mb-4">TICKET ACTIVATED</p>
            ) : (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">Present this code for scanning at the terminal.</p>
            )}
            
            <div className="space-y-2">
                <InfoRow label="Passenger" value={ticket.passenger} />
                <InfoRow label="Route" value={`${ticket.from} to ${ticket.to}`} />
                <InfoRow label="Date & Time" value={`${ticket.date} at ${ticket.time}`} />
                <div className="flex pt-3">
                    <div className="w-1/2 pr-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Seats</p>
                        <p className="font-bold text-gray-800 dark:text-white text-lg">{ticket.seats}</p>
                    </div>
                     <div className="w-1/2 pl-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Bus Plate</p>
                        <p className="font-bold text-gray-800 dark:text-white text-lg">{ticket.busPlate}</p>
                    </div>
                </div>
            </div>
        </main>
        
        <footer className="p-4 bg-gray-100 dark:bg-gray-900 rounded-b-2xl">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">Ticket ID: {ticket.id}</p>
        </footer>
      </div>
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TicketModal;