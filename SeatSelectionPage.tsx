import React, { useState, useMemo } from 'react';
// FIX: Import ArrowRightIcon
import { ArrowRightIcon } from './components/icons';

type SeatStatus = 'available' | 'occupied' | 'selected';

interface SeatProps {
  status: SeatStatus;
  seatNumber: string;
  onClick: () => void;
}

const Seat: React.FC<SeatProps> = ({ status, seatNumber, onClick }) => {
  const baseClasses = "relative group w-12 h-14 flex items-center justify-center rounded-t-lg transition-all duration-200 cursor-pointer perspective";
  
  const statusClasses = {
    available: "bg-gradient-to-b from-green-300 to-green-500 border-b-4 border-green-700 text-green-900 hover:from-green-400 dark:from-green-600/50 dark:to-green-700/50 dark:border-green-500 dark:text-green-200 dark:hover:from-green-600",
    occupied: "bg-gradient-to-b from-gray-300 to-gray-400 border-b-4 border-gray-600 text-gray-600 cursor-not-allowed dark:from-gray-700 dark:to-gray-800 dark:border-gray-900 dark:text-gray-500",
    selected: "bg-gradient-to-b from-yellow-300 to-yellow-500 border-b-4 border-yellow-700 text-white font-bold transform scale-110 shadow-lg",
  };

  return (
    <button onClick={onClick} disabled={status === 'occupied'} className={`${baseClasses} ${statusClasses[status]}`}>
      {/* Seat back */}
      <div className="absolute w-full h-full rounded-t-lg preserve-3d group-hover:rotate-y-10 transition-transform duration-300">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20 rounded-t-lg"></div>
        {/* Seat number display */}
        <span className="text-sm font-semibold">{seatNumber}</span>
      </div>
       {/* Tooltip */}
       <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Umwanya {seatNumber}
      </div>
    </button>
  );
};

const BusLayout: React.FC<{ seats: any[], selectedSeats: string[], onSeatSelect: (seatId: string) => void }> = ({ seats, selectedSeats, onSeatSelect }) => (
    <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-3xl border-4 border-gray-300 dark:border-gray-700 shadow-inner">
        <div className="bg-gray-100 dark:bg-gray-900/50 rounded-2xl p-4">
            {/* Bus front */}
            <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded-t-full mb-8 flex items-center justify-center">
                <div className="w-24 h-10 bg-gray-400 dark:bg-gray-600 rounded-lg text-center font-bold flex items-center justify-center">Umushoferi</div>
            </div>
            {/* Seats */}
            <div className="space-y-4">
                {seats.map((row, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="flex justify-center items-center space-x-2">
                        {row.map((seat: any) => {
                             if (seat.isAisle) {
                                return <div key={seat.id} className="w-12"></div>;
                            }
                            let status: SeatStatus = seat.isOccupied ? 'occupied' : 'available';
                            if (selectedSeats.includes(seat.id)) {
                                status = 'selected';
                            }
                            return <Seat key={seat.id} status={status} seatNumber={seat.id} onClick={() => onSeatSelect(seat.id)} />
                        })}
                    </div>
                ))}
            </div>
        </div>
    </div>
);


interface SeatSelectionPageProps {
  tripData: any;
  onConfirm: (selection: { tripData: any; selectedSeats: string[]; totalPrice: string }) => void;
}

// Generates a more realistic 2-aisle-2 seat layout
const generateSeats = () => {
    const rows = 12;
    const seats = [];
    const letters = ['A', 'B', 'C', 'D'];
    for (let i = 1; i <= rows; i++) {
        const row = [];
        // Left side
        row.push({ id: `${letters[0]}${i}`, isOccupied: Math.random() > 0.8 });
        row.push({ id: `${letters[1]}${i}`, isOccupied: Math.random() > 0.7 });
        // Aisle
        row.push({ id: `aisle-${i}`, isAisle: true });
        // Right side
        row.push({ id: `${letters[2]}${i}`, isOccupied: Math.random() > 0.6 });
        row.push({ id: `${letters[3]}${i}`, isOccupied: Math.random() > 0.85 });
        seats.push(row);
    }
    return seats;
};


const SeatSelectionPage: React.FC<SeatSelectionPageProps> = ({ tripData, onConfirm }) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const seats = useMemo(() => generateSeats(), []);
  const pricePerSeat = parseFloat(tripData.price.replace(/[^0-9.-]+/g,""));

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeats(prev => 
      prev.includes(seatId) 
      ? prev.filter(s => s !== seatId) 
      : [...prev, seatId]
    );
  };

  const totalPrice = selectedSeats.length * pricePerSeat;
  const formattedTotalPrice = new Intl.NumberFormat('fr-RW', { style: 'currency', currency: 'RWF' }).format(totalPrice);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-full py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Hitamo Imyanya Yawe</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Kanda ku mwanya ushaka gufata cyangwa kuwukuramo.</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BusLayout seats={seats} selectedSeats={selectedSeats} onSeatSelect={handleSeatSelect} />
            <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-2 mt-6 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-md bg-green-400 border border-green-600"></div><span>Ihari</span></div>
                <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-md bg-yellow-400 border border-yellow-600"></div><span>Iyahiswemo</span></div>
                <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-md bg-gray-400 border border-gray-600"></div><span>Yafashwe</span></div>
            </div>
          </div>
          <div className="lg:col-span-1">
             <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold border-b dark:border-gray-700 pb-4 mb-4">Incāmunigo y'Itike</h2>
                <div className="space-y-3 mb-4 text-sm">
                    <p><strong>Urugendo:</strong> Kigali <ArrowRightIcon className="w-4 h-4 inline-block mx-1" /> Rubavu</p>
                    <p><strong>Ikigo:</strong> <span className="font-semibold text-blue-600 dark:text-blue-400">{tripData.company}</span></p>
                    <p><strong>Itariki:</strong> 28 Ukwakira, 2024</p>
                    <p><strong>Igihe:</strong> {tripData.departureTime} - {tripData.arrivalTime}</p>
                </div>
                <div className="border-t dark:border-gray-700 pt-4">
                    <h3 className="font-semibold mb-2">Imyanya Wahisemo ({selectedSeats.length})</h3>
                    <div className="h-24 overflow-y-auto mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border dark:border-gray-600">
                        {selectedSeats.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {selectedSeats.map(seat => <span key={seat} className="bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">{seat}</span>)}
                            </div>
                        ) : <p className="text-gray-500 dark:text-gray-400 text-sm">Nta mwanya wahisemo</p>}
                    </div>
                    <div className="flex justify-between items-center text-gray-800 dark:text-white mt-6">
                        <span className="text-xl font-medium">Yose Hamwe:</span>
                        <span className="text-3xl font-bold text-green-600 dark:text-green-400">{formattedTotalPrice}</span>
                    </div>
                </div>
                <button 
                  onClick={() => onConfirm({ tripData, selectedSeats, totalPrice: formattedTotalPrice })}
                  disabled={selectedSeats.length === 0}
                  className="mt-6 w-full flex items-center justify-center p-4 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#0033A0] font-bold text-lg hover:from-yellow-500 hover:to-yellow-600 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                  Emeza Itike
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;