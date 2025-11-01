import React, { useState, useMemo } from 'react';
import StarRating from './components/StarRating';
import AdBanner from './components/AdBanner';
import { QrCodeIcon, MapIcon, XIcon, ArrowRightIcon } from './components/icons';
import LiveTrackingModal from './components/LiveTrackingModal';

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

const TicketModal: React.FC<{ trip: any; onClose: () => void }> = ({ trip, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-10">
                    <XIcon className="w-6 h-6" />
                </button>
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-2xl">
                    <h3 className="text-2xl font-bold">{trip.company}</h3>
                    <p className="opacity-80">Itike ya Bisi ya Elegitoronike</p>
                </div>
                <div className="p-6">
                    <div className="text-center mb-6">
                        <QrCodeIcon className="w-40 h-40 mx-auto text-gray-800 dark:text-gray-200" />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Iyi ni itike yawe. Sikana iyi kode mbere yo kwinjira muri bisi.</p>
                    </div>
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Umugenzi</span>
                            <span className="font-semibold dark:text-white">Kalisa Jean</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Urugendo</span>
                            <span className="font-semibold dark:text-white">{trip.route}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Itariki</span>
                            <span className="font-semibold dark:text-white">{trip.date}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Igihe cyo guhaguruka</span>
                            <span className="font-semibold dark:text-white">07:00 AM</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Imyanya</span>
                            <span className="font-semibold text-blue-600 dark:text-blue-400">{trip.seats}</span>
                        </div>
                        <div className="flex justify-between border-t dark:border-gray-700 pt-4 mt-4">
                            <span className="text-gray-500 dark:text-gray-400">Igiciro Cyose</span>
                            <span className="font-bold text-lg text-green-600 dark:text-green-400">{trip.price}</span>
                        </div>
                    </div>
                     <button className="mt-6 w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold">
                        Vanamo PDF
                    </button>
                </div>
            </div>
        </div>
    );
};


const BookingCard: React.FC<{ trip: any; isPast?: boolean; onReview: (trip: any) => void; onTrack: (trip: any) => void; onViewTicket: (trip: any) => void; }> = ({ trip, isPast, onReview, onTrack, onViewTicket }) => (
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
           <div className="flex items-center space-x-2">
                <button onClick={() => onViewTicket(trip)} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Reba Itike</button>
                <button onClick={() => onTrack(trip)} className="flex items-center px-3 py-2 rounded-md bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold hover:from-green-600 hover:to-green-700 transition-all">
                    <MapIcon className="w-4 h-4 mr-2" /> Kurikirana
                </button>
            </div>
        )}
      </div>
    </div>
    {!isPast && (
      <button onClick={() => onViewTicket(trip)} className="flex-shrink-0 bg-gray-50 dark:bg-gray-700/50 p-4 flex flex-col items-center justify-center border-l dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <QrCodeIcon className="w-20 h-20 text-gray-400 dark:text-gray-500" />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Reba Itike</p>
      </button>
    )}
  </div>
);


const BookingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [reviewingTrip, setReviewingTrip] = useState<any | null>(null);
  const [trackingTrip, setTrackingTrip] = useState<any | null>(null);
  const [viewingTicket, setViewingTicket] = useState<any | null>(null);
  const [filterCompany, setFilterCompany] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const upcomingTrips = [
    { date: '28 Ukwakira, 2024', route: 'Kigali - Rubavu', company: 'Volcano Express', seats: 'A5, A6', price: '9,000 FRW' },
  ];
  const pastTrips = [
    { date: '15 Nzeri, 2024', route: 'Huye - Musanze', company: 'Horizon Express', seats: 'C2', price: '5,000 FRW', rawDate: new Date('2024-09-15') },
    { date: '02 Kanama, 2024', route: 'Kigali - Nyungwe', company: 'RITCO', seats: 'B1, B2', price: '14,000 FRW', rawDate: new Date('2024-08-02') },
  ];
  
  const pastTripCompanies = useMemo(() => ['all', ...Array.from(new Set(pastTrips.map(t => t.company)))], [pastTrips]);

  const filteredAndSortedPastTrips = useMemo(() => {
    return pastTrips
      .filter(trip => filterCompany === 'all' || trip.company === filterCompany)
      .sort((a, b) => {
        if (sortOrder === 'desc') {
          return b.rawDate.getTime() - a.rawDate.getTime();
        }
        return a.rawDate.getTime() - b.rawDate.getTime();
      });
  }, [pastTrips, filterCompany, sortOrder]);


  return (
    <div className="bg-gray-100/50 dark:bg-gray-900/50 min-h-full py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-3">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Amatike Yanjye</h1>
                <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                  <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('upcoming')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'upcoming' ? 'border-yellow-500 text-blue-600 dark:text-yellow-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'}`}>
                      Izitaha
                    </button>
                    <button onClick={() => setActiveTab('past')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'past' ? 'border-yellow-500 text-blue-600 dark:text-yellow-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'}`}>
                      Izarangiye
                    </button>
                  </nav>
                </div>
                
                {activeTab === 'past' && (
                    <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg mb-6 flex items-center space-x-4">
                        <select value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)} className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:ring-yellow-500 focus:border-yellow-500">
                            {pastTripCompanies.map(company => (
                                <option key={company} value={company}>{company === 'all' ? 'Ibigo Byose' : company}</option>
                            ))}
                        </select>
                        <button onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')} className="px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                            Tondeka: {sortOrder === 'desc' ? 'Bishya mbere' : 'Bishaje mbere'}
                        </button>
                    </div>
                )}

                <div className="space-y-6">
                  {activeTab === 'upcoming' && (upcomingTrips.length > 0 ? upcomingTrips.map((trip, i) => <BookingCard key={i} trip={trip} onReview={setReviewingTrip} onTrack={setTrackingTrip} onViewTicket={setViewingTicket} />) : <p>Nta ngendo ziteganyijwe.</p>)}
                  {activeTab === 'past' && (filteredAndSortedPastTrips.length > 0 ? filteredAndSortedPastTrips.map((trip, i) => <BookingCard key={i} trip={trip} isPast onReview={setReviewingTrip} onTrack={setTrackingTrip} onViewTicket={setViewingTicket} />) : <p>Nta ngendo zarangiye zihuye n'ishakisha ryawe.</p>)}
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
      {trackingTrip && <LiveTrackingModal trip={trackingTrip} onClose={() => setTrackingTrip(null)} />}
      {viewingTicket && <TicketModal trip={viewingTicket} onClose={() => setViewingTicket(null)} />}
    </div>
  );
};

export default BookingsPage;