import React, { useState, useEffect } from 'react';
import { TicketIcon, ChevronRightIcon, QrCodeIcon, ArrowPathIcon, ShareIcon, BellAlertIcon, StarIcon, CheckCircleIcon } from './components/icons';
import Modal from './components/Modal';
import StarRating from './components/StarRating';

const upcomingBookings = [
    { id: 'TICKET-001', from: 'Kigali', to: 'Rubavu', company: 'Volcano Express', date: new Date(new Date().getTime() + 12 * 3600 * 1000).toISOString().split('T')[0], time: '07:00 AM', seats: 'A5, A6', price: '9,000 FRW', passenger: 'Kalisa Jean', busPlate: 'RAD 123 B' },
    { id: 'TICKET-002', from: 'Huye', to: 'Kigali', company: 'RITCO', date: new Date(new Date().getTime() + 3 * 24 * 3600 * 1000).toISOString().split('T')[0], time: '02:30 PM', seats: 'C1', price: '3,000 FRW', passenger: 'Kalisa Jean', busPlate: 'RAF 456 C' },
];

const pastBookings = [
    { id: 'TICKET-003', from: 'Kigali', to: 'Musanze', company: 'Horizon Express', date: '15 Ukwakira, 2024', time: '09:00 AM', seats: 'D3', price: '3,500 FRW', passenger: 'Kalisa Jean', busPlate: 'RAE 789 A' },
];

type Booking = typeof upcomingBookings[0];

const RateTripModal: React.FC<{ booking: Booking, onClose: () => void, onSubmit: (rating: number, comment: string) => void }> = ({ booking, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        onSubmit(rating, comment);
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={`Rate Your Trip to ${booking.to}`}>
            <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">How was your journey with {booking.company} on {booking.date}?</p>
                <div className="flex justify-center py-2">
                    <StarRating rating={rating} onRatingChange={setRating} isInteractive={true} size="large" />
                </div>
                <div>
                    <label className="text-sm font-medium">Comments (optional)</label>
                    <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700" placeholder="Tell us more..."/>
                </div>
                <div className="flex justify-end pt-2">
                    <button onClick={handleSubmit} disabled={rating === 0} className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                        Submit Rating
                    </button>
                </div>
            </div>
        </Modal>
    );
};


interface BookingCardProps {
    booking: Booking;
    onViewTicket: (booking: Booking, isActive: boolean) => void;
    onRateTrip: (booking: Booking) => void;
    onSetPriceAlert: (booking: Booking) => void;
    onCheckIn: (ticketId: string) => void;
    isPast: boolean;
    isCheckedIn: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onViewTicket, onRateTrip, onSetPriceAlert, onCheckIn, isPast, isCheckedIn }) => {
    const isCheckinAvailable = !isPast && !isCheckedIn && (new Date(booking.date).getTime() - new Date().getTime()) < (24 * 3600 * 1000);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden my-4 transform hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row">
                <div className="p-5 flex-grow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{booking.company}</p>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{booking.from} to {booking.to}</h3>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg text-green-600 dark:text-green-400">{booking.price}</p>
                            <p className="text-xs text-gray-500">{booking.id}</p>
                        </div>
                    </div>
                    <div className="border-t dark:border-gray-700 mt-3 pt-3 flex space-x-6 text-sm">
                        <div><p className="text-xs text-gray-500">Itariki</p><p className="font-semibold dark:text-gray-200">{new Date(booking.date).toLocaleDateString()}</p></div>
                        <div><p className="text-xs text-gray-500">Isaha</p><p className="font-semibold dark:text-gray-200">{booking.time}</p></div>
                        <div><p className="text-xs text-gray-500">Imyanya</p><p className="font-semibold dark:text-gray-200">{booking.seats}</p></div>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-5 flex items-center justify-center sm:w-40">
                    <button onClick={() => onViewTicket(booking, isCheckedIn)} className="flex flex-col items-center text-blue-600 dark:text-blue-400 font-semibold text-sm hover:opacity-80">
                        <QrCodeIcon className="w-8 h-8 mb-1" />
                        <span>{isCheckedIn ? 'Itike Yemejwe' : 'Reba Itike'}</span>
                    </button>
                </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700/50 px-5 py-2 flex items-center justify-between">
                <div>
                     {isCheckinAvailable && (
                        <button onClick={() => onCheckIn(booking.id)} className="flex items-center text-xs font-bold text-white bg-green-500 px-3 py-1.5 rounded-full hover:bg-green-600 transition-colors">
                            <CheckCircleIcon className="w-4 h-4 mr-1.5"/>
                            Check-in Now
                        </button>
                    )}
                    {isCheckedIn && (
                        <div className="flex items-center text-xs font-bold text-green-600">
                             <CheckCircleIcon className="w-4 h-4 mr-1.5"/>
                            Checked-In
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-end space-x-4">
                    {isPast ? (
                        <>
                        <button onClick={() => onRateTrip(booking)} className="flex items-center text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <StarIcon className="w-4 h-4 mr-1.5"/>
                            Rate Trip
                        </button>
                        <button onClick={() => onSetPriceAlert(booking)} className="flex items-center text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <BellAlertIcon className="w-4 h-4 mr-1.5"/>
                            Set Price Alert
                        </button>
                        <button onClick={() => alert(`Re-booking trip from ${booking.from} to ${booking.to}...`)} className="flex items-center text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <ArrowPathIcon className="w-4 h-4 mr-1.5"/>
                            Re-book Trip
                        </button>
                        </>
                    ) : (
                        <button onClick={() => alert(`Sharing trip details for ${booking.id}...`)} className="flex items-center text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <ShareIcon className="w-4 h-4 mr-1.5"/>
                            Share Trip
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};


interface BookingsPageProps {
    onViewTicket: (ticket: any, isActive: boolean) => void;
    user: any;
}

const BookingsPage: React.FC<BookingsPageProps> = ({ onViewTicket, user }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [ratingTrip, setRatingTrip] = useState<Booking | null>(null);
  const [checkedInTickets, setCheckedInTickets] = useState<string[]>(() => {
    const saved = localStorage.getItem('checkedInTickets');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('checkedInTickets', JSON.stringify(checkedInTickets));
  }, [checkedInTickets]);


  const handleRatingSubmit = (rating: number, comment: string) => {
      console.log('Rating submitted:', { bookingId: ratingTrip?.id, rating, comment });
      alert(`Thank you for your ${rating}-star rating!`);
      setRatingTrip(null);
  };
  
  const handleSetPriceAlert = (booking: Booking) => {
    const newAlert = { from: booking.from, to: booking.to, initialPrice: booking.price };
    const storedAlerts = localStorage.getItem('priceAlerts');
    let alerts = storedAlerts ? JSON.parse(storedAlerts) : [];
    
    // Avoid duplicates
    if (!alerts.some(a => a.from === newAlert.from && a.to === newAlert.to)) {
        alerts.push(newAlert);
        localStorage.setItem('priceAlerts', JSON.stringify(alerts));
        alert(`Price alert set for ${newAlert.from} to ${newAlert.to}! We'll notify you of any price drops.`);
    } else {
        alert(`You already have a price alert for ${newAlert.from} to ${newAlert.to}.`);
    }
  };

  const handleCheckIn = (ticketId: string) => {
    if (!checkedInTickets.includes(ticketId)) {
        setCheckedInTickets(prev => [...prev, ticketId]);
        alert('Check-in successful! Your ticket is now activated for boarding.');
    }
  };

  return (
    <div className="bg-gray-100/50 dark:bg-gray-900/50 min-h-screen">
        <header className="bg-white dark:bg-gray-800 shadow-sm pt-12 pb-8">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Amatike Yanjye</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Reba amatike yawe y'ingendo zizaza n'izashize.</p>
            </div>
        </header>
        <main className="container mx-auto px-6 py-8">
            <div className="mb-6 border-b border-gray-300 dark:border-gray-700">
                <nav className="flex space-x-6">
                    <button onClick={() => setActiveTab('upcoming')} className={`py-3 px-1 text-sm font-semibold transition-colors ${activeTab === 'upcoming' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                        Ingendo Zizaza ({upcomingBookings.length})
                    </button>
                    <button onClick={() => setActiveTab('past')} className={`py-3 px-1 text-sm font-semibold transition-colors ${activeTab === 'past' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                        Ingendo Zashize ({pastBookings.length})
                    </button>
                </nav>
            </div>
            
            <div>
                {activeTab === 'upcoming' && (
                    <div className="space-y-4">
                        {upcomingBookings.map(booking => <BookingCard key={booking.id} booking={booking} onViewTicket={onViewTicket} onRateTrip={() => {}} onSetPriceAlert={handleSetPriceAlert} isPast={false} onCheckIn={handleCheckIn} isCheckedIn={checkedInTickets.includes(booking.id)} />)}
                    </div>
                )}
                {activeTab === 'past' && (
                    <div className="space-y-4 opacity-80">
                        {pastBookings.map(booking => <BookingCard key={booking.id} booking={booking} onViewTicket={onViewTicket} onRateTrip={setRatingTrip} onSetPriceAlert={handleSetPriceAlert} isPast={true} onCheckIn={() => {}} isCheckedIn={false} />)}
                    </div>
                )}
            </div>
        </main>
         {ratingTrip && (
            <RateTripModal 
                booking={ratingTrip} 
                onClose={() => setRatingTrip(null)}
                onSubmit={handleRatingSubmit}
            />
        )}
    </div>
  );
};

export default BookingsPage;