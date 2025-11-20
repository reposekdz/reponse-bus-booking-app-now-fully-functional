
import React, { useState } from 'react';
import { CalendarIcon, ArrowRightIcon, ArrowsUpDownIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';
import SearchableSelect from './SearchableSelect';
import PassengerSelector from './PassengerSelector';
import { rwandaAllStations } from '../lib/stations';

interface BookingFormProps {
  onSearch: (from: string, to: string, date: string, passengers: { adults: number; children: number; }) => void;
}

// Create a unique sorted list of all station names for the dropdown
const allLocations = [...new Set(rwandaAllStations.map(s => s.name))].sort();

const BookingForm: React.FC<BookingFormProps> = ({ onSearch }) => {
  const { t } = useLanguage();
  const [fromLocation, setFromLocation] = useState('Kigali (Nyabugogo)');
  const [toLocation, setToLocation] = useState('Rubavu');
  const [journeyDate, setJourneyDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState({ adults: 1, children: 0 });
  const [tripType, setTripType] = useState('one-way');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(fromLocation, toLocation, journeyDate, passengers);
  };

  const swapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };
  
  const formInputBaseClass = "w-full pl-10 pr-4 py-3 rounded-lg border-2 border-white/10 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-black/30 backdrop-blur-sm text-white transition appearance-none placeholder-gray-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-gray-800 dark:text-white">
      <div className="flex items-center space-x-2 sm:space-x-4 mb-4">
        <button type="button" onClick={() => setTripType('one-way')} className={`px-3 sm:px-4 py-2 rounded-full font-semibold text-sm transition-colors ${tripType === 'one-way' ? 'bg-yellow-300 text-blue-900' : 'bg-white/20 text-white hover:bg-white/30'}`}>{t('form_one_way')}</button>
        <button type="button" onClick={() => setTripType('round-trip')} className={`px-3 sm:px-4 py-2 rounded-full font-semibold text-sm transition-colors ${tripType === 'round-trip' ? 'bg-yellow-300 text-blue-900' : 'bg-white/20 text-white hover:bg-white/30'}`}>{t('form_round_trip')}</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          <SearchableSelect
            options={allLocations}
            value={fromLocation}
            onChange={setFromLocation}
            placeholder={t('form_from')}
          />

          <div className="relative h-10 flex items-center justify-center md:mt-0">
             <div className="w-full h-[2px] bg-white/10 md:hidden"></div>
             <button type="button" onClick={swapLocations} className="absolute w-10 h-10 rounded-full bg-white/30 text-white flex items-center justify-center hover:bg-white/50 transition-all transform hover:rotate-180 duration-300 z-10">
                <ArrowsUpDownIcon className="w-5 h-5"/>
             </button>
          </div>

           <SearchableSelect
            options={allLocations}
            value={toLocation}
            onChange={setToLocation}
            placeholder={t('form_to')}
          />
      </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
            <input type="date" id="date" value={journeyDate} onChange={(e) => setJourneyDate(e.target.value)} className={formInputBaseClass} placeholder={t('form_date')}/>
          </div>
          <div className={`relative transition-opacity ${tripType === 'one-way' ? 'opacity-50' : 'opacity-100'}`}>
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
            <input type="date" id="return-date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} disabled={tripType === 'one-way'} className={formInputBaseClass} placeholder={t('form_return_date')}/>
          </div>
      </div>
      <div className="grid grid-cols-1">
          <PassengerSelector 
            passengers={passengers} 
            onPassengersChange={setPassengers}
            className="border-2 border-white/10 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-black/30 backdrop-blur-sm text-white"
          />
       </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center px-8 py-4 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#0033A0] font-bold hover:saturate-150 transition-all duration-300 shadow-lg text-lg transform hover:-translate-y-0.5"
      >
        {t('form_search_button')} <ArrowRightIcon className="w-5 h-5 ml-2" />
      </button>
    </form>
  );
};

export default BookingForm;
