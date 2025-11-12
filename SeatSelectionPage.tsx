import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from './components/icons';
import * as api from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

type SeatStatus = 'available' | 'occupied' | 'selected';

const Seat: React.FC<{ status: SeatStatus; id: string; onSelect: (id: string) => void; }> = ({ status, id, onSelect }) => {
  const isSelectable = status === 'available' || status === 'selected';
  
  let seatClass = 'w-10 h-10 rounded-md flex items-center justify-center font-bold text-xs cursor-pointer transition-all duration-200';
  if (status === 'available') {
    seatClass += ' bg-blue-100 text-blue-800 hover:bg-blue-200 border-2 border-blue-200';
  } else if (status === 'occupied') {
    seatClass += ' bg-gray-300 text-gray-500 cursor-not-allowed';
  } else if (status === 'selected') {
    seatClass += ' bg-yellow-400 text-blue-900 ring-2 ring-yellow-500 animate-pop-in';
  }

  return <button onClick={() => isSelectable && onSelect(id)} className={seatClass} disabled={!isSelectable}>{id}</button>;
};

const generateSeatGrid = (seatMap: Map<string, string>, capacity: number) => {
    const grid: any[][] = [];
    const seats = Array.from(seatMap.keys()).sort((a,b) => parseInt(a.slice(0, -1)) - parseInt(b.slice(0, -1)) || a.charCodeAt(a.length - 1) - b.charCodeAt(b.length - 1));
    
    let row: any[] = [];
    let currentRowNum = "1";
    seats.forEach(seatId => {
        const rowNum = seatId.slice(0, -1);
        if (rowNum !== currentRowNum) {
            grid.push(row);
            row = [];
            currentRowNum = rowNum;
        }
        
        // Add aisle placeholder
        if(seatId.endsWith('C') && !row.some(s => s.id === 'aisle')) {
            row.push({id: 'aisle'});
        }

        row.push({
            id: seatId,
            status: seatMap[seatId],
        });
    });
    grid.push(row); // push the last row
    return grid;
}

interface SeatSelectionPageProps {
  tripId: string;
  onConfirm: (bookingDetails: any) => void;
  onBack: () => void;
}

const SeatSelectionPage: React.FC<SeatSelectionPageProps> = ({ tripId, onConfirm, onBack }) => {
  const [trip, setTrip] = useState<any>(null);
  const [seatGrid, setSeatGrid] = useState<any[][]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchTrip = async () => {
        setIsLoading(true);
        try {
            const tripData = await api.getTripDetails(tripId);
            setTrip(tripData);
            const grid = generateSeatGrid(tripData.seatMap, tripData.bus.capacity);
            setSeatGrid(grid);
        } catch (err) {
            setError(err.message || "Failed to load trip details.");
        } finally {
            setIsLoading(false);
        }
    };
    fetchTrip();
  }, [tripId]);
  
  const handleSelectSeat = (id: string) => {
    setSelectedSeats(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };
  
  const totalPrice = selectedSeats.length * (trip?.route.basePrice || 0);

  const handleConfirmClick = () => {
    const bookingDetails = {
      tripId: trip._id,
      seats: selectedSeats,
      totalPrice,
      from: trip.route.from,
      to: trip.route.to,
      company: trip.route.company.name,
      departureTime: new Date(trip.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      passengerName: user?.name,
    };
    onConfirm(bookingDetails);
  };

  if (isLoading) return <div className="p-8 text-center dark:text-white">Loading Seat Map...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="bg-gray-100/50 dark:bg-gray-900/50 min-h-full py-12">
        <div className="container mx-auto px-6">
            <button onClick={onBack} className="flex items-center text-gray-600 dark:text-gray-400 font-semibold mb-6 hover:text-black dark:hover:text-white">
                <ArrowLeftIcon className="w-5 h-5 mr-2" /> Back to results
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <h1 className="text-2xl font-bold dark:text-white mb-6">Select Your Seat</h1>
                     <div className="border-2 dark:border-gray-700 rounded-2xl p-4">
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-t-full h-12 w-3/4 mx-auto flex items-center justify-center font-bold text-gray-600 dark:text-gray-400 mb-4">Driver</div>
                        <div className="space-y-3">
                            {seatGrid.map((row, rowIndex) => (
                                <div key={rowIndex} className="flex justify-around">
                                    {row.map(seat => seat.id === 'aisle' 
                                        ? <div key={`aisle-${rowIndex}`} className="w-10 h-10" /> 
                                        : <Seat key={seat.id} id={seat.id} status={selectedSeats.includes(seat.id) ? 'selected' : seat.status} onSelect={handleSelectSeat} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="flex justify-center space-x-6 mt-6">
                        <div className="flex items-center"><div className="w-4 h-4 bg-blue-100 rounded-sm mr-2"></div><span className="text-sm dark:text-gray-300">Available</span></div>
                        <div className="flex items-center"><div className="w-4 h-4 bg-gray-300 rounded-sm mr-2"></div><span className="text-sm dark:text-gray-300">Occupied</span></div>
                        <div className="flex items-center"><div className="w-4 h-4 bg-yellow-400 rounded-sm mr-2"></div><span className="text-sm dark:text-gray-300">Selected</span></div>
                    </div>
                </div>
                <div className="lg:col-span-1">
                     <div className="sticky top-24 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                         <h2 className="text-xl font-bold dark:text-white mb-4">Trip Summary</h2>
                         <div className="space-y-3 pb-4">
                             <p className="dark:text-gray-300"><strong>Company:</strong> {trip.route.company.name}</p>
                             <p className="dark:text-gray-300"><strong>Seats:</strong> {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</p>
                             <p className="dark:text-gray-300"><strong>Price per seat:</strong> {new Intl.NumberFormat('fr-RW').format(trip.route.basePrice)} RWF</p>
                         </div>
                         <div className="mt-4 border-t dark:border-gray-700 pt-4">
                             <p className="text-lg font-bold dark:text-gray-200">Total Price:</p>
                             <p className="text-3xl font-extrabold text-green-600 dark:text-green-400">{new Intl.NumberFormat('fr-RW').format(totalPrice)} RWF</p>
                         </div>
                         <button onClick={handleConfirmClick} disabled={selectedSeats.length === 0} className="mt-6 w-full flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#0033A0] font-bold hover:saturate-150 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5">
                            Proceed to Payment <ArrowRightIcon className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default SeatSelectionPage;
