import React, { useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, BusIcon } from './components/icons';

type SeatStatus = 'available' | 'occupied' | 'selected';

const Seat: React.FC<{ status: SeatStatus, id: string, onSelect: (id: string) => void }> = ({ status, id, onSelect }) => {
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

const initialSeats: { id: string; status: SeatStatus }[][] = [
  [{ id: '1A', status: 'occupied' }, { id: '1B', status: 'available' }, { id: 'aisle', status: 'occupied' }, { id: '1C', status: 'available' }, { id: '1D', status: 'available' }],
  [{ id: '2A', status: 'available' }, { id: '2B', status: 'available' }, { id: 'aisle', status: 'occupied' }, { id: '2C', status: 'occupied' }, { id: '2D', status: 'available' }],
  // ... more rows
];

// Generate more rows for a more complete bus
for (let i = 3; i <= 12; i++) {
    initialSeats.push([
        { id: `${i}A`, status: Math.random() > 0.7 ? 'occupied' : 'available' },
        { id: `${i}B`, status: Math.random() > 0.8 ? 'occupied' : 'available' },
        { id: 'aisle', status: 'occupied' },
        { id: `${i}C`, status: Math.random() > 0.6 ? 'occupied' : 'available' },
        { id: `${i}D`, status: Math.random() > 0.75 ? 'occupied' : 'available' }
    ]);
}


interface SeatSelectionPageProps {
  tripData: any;
  onConfirm: (bookingDetails: any) => void;
  onBack: () => void;
  user: any;
}

const SeatSelectionPage: React.FC<SeatSelectionPageProps> = ({ tripData, onConfirm, onBack, user }) => {
  const [seats, setSeats] = useState(initialSeats);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [usePoints, setUsePoints] = useState(false);
  
  const trip = tripData || { price: 4500, company: 'Volcano Express', from: 'Kigali', to: 'Rubavu', departureTime: '07:00' }; // Fallback for direct access

  const handleSelectSeat = (id: string) => {
    setSelectedSeats(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };
  
  const totalPrice = selectedSeats.length * trip.price;
  
  const availablePoints = user?.loyaltyPoints || 0;
  // Assuming 1 point = 1 RWF for discount
  const pointsToUse = Math.min(availablePoints, totalPrice);
  const discount = usePoints ? pointsToUse : 0;
  const finalPrice = totalPrice - discount;

  const handleConfirmClick = () => {
    // In a real app, payment would be handled here. We'll simulate success.
    const bookingDetails = {
      ...trip,
      seats: selectedSeats.join(', '),
      totalPrice: finalPrice,
      pointsUsed: discount,
      pointsEarned: Math.floor(finalPrice / 100), // Points earned on the final price
      bookingId: `GB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      passengerName: user?.name || 'Guest User'
    };
    onConfirm(bookingDetails);
  };

  return (
    <div className="bg-gray-100/50 dark:bg-gray-900/50 min-h-full py-12">
        <div className="container mx-auto px-6">
            <button onClick={onBack} className="flex items-center text-gray-600 dark:text-gray-400 font-semibold mb-6 hover:text-black dark:hover:text-white">
                <ArrowLeftIcon className="w-5 h-5 mr-2" /> Subira inyuma
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <h1 className="text-2xl font-bold dark:text-white mb-6">Hitamo umwanya wawe</h1>
                     <div className="border-2 dark:border-gray-700 rounded-2xl p-4">
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-t-full h-12 w-3/4 mx-auto flex items-center justify-center font-bold text-gray-600 dark:text-gray-400 mb-4">Umushoferi</div>
                        <div className="space-y-3">
                            {seats.map((row, rowIndex) => (
                                <div key={rowIndex} className="flex justify-around">
                                    {row.map(seat => seat.id === 'aisle' 
                                        ? <div key={seat.id} className="w-10 h-10" /> 
                                        : <Seat key={seat.id} id={seat.id} status={selectedSeats.includes(seat.id) ? 'selected' : seat.status} onSelect={handleSelectSeat} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="flex justify-center space-x-6 mt-6">
                        <div className="flex items-center"><div className="w-4 h-4 bg-blue-100 rounded-sm mr-2"></div><span className="text-sm">Uhari</span></div>
                        <div className="flex items-center"><div className="w-4 h-4 bg-gray-300 rounded-sm mr-2"></div><span className="text-sm">Wafashwe</span></div>
                        <div className="flex items-center"><div className="w-4 h-4 bg-yellow-400 rounded-sm mr-2"></div><span className="text-sm">Wahisemo</span></div>
                    </div>
                </div>
                <div className="lg:col-span-1">
                     <div className="sticky top-24 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                         <h2 className="text-xl font-bold dark:text-white mb-4">Summary y'Urugendo</h2>
                         <div className="space-y-3 pb-4">
                             <p><strong>Ikigo:</strong> {trip.company}</p>
                             <p><strong>Imyanya Wahisemo:</strong> {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Ntawahisemo'}</p>
                             <p><strong>Igiciro cy'umwanya:</strong> {new Intl.NumberFormat('fr-RW').format(trip.price)} RWF</p>
                         </div>
                         {availablePoints > 0 && selectedSeats.length > 0 && (
                            <div className="border-t dark:border-gray-700 pt-4 mt-4">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="font-semibold text-sm">Use {pointsToUse} GoPoints</span>
                                    <div className="relative">
                                        <input type="checkbox" checked={usePoints} onChange={() => setUsePoints(!usePoints)} className="sr-only" />
                                        <div className={`block w-10 h-6 rounded-full transition ${usePoints ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${usePoints ? 'transform translate-x-4' : ''}`}></div>
                                    </div>
                                </label>
                                {usePoints && <p className="text-sm text-green-600 font-semibold">- {new Intl.NumberFormat('fr-RW').format(discount)} RWF</p>}
                            </div>
                        )}
                         <div className="mt-4 border-t dark:border-gray-700 pt-4">
                             <p className="text-lg font-bold">Igiciro Cyose:</p>
                             <p className="text-3xl font-extrabold text-green-600 dark:text-green-400">{new Intl.NumberFormat('fr-RW').format(finalPrice)} RWF</p>
                         </div>
                         <button onClick={handleConfirmClick} disabled={selectedSeats.length === 0} className="mt-6 w-full flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#0033A0] font-bold hover:saturate-150 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5">
                            Komeza <ArrowRightIcon className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default SeatSelectionPage;