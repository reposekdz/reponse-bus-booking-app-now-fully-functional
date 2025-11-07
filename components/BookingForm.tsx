import React, { useState } from 'react';
import { LocationMarkerIcon, CalendarIcon, UserCircleIcon, ArrowRightIcon, PlusIcon, TagIcon, ArrowsUpDownIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface BookingFormProps {
  onSearch: (from: string, to: string) => void;
}

const locations = ['Kigali', 'Rubavu', 'Musanze', 'Huye', 'Rusizi', 'Nyagatare', 'Muhanga'];

const BookingForm: React.FC<BookingFormProps> = ({ onSearch }) => {
  const { t } = useLanguage();
  const [fromLocation, setFromLocation] = useState('Kigali');
  const [toLocation, setToLocation] = useState('Rubavu');
  const [journeyDate, setJourneyDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState({ adults: 1, children: 0 });
  const [isPassengerDropdownOpen, setIsPassengerDropdownOpen] = useState(false);
  const [tripType, setTripType] = useState('one-way');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(fromLocation, toLocation);
  };

  const swapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };
  
  const handlePassengerChange = (type: 'adults' | 'children', operation: 'inc' | 'dec') => {
      setPassengers(prev => ({
          ...prev,
          [type]: operation === 'inc' ? prev[type] + 1 : Math.max(type === 'adults' ? 1 : 0, prev[type] - 1)
      }));
  };
  
  const formInputBaseClass = "w-full pl-10 pr-4 py-3 rounded-lg border-2 border-white/10 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-black/30 backdrop-blur-sm text-white transition appearance-none";
  const formLabelClass = "absolute -top-2 left-4 text-xs px-1 text-yellow-300 z-10 font-semibold [text-shadow:0_0_5px_rgba(251,191,36,0.5)]";


  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-gray-800 dark:text-white">
      <div className="flex items-center space-x-4 mb-4">
        <button type="button" onClick={() => setTripType('one-way')} className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${tripType === 'one-way' ? 'bg-yellow-300 text-blue-900' : 'bg-white/20 text-white hover:bg-white/30'}`}>{t('form_one_way')}</button>
        <button type="button" onClick={() => setTripType('round-trip')} className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${tripType === 'round-trip' ? 'bg-yellow-300 text-blue-900' : 'bg-white/20 text-white hover:bg-white/30'}`}>{t('form_round_trip')}</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          <div className="relative">
            <label htmlFor="from" className={formLabelClass}>{t('form_from')}</label>
            <LocationMarkerIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
            <select
              id="from"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              className={`${formInputBaseClass} text-white`}
            >
              {locations.map(loc => <option key={`from-${loc}`} value={loc} className="bg-gray-800">{loc}</option>)}
            </select>
          </div>

          <div className="relative mt-5">
             <button type="button" onClick={swapLocations} className="w-10 h-10 rounded-full bg-white/30 text-white flex items-center justify-center hover:bg-white/50 transition-all transform hover:rotate-180 duration-300">
                <ArrowsUpDownIcon className="w-5 h-5"/>
             </button>
          </div>

           <div className="relative">
            <label htmlFor="to" className={formLabelClass}>{t('form_to')}</label>
            <LocationMarkerIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
            <select
              id="to"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              className={`${formInputBaseClass} text-white`}
            >
              {locations.map(loc => <option key={`to-${loc}`} value={loc} className="bg-gray-800">{loc}</option>)}
            </select>
          </div>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label htmlFor="date" className={formLabelClass}>{t('form_date')}</label>
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
            <input type="date" id="date" value={journeyDate} onChange={(e) => setJourneyDate(e.target.value)} className={formInputBaseClass}/>
          </div>
          <div className={`relative transition-opacity ${tripType === 'one-way' ? 'opacity-50' : 'opacity-100'}`}>
            <label htmlFor="return-date" className={formLabelClass}>{t('form_return_date')}</label>
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
            <input type="date" id="return-date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} disabled={tripType === 'one-way'} className={formInputBaseClass}/>
          </div>
      </div>
      <div className="grid grid-cols-1">
          <div className="relative">
            <label className={formLabelClass}>{t('form_passengers')}</label>
            <button type="button" onClick={() => setIsPassengerDropdownOpen(!isPassengerDropdownOpen)} className={`${formInputBaseClass} text-left`}>
                 <UserCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                 {passengers.adults} {t('form_adults')}, {passengers.children} {t('form_children')}
            </button>
             {isPassengerDropdownOpen && (
                <div className="absolute top-full mt-2 w-full bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-lg shadow-xl p-4 z-20 text-white">
                    <div className="flex justify-between items-center">
                        <p>{t('form_adults_label')}</p>
                        <div className="flex items-center space-x-3">
                            <button type="button" onClick={() => handlePassengerChange('adults', 'dec')} className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30">-</button>
                            <span className="w-4 text-center">{passengers.adults}</span>
                            <button type="button" onClick={() => handlePassengerChange('adults', 'inc')} className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30">+</button>
                        </div>
                    </div>
                     <div className="flex justify-between items-center mt-2">
                        <p>{t('form_children_label')}</p>
                        <div className="flex items-center space-x-3">
                            <button type="button" onClick={() => handlePassengerChange('children', 'dec')} className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30">-</button>
                            <span className="w-4 text-center">{passengers.children}</span>
                            <button type="button" onClick={() => handlePassengerChange('children', 'inc')} className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30">+</button>
                        </div>
                    </div>
                </div>
            )}
          </div>
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