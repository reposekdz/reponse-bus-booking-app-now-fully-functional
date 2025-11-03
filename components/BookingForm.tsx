import React, { useState } from 'react';
import { CalendarIcon, ArrowRightIcon, LocationMarkerIcon, UsersIcon } from './icons';
import FareCalendar from './FareCalendar';

type TripType = 'one-way' | 'round-trip';

interface BookingFormProps {
  onSearch: (from?: string, to?: string) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSearch }) => {
  const [tripType, setTripType] = useState<TripType>('one-way');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState<'departure' | 'return' | null>(null);
  const [passengers, setPassengers] = useState('1');

  const handleDateSelect = (date: Date) => {
    if (showCalendar === 'departure') {
      setDepartureDate(date);
    } else if (showCalendar === 'return') {
      setReturnDate(date);
    }
    setShowCalendar(null);
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('fr-CA'); // YYYY-MM-DD format
  };

  const handlePassengerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string for intermediate input, but enforce numbers
    if (value === '' || /^[1-9]\d*$/.test(value)) {
      setPassengers(value);
    }
  };

  const handlePassengerBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setPassengers('1');
    }
  };

  return (
    <div className="text-left relative">
      <div className="mb-4 flex items-center bg-black/20 rounded-full p-1 max-w-xs">
        <button
          onClick={() => setTripType('one-way')}
          className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
            tripType === 'one-way' ? 'bg-white/90 text-[#0033A0]' : 'text-white hover:bg-white/10'
          }`}
        >
          Kugenda gusa
        </button>
        <button
          onClick={() => setTripType('round-trip')}
          className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
            tripType === 'round-trip' ? 'bg-white/90 text-[#0033A0]' : 'text-white hover:bg-white/10'
          }`}
        >
          Kugenda no kugaruka
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <div className="md:col-span-2 relative">
          <label htmlFor="from" className="block text-sm font-medium mb-1 text-gray-200">Uva</label>
           <LocationMarkerIcon className="absolute left-3 top-10 h-5 w-5 text-gray-300" />
          <input id="from" type="text" placeholder="Aho uva" value={from} onChange={e => setFrom(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-yellow-400/50 focus:outline-none transition-all" />
        </div>
        <div className="md:col-span-2 relative">
          <label htmlFor="to" className="block text-sm font-medium mb-1 text-gray-200">Ujya</label>
          <LocationMarkerIcon className="absolute left-3 top-10 h-5 w-5 text-gray-300" />
           <input id="to" type="text" placeholder="Aho ujya" value={to} onChange={e => setTo(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-yellow-400/50 focus:outline-none transition-all" />
        </div>
         <div className="md:col-span-1 relative">
          <label htmlFor="passengers" className="block text-sm font-medium mb-1 text-gray-200">Abagenzi</label>
          <UsersIcon className="absolute left-3 top-10 h-5 w-5 text-gray-300" />
           <input 
             id="passengers" 
             type="text" 
             inputMode="numeric"
             value={passengers}
             onChange={handlePassengerChange}
             onBlur={handlePassengerBlur}
             className="w-full pl-10 bg-white/10 border border-white/20 rounded-lg p-3 focus:ring-2 focus:ring-yellow-400/50 focus:outline-none transition-all" 
           />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="relative">
          <label htmlFor="departure" className="block text-sm font-medium mb-1 text-gray-200">Itariki yo Kugenda</label>
          <input type="text" id="departure" readOnly onClick={() => setShowCalendar('departure')} value={formatDate(departureDate)} placeholder="Hitamo itariki" className="w-full bg-white/10 border border-white/20 rounded-lg p-3 pr-10 focus:ring-2 focus:ring-yellow-400/50 focus:outline-none transition-all cursor-pointer" />
          <CalendarIcon className="absolute right-3 top-10 h-5 w-5 text-gray-300" />
        </div>
        <div className="relative">
          <label htmlFor="return" className="block text-sm font-medium mb-1 text-gray-200">Itariki yo Kugaruka</label>
          <input
            type="text"
            id="return"
            readOnly
            onClick={() => tripType === 'round-trip' && setShowCalendar('return')}
            value={formatDate(returnDate)}
            placeholder="Hitamo itariki (bishyirwamo)"
            disabled={tripType === 'one-way'}
            className="w-full bg-white/10 border border-white/20 rounded-lg p-3 pr-10 focus:ring-2 focus:ring-yellow-400/50 focus:outline-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          />
          <CalendarIcon className="absolute right-3 top-10 h-5 w-5 text-gray-300" />
        </div>
      </div>
      
      {showCalendar && (
        <div className="absolute top-full mt-2 z-50 left-0 right-0">
             <FareCalendar
                onDateSelect={handleDateSelect}
                selectedDate={showCalendar === 'departure' ? departureDate : returnDate}
            />
        </div>
      )}

      <button 
        onClick={() => onSearch(from, to)}
        className="w-full flex items-center justify-center p-4 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-[#0033A0] font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
      >
        Shakisha Bisi
        <ArrowRightIcon className="w-6 h-6 ml-3" />
      </button>
    </div>
  );
};

export default BookingForm;