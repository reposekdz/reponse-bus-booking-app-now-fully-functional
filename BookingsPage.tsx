import React, { useState } from 'react';
import StarRating from './components/StarRating';
import AdBanner from './components/AdBanner';
import { QrCodeIcon } from './components/icons';

const ReviewModal: React.FC<{ trip: any; onClose: () => void }> = ({ trip, onClose }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ rating, review });
    onClose();
    alert('Urakoze ku gitekerezo cyawe!');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h3 className="text-xl font-bold mb-2 dark:text-white">Tanga igitekerezo ku rugendo rwawe</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{trip.route}</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amanota yawe</label>
            <StarRating rating={rating} onRatingChange={setRating} isInteractive={true} size="large" />
          </div>
          <div className="mb-6">
            <label htmlFor="review" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Igitekerezo cyawe</label>
            <textarea
              id="review"
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tubwire uko urugendo rwawe rwagenze..."
            ></textarea>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              Bireke
            </button>
            <button type="submit" className="px-4 py-2 rounded-md bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#0033A0] font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all">
              Emeza
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const BookingCard: React.FC<{ trip: any; isPast?: boolean; onReview: (trip: any) => void }> = ({ trip, isPast, onReview }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row transition-shadow hover:shadow-xl">
    <div className="p-5 flex-grow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{trip.date}</p>
          <h4 className="text-lg font-bold text-gray-800 dark:text-white">{trip.route}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">Gikoreshwa na {trip.company}</p>
        </div>
        <div className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${isPast ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}`}>
          {isPast ? 'Urwuzuye' : 'Urutaha'}
        </div>
      </div>
      <div className="border-t dark:border-gray-700 my-4"></div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Imyanya: <span className="font-medium text-gray-800 dark:text-white">{trip.seats}</span></p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Igiciro Cyose: <span className="font-medium text-gray-800 dark:text-white">{trip.price}</span></p>
        </div>
        {isPast ? (
          <button onClick={() => onReview(trip)} className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all">
            Tanga igitekerezo
          </button>
        ) : (
           <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Reba ibisobanuro</button>
        )}
      </div>
    </div>
    {!isPast && (
      <div className="flex-shrink-0 bg-gray-50 dark:bg-gray-700/50 p-4 flex flex-col items-center justify-center border-l dark:border-gray-700">
        <QrCodeIcon className="w-20 h-20 text-gray-400 dark:text-gray-500" />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Sikana ku muryango</p>
      </div>
    )}
  </div>
);


const BookingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [reviewingTrip, setReviewingTrip] = useState<any | null>(null);

  const upcomingTrips = [
    { date: '28 Ukwakira, 2024', route: 'Kigali - Rubavu', company: 'Volcano Express', seats: 'A5, A6', price: '9,000 FRW' },
  ];
  const pastTrips = [
    { date: '15 Nzeri, 2024', route: 'Huye - Musanze', company: 'Horizon Express', seats: 'C2', price: '5,000 FRW' },
    { date: '02 Kanama, 2024', route: 'Kigali - Nyungwe', company: 'RITCO', seats: 'B1, B2', price: '14,000 FRW' },
  ];

  return (
    <div className="bg-gray-100/50 dark:bg-gray-900/50 min-h-full py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-3">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Amatike Yanjye</h1>
                <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
                  <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('upcoming')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'upcoming' ? 'border-yellow-500 text-blue-600 dark:text-yellow-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'}`}>
                      Izitaha
                    </button>
                    <button onClick={() => setActiveTab('past')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'past' ? 'border-yellow-500 text-blue-600 dark:text-yellow-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'}`}>
                      Izarangiye
                    </button>
                  </nav>
                </div>

                <div className="space-y-6">
                  {activeTab === 'upcoming' && (upcomingTrips.length > 0 ? upcomingTrips.map((trip, i) => <BookingCard key={i} trip={trip} onReview={setReviewingTrip} />) : <p>Nta ngendo ziteganyijwe.</p>)}
                  {activeTab === 'past' && (pastTrips.length > 0 ? pastTrips.map((trip, i) => <BookingCard key={i} trip={trip} isPast onReview={setReviewingTrip} />) : <p>Nta ngendo zarangiye.</p>)}
                </div>
            </div>
            <aside className="md:col-span-1">
                <div className="sticky top-24 space-y-6">
                    <h3 className="font-bold text-lg dark:text-white">Imenyekanisha</h3>
                    <AdBanner type="sidebar" />
                </div>
            </aside>
        </div>
      </div>
      {reviewingTrip && <ReviewModal trip={reviewingTrip} onClose={() => setReviewingTrip(null)} />}
    </div>
  );
};

export default BookingsPage;