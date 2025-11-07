import React, { useState } from 'react';
import { TicketIcon, ChevronRightIcon, QrCodeIcon, ArrowPathIcon, ShareIcon, BellAlertIcon } from './components/icons';

const upcomingBookings = [
    { id: 'TICKET-001', from: 'Kigali', to: 'Rubavu', company: 'Volcano Express', date: '28 Ukwakira, 2024', time: '07:00 AM', seats: 'A5, A6', price: '9,000 FRW', passenger: 'Kalisa Jean', busPlate: 'RAD 123 B' },
    { id: 'TICKET-002', from: 'Huye', to: 'Kigali', company: 'RITCO', date: '02 Ugushyingo, 2024', time: '02:30 PM', seats: 'C1', price: '3,000 FRW', passenger: 'Kalisa Jean', busPlate: 'RAF 456 C' },
];

const pastBookings = [
    { id: 'TICKET-003', from: 'Kigali', to: 'Musanze', company: 'Horizon Express', date: '15 Ukwakira, 2024', time: '09:00 AM', seats: 'D3', price: '3,500 FRW', passenger: 'Kalisa Jean', busPlate: 'RAE 789 A' },
];

type Booking = typeof upcomingBookings[0];

interface BookingCardProps {
    booking: Booking;
    onViewTicket: (booking: Booking) => void;
    isPast: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onViewTicket, isPast }) => (
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
                    <div><p className="text-xs text-gray-500">Itariki</p><p className="font-semibold dark:text-gray-200">{booking.date}</p></div>
                    <div><p className="text-xs text-gray-500">Isaha</p><p className="font-semibold dark:text-gray-200">{booking.time}</p></div>
                    <div><p className="text-xs text-gray-500">Imyanya</p><p className="font-semibold dark:text-gray-200">{booking.seats}</p></div>
                </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-5 flex items-center justify-center sm:w-32">
                <button onClick={() => onViewTicket(booking)} className="flex flex-col items-center text-blue-600 dark:text-blue-400 font-semibold text-sm hover:opacity-80">
                    <QrCodeIcon className="w-8 h-8 mb-1" />
                    <span>Reba Itike</span>
                </button>
            </div>
        </div>
         <div className="bg-gray-100 dark:bg-gray-700/50 px-5 py-2 flex items-center justify-end space-x-4">
            {isPast ? (
                <>
                 <button onClick={() => alert(`Price alert set for ${booking.from} to ${booking.to}!`)} className="flex items-center text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
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
);

interface BookingsPageProps {
    onViewTicket: (ticket: any) => void;
}

const BookingsPage: React.FC<BookingsPageProps> = ({ onViewTicket }) => {
  const [activeTab, setActiveTab] = useState('upcoming');

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
                        {upcomingBookings.map(booking => <BookingCard key={booking.id} booking={booking} onViewTicket={onViewTicket} isPast={false} />)}
                    </div>
                )}
                {activeTab === 'past' && (
                    <div className="space-y-4 opacity-80">
                        {pastBookings.map(booking => <BookingCard key={booking.id} booking={booking} onViewTicket={onViewTicket} isPast={true} />)}
                    </div>
                )}
            </div>
        </main>
    </div>
  );
};

export default BookingsPage;