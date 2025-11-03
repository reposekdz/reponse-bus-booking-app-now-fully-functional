import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowRightIcon, CheckCircleIcon, MapIcon, QrCodeIcon, BusIcon, XIcon, WalletIcon, CreditCardIcon, LockClosedIcon, ShareIcon } from './components/icons';
import LiveTrackingModal from './components/LiveTrackingModal';
import { Page } from './App';

type SeatStatus = 'available' | 'occupied' | 'selected' | 'reserved';

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
    reserved: "bg-gradient-to-b from-purple-300 to-purple-500 border-b-4 border-purple-700 text-purple-900 cursor-not-allowed dark:from-purple-600/50 dark:to-purple-700/50 dark:border-purple-500 dark:text-purple-200",
  };
  
  const tooltipText = {
    available: `Umwanya ${seatNumber}`,
    occupied: 'Uyu mwanya wafashwe',
    selected: `Wahisemo umwanya ${seatNumber}`,
    reserved: 'Urafashwe n\'undi muntu'
  }

  return (
    <button onClick={onClick} disabled={status === 'occupied' || status === 'reserved'} className={`${baseClasses} ${statusClasses[status]}`}>
      <div className="absolute w-full h-full rounded-t-lg preserve-3d group-hover:rotate-y-10 transition-transform duration-300">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20 rounded-t-lg"></div>
        <span className="text-sm font-semibold">{seatNumber}</span>
      </div>
       <div className="absolute bottom-full z-10 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {tooltipText[status]}
      </div>
    </button>
  );
};

const BusLayout: React.FC<{ seats: any[], selectedSeats: string[], reservedSeats: string[], onSeatSelect: (seatId: string) => void }> = ({ seats, selectedSeats, reservedSeats, onSeatSelect }) => (
    <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-3xl border-4 border-gray-300 dark:border-gray-700 shadow-inner">
        <div className="bg-gray-100 dark:bg-gray-900/50 rounded-2xl p-4">
            <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded-t-full mb-8 flex items-center justify-center">
                <div className="w-24 h-10 bg-gray-400 dark:bg-gray-600 rounded-lg text-center font-bold flex items-center justify-center">Umushoferi</div>
            </div>
            <div className="space-y-4">
                {seats.map((row, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="flex justify-center items-center space-x-2">
                        {row.map((seat: any) => {
                             if (seat.isAisle) {
                                return <div key={seat.id} className="w-12"></div>;
                            }
                            let status: SeatStatus = 'available';
                            if (seat.isOccupied) status = 'occupied';
                            else if (reservedSeats.includes(seat.id)) status = 'reserved';
                            else if (selectedSeats.includes(seat.id)) status = 'selected';
                            
                            return <Seat key={seat.id} status={status} seatNumber={seat.id} onClick={() => onSeatSelect(seat.id)} />
                        })}
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const BoardingPass: React.FC<{
    trip: any;
    selection: { selectedSeats: string[], totalPrice: string };
    user: any;
}> = ({ trip, selection, user }) => {
    const ticketId = `VK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    return (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden relative border dark:border-gray-700">
            {/* Header */}
            <div className="bg-blue-600 dark:bg-blue-800 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <BusIcon className="w-6 h-6 text-white"/>
                    <span className="font-bold text-white text-lg">Boarding Pass</span>
                </div>
                <img src={trip.logoUrl || 'https://seeklogo.com/images/V/volcano-express-logo-F735513A51-seeklogo.com.png'} alt={trip.company} className="h-8 object-contain bg-white/20 p-1 rounded-md"/>
            </div>
            
            {/* Main Content */}
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">UVA</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{trip.from || 'Kigali'}</p>
                    </div>
                    <ArrowRightIcon className="w-6 h-6 text-gray-400 dark:text-gray-500 flex-shrink-0 mx-4"/>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">UJYA</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{trip.to || 'Rubavu'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm border-t border-b dark:border-gray-700 py-4 my-4">
                    <div><p className="text-gray-500 dark:text-gray-400">Umugenzi</p><p className="font-semibold dark:text-white">{user.name}</p></div>
                    <div><p className="text-gray-500 dark:text-gray-400">Itariki</p><p className="font-semibold dark:text-white">28 Ukwakira, 2024</p></div>
                    <div><p className="text-gray-500 dark:text-gray-400">Guhaguruka</p><p className="font-semibold dark:text-white">{trip.departureTime}</p></div>
                    <div><p className="text-gray-500 dark:text-gray-400">Imyanya</p><p className="font-bold text-blue-600 dark:text-blue-400 text-base">{selection.selectedSeats.join(', ')}</p></div>
                </div>

                <div className="text-center">
                    <QrCodeIcon className="w-32 h-32 mx-auto text-gray-800 dark:text-gray-200" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-mono">ID y'Itike: {ticketId}</p>
                </div>
            </div>

            {/* Perforated edge */}
             <div className="h-4 bg-gray-50 dark:bg-gray-800 relative">
                <div className="absolute inset-y-0 left-0 w-full h-full flex justify-between">
                    <div className="w-4 h-8 bg-gray-100 dark:bg-gray-900 rounded-r-full -translate-y-1/2"></div>
                    <div className="w-4 h-8 bg-gray-100 dark:bg-gray-900 rounded-l-full -translate-y-1/2"></div>
                </div>
            </div>
        </div>
    );
};


const BookingConfirmationView: React.FC<{
    trip: any;
    selection: { selectedSeats: string[], totalPrice: string };
    user: any;
    transactionDetails: { oldBalance: number; amountPaid: number; } | null;
    newBalance: number;
    onTrack: () => void;
    onShareTicket: () => void;
    onGoToBookings: () => void;
}> = ({ trip, selection, user, transactionDetails, newBalance, onTrack, onShareTicket, onGoToBookings }) => {
    return (
        <div className="text-center max-w-2xl mx-auto py-12 animate-fade-in">
            <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Wishyuye neza!</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 mb-8">Urugendo rwawe rwemejwe. Dore itike yawe:</p>
            
            <BoardingPass trip={trip} selection={selection} user={user} />

            {transactionDetails && (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg mt-8 text-left max-w-md mx-auto border dark:border-gray-700">
                    <h4 className="font-bold mb-2 dark:text-white">Incāmunigo y'Ikoranabuhanga</h4>
                    <div className="text-sm space-y-1">
                        <div className="flex justify-between"><span>Ayariho:</span><span className="font-mono">{new Intl.NumberFormat('fr-RW').format(transactionDetails.oldBalance)} RWF</span></div>
                        <div className="flex justify-between text-red-600 dark:text-red-400"><span>Yishyuwe:</span><span className="font-mono">-{new Intl.NumberFormat('fr-RW').format(transactionDetails.amountPaid)} RWF</span></div>
                        <div className="flex justify-between font-bold border-t pt-1 mt-1 dark:border-gray-600"><span>Asigayeho:</span><span className="font-mono text-green-600 dark:text-green-400">{new Intl.NumberFormat('fr-RW').format(newBalance)} RWF</span></div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <button onClick={onShareTicket} className="w-full flex items-center justify-center p-4 rounded-lg bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg">
                    <ShareIcon className="w-6 h-6 mr-2" /> Sangiza Itike
                </button>
                <button onClick={onTrack} className="w-full flex items-center justify-center p-4 rounded-lg bg-green-600 text-white font-bold text-lg hover:bg-green-700 transition-all duration-300 shadow-lg">
                    <MapIcon className="w-6 h-6 mr-2" /> Kurikirana Bisi
                </button>
                <button onClick={onGoToBookings} className="sm:col-span-2 mt-2 w-full text-center py-3 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                    Jya ku Matike Yanjye
                </button>
            </div>
        </div>
    );
};


const PaymentModal: React.FC<{
    totalPrice: string;
    onClose: () => void;
    onConfirm: (pin: string) => void;
    error: string;
}> = ({ totalPrice, onClose, onConfirm, error }) => {
    const [pin, setPin] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(pin);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold dark:text-white">Emeza Kwishyura</h3>
                        <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><XIcon className="w-5 h-5 text-gray-500"/></button>
                    </div>
                    <div className="text-center py-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Amafaranga yo kwishyura</p>
                        <p className="text-4xl font-bold text-green-600 dark:text-green-400">{totalPrice}</p>
                    </div>
                    <div>
                        <label htmlFor="pin-code" className="text-sm font-medium text-gray-700 dark:text-gray-300">Shyiramo PIN y'ikofi yawe</label>
                        <div className="relative mt-1">
                            <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                            <input 
                                id="pin-code"
                                type="password" 
                                value={pin} 
                                onChange={e => setPin(e.target.value)} 
                                maxLength={4}
                                className="w-full pl-10 p-2 text-center tracking-[1em] border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                required
                            />
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                        Emeza Kwishyura
                    </button>
                </form>
            </div>
        </div>
    );
};

interface SeatSelectionPageProps {
  tripData: any;
  onConfirm: (selection: { tripData: any; selectedSeats: string[]; totalPrice: string; paymentMethod: string }) => void;
  navigate: (page: Page) => void;
  walletData: any;
  user: any;
}

const generateSeats = () => {
    const rows = 12;
    const seats = [];
    const letters = ['A', 'B', 'C', 'D'];
    for (let i = 1; i <= rows; i++) {
        const row = [];
        row.push({ id: `${letters[0]}${i}`, isOccupied: Math.random() > 0.8 });
        row.push({ id: `${letters[1]}${i}`, isOccupied: Math.random() > 0.7 });
        row.push({ id: `aisle-${i}`, isAisle: true });
        row.push({ id: `${letters[2]}${i}`, isOccupied: Math.random() > 0.6 });
        row.push({ id: `${letters[3]}${i}`, isOccupied: Math.random() > 0.85 });
        seats.push(row);
    }
    return seats;
};


const SeatSelectionPage: React.FC<SeatSelectionPageProps> = ({ tripData, onConfirm, navigate, walletData, user }) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [reservedSeats, setReservedSeats] = useState<string[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [transactionDetails, setTransactionDetails] = useState<{ oldBalance: number; amountPaid: number; } | null>(null);
  
  const sessionId = useRef(Date.now().toString(36) + Math.random().toString(36).substring(2));
  const storageKey = `realtime_seats_trip_${tripData.id}`;
  const walletBalance = walletData.balance;
  
  const seats = useMemo(() => generateSeats(), []);
  const pricePerSeat = parseFloat(tripData.price.replace(/[^0-9.-]+/g,""));

  // Real-time seat synchronization logic
  useEffect(() => {
    const updateReservations = () => {
        try {
            const rawData = localStorage.getItem(storageKey);
            if (!rawData) {
                setReservedSeats([]);
                return;
            }
            const allReservations: Record<string, string> = JSON.parse(rawData);
            const otherUsersSeats = Object.entries(allReservations)
                .filter(([seat, id]) => id !== sessionId.current)
                .map(([seat]) => seat);
            setReservedSeats(otherUsersSeats);
        } catch (error) {
            console.error("Failed to parse seat reservations:", error);
            setReservedSeats([]);
        }
    };
    
    updateReservations(); // Initial load

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === storageKey) {
        updateReservations();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [storageKey]);

  useEffect(() => {
      const releaseSeats = () => {
        try {
            const rawData = localStorage.getItem(storageKey);
            if (!rawData) return;
            const allReservations: Record<string, string> = JSON.parse(rawData);
            const newReservations = { ...allReservations };
            
            selectedSeats.forEach(seat => {
                if (newReservations[seat] === sessionId.current) {
                    delete newReservations[seat];
                }
            });
            
            localStorage.setItem(storageKey, JSON.stringify(newReservations));
        } catch (error) {
            console.error("Failed to release seats:", error);
        }
    };

    window.addEventListener('beforeunload', releaseSeats);
    
    return () => {
        releaseSeats();
        window.removeEventListener('beforeunload', releaseSeats);
    };
  }, [selectedSeats, storageKey]);


  const handleSeatSelect = (seatId: string) => {
    const isAlreadySelected = selectedSeats.includes(seatId);
    const newSelectedSeats = isAlreadySelected
      ? selectedSeats.filter(s => s !== seatId)
      : [...selectedSeats, seatId];
      
    setSelectedSeats(newSelectedSeats);

    // Update localStorage
    try {
        const rawData = localStorage.getItem(storageKey);
        const allReservations: Record<string, string> = rawData ? JSON.parse(rawData) : {};
        
        // Remove old selection for this session if it exists
        if (isAlreadySelected) {
            delete allReservations[seatId];
        } else {
            // Add new selection
            allReservations[seatId] = sessionId.current;
        }

        localStorage.setItem(storageKey, JSON.stringify(allReservations));

        // Manually trigger an update for the current tab
        const otherUsersSeats = Object.entries(allReservations)
            .filter(([seat, id]) => id !== sessionId.current)
            .map(([seat]) => seat);
        setReservedSeats(otherUsersSeats);
    } catch (error) {
        console.error("Failed to update seat reservations:", error);
    }
  };

  const totalPrice = selectedSeats.length * pricePerSeat;
  const formattedTotalPrice = new Intl.NumberFormat('fr-RW', { style: 'currency', currency: 'RWF' }).format(totalPrice);
  const isWalletSufficient = walletBalance >= totalPrice;
  
  const handleConfirmClick = () => {
    if (paymentMethod === 'wallet') {
        if (!isWalletSufficient) {
            alert("Amafaranga ari mu ikofi ntahagije.");
            return;
        }
        setPaymentError('');
        setIsPaymentModalOpen(true);
    } else {
        alert("Kwishyura n'ikarita/MoMo bizaza vuba!");
    }
  };
  
  const handlePaymentConfirm = (pin: string) => {
    if (pin !== walletData.walletPin) {
        setPaymentError('PIN watanze siyo. Ongera ugerageze.');
        return;
    }
    
    setTransactionDetails({ oldBalance: walletData.balance, amountPaid: totalPrice });
    onConfirm({ tripData, selectedSeats, totalPrice: formattedTotalPrice, paymentMethod });
    
    setIsPaymentModalOpen(false);

    setTimeout(() => {
        setIsConfirmed(true);
        window.scrollTo(0, 0);
        try {
            const rawData = localStorage.getItem(storageKey);
            if (!rawData) return;
            const allReservations: Record<string, string> = JSON.parse(rawData);
            selectedSeats.forEach(seat => delete allReservations[seat]);
            localStorage.setItem(storageKey, JSON.stringify(allReservations));
        } catch (e) { console.error(e) }

    }, 500);
  };

  const finalSelection = { selectedSeats, totalPrice: formattedTotalPrice };


  return (
    <div className="bg-white dark:bg-gray-900 min-h-full py-12">
      <div className="container mx-auto px-6">
         {isConfirmed ? (
            <BookingConfirmationView 
                trip={tripData}
                selection={finalSelection}
                user={user}
                transactionDetails={transactionDetails}
                newBalance={walletData.balance - (transactionDetails?.amountPaid || 0)}
                onTrack={() => setShowTrackingModal(true)}
                onShareTicket={() => alert('Sharing ticket...')}
                onGoToBookings={() => navigate('bookings')}
            />
        ) : (
            <>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Hitamo Imyanya Yawe</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Kanda ku mwanya ushaka gufata cyangwa kuwukuramo.</p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <BusLayout seats={seats} selectedSeats={selectedSeats} reservedSeats={reservedSeats} onSeatSelect={handleSeatSelect} />
                    <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-2 mt-6 text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-md bg-green-400 border border-green-600"></div><span>Ihari</span></div>
                        <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-md bg-yellow-400 border border-yellow-600"></div><span>Iyahiswemo</span></div>
                        <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-md bg-purple-400 border border-purple-600"></div><span>Ifashwe n'undi</span></div>
                        <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-md bg-gray-400 border border-gray-600"></div><span>Yafashwe</span></div>
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-24">
                        <h2 className="text-2xl font-bold border-b dark:border-gray-700 pb-4 mb-4">Incāmunigo y'Itike</h2>
                        <div className="space-y-3 mb-4 text-sm">
                            <p><strong>Urugendo:</strong> {tripData.from || 'Kigali'} <ArrowRightIcon className="w-4 h-4 inline-block mx-1" /> {tripData.to || 'Rubavu'}</p>
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
                            
                            <div className="border-t dark:border-gray-700 pt-4">
                                <h3 className="font-semibold mb-2">Uburyo bwo Kwishyura</h3>
                                <div className="space-y-3">
                                    <label className={`flex items-center p-3 rounded-lg border-2 transition-all ${paymentMethod === 'wallet' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'} ${totalPrice > 0 && !isWalletSufficient ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                        <input type="radio" name="payment" value="wallet" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} disabled={totalPrice > 0 && !isWalletSufficient} className="h-4 w-4 text-blue-600 focus:ring-blue-500"/>
                                        <WalletIcon className="w-6 h-6 mx-3 text-blue-600"/>
                                        <div className="flex-grow">
                                            <p className="font-semibold dark:text-gray-200">Ikofi</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Asigaye: {new Intl.NumberFormat('fr-RW').format(walletBalance)} RWF</p>
                                        </div>
                                    </label>
                                     {totalPrice > 0 && !isWalletSufficient && paymentMethod === 'wallet' && <p className="text-xs text-red-500">Amafaranga ari mu ikofi ntahagije.</p>}

                                    <label className={`flex items-center p-3 rounded-lg border-2 transition-all cursor-pointer ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}`}>
                                        <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="h-4 w-4 text-blue-600 focus:ring-blue-500"/>
                                        <CreditCardIcon className="w-6 h-6 mx-3 text-gray-600 dark:text-gray-400"/>
                                        <p className="font-semibold dark:text-gray-200">Ikarita / MoMo</p>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-gray-800 dark:text-white mt-6">
                                <span className="text-xl font-medium">Yose Hamwe:</span>
                                <span className="text-3xl font-bold text-green-600 dark:text-green-400">{formattedTotalPrice}</span>
                            </div>
                        </div>
                        <button 
                        onClick={handleConfirmClick}
                        disabled={selectedSeats.length === 0}
                        className="mt-6 w-full flex items-center justify-center p-4 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#0033A0] font-bold text-lg hover:from-yellow-500 hover:to-yellow-600 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                        Emeza Itike
                        </button>
                    </div>
                </div>
                </div>
            </>
        )}
      </div>
       {isPaymentModalOpen && (
        <PaymentModal 
            totalPrice={formattedTotalPrice}
            onClose={() => setIsPaymentModalOpen(false)}
            onConfirm={handlePaymentConfirm}
            error={paymentError}
        />
      )}
      {showTrackingModal && <LiveTrackingModal trip={{...tripData, route: `${tripData.from || 'Kigali'} - ${tripData.to || 'Rubavu'}`}} onClose={() => setShowTrackingModal(false)} />}
    </div>
  );
};

export default SeatSelectionPage;