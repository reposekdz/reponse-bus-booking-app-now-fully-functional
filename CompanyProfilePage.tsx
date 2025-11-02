import React, { useState, useMemo } from 'react';
import { ClockIcon, MapPinIcon, ChevronRightIcon, BusIcon, WifiIcon, AcIcon, PowerIcon, StarIcon, UsersIcon, MapIcon, BriefcaseIcon, TvIcon, ShieldCheckIcon, ArrowRightIcon, CameraIcon, EnvelopeIcon, XIcon, PaperAirplaneIcon, TagIcon, ArchiveBoxIcon } from './components/icons';
import FleetDetailModal from './components/FleetDetailModal';
import StarRating from './components/StarRating';

const mockCompanyData: { [key: string]: any } = {
  ritco: {
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2048&auto=format&fit=crop',
    address: 'Kiyovu, Kigali, Rwanda',
    hours: 'Buri munsi: 05:00 - 22:00',
    contactEmail: 'info@ritco.rw',
    stats: { passengers: '2M+', fleet: 85, routes: 25 },
    description: "RITCO ni ikigo cya Leta gishinzwe gutwara abantu mu buryo bwa rusange, kizwiho kugira imodoka nini kandi zigezweho zitwara abantu mu gihugu hose.",
    fleet: [
      { id: 'ritco-1', name: 'Yutong Grand', capacity: 65, image: 'https://images.pexels.com/photos/18413861/pexels-photo-18413861/free-photo-of-a-bus-is-driving-down-a-road-in-the-mountains.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', amenities: ['AC', 'Charging'], images360: ['https://images.pexels.com/photos/2174975/pexels-photo-2174975.jpeg', 'https://images.pexels.com/photos/18413861/pexels-photo-18413861/free-photo-of-a-bus-is-driving-down-a-road-in-the-mountains.jpeg'], specs: { engine: 'Cummins ISL9.5', power: '380 HP', features: 'Air Suspension, Reclining Seats' } },
      { id: 'ritco-2', name: 'Scania Marcopolo', capacity: 70, image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2048&auto=format&fit=crop', amenities: ['AC'], images360: [], specs: { engine: 'Scania DC13', power: '410 HP', features: 'On-board restroom, Extra legroom' } },
    ],
    routes: [ { from: 'Kigali', to: 'Huye', price: '3,000 FRW' }, { from: 'Kigali', to: 'Nyungwe', price: '7,000 FRW' }, { from: 'Kigali', to: 'Rusizi', price: '8,000 FRW' }, { from: 'Huye', to: 'Kigali', price: '3,000 FRW' } ],
    services: [
        { name: 'Gutwara Ibintu', description: 'Ohereza imizigo mu gihugu hose.', icon: ArchiveBoxIcon },
        { name: 'Kodesha Imodoka', description: 'Imodoka zihariye ku matsinda n\'ibirori.', icon: BriefcaseIcon }
    ],
    schedule: {
      'Kigali-Huye': [
        { time: '06:00', arrival: '08:30', bus: 'Yutong Grand', price: '3,000 FRW' },
        { time: '08:00', arrival: '10:30', bus: 'Scania Marcopolo', price: '3,000 FRW' },
        { time: '10:00', arrival: '12:30', bus: 'Yutong Grand', price: '3,000 FRW' },
      ],
      'Kigali-Nyungwe': [
        { time: '07:00', arrival: '12:00', bus: 'Scania Marcopolo', price: '7,000 FRW' },
      ]
    },
    reviews: [
        { author: 'Kalisa J.', rating: 5, comment: 'Serivisi nziza cyane! Bisi zirasukuye kandi zigezweho.'},
        { author: 'Umutoni G.', rating: 4, comment: 'Bagerageza kugera ku gihe, ariko interineti ya WiFi ntiyakoraga neza.'},
    ],
    gallery: [
        { src: 'https://www.ritco.rw/wp-content/uploads/2021/04/IMG-20210408-WA0002.jpg', category: 'exterior' },
        { src: 'https://www.ritco.rw/wp-content/uploads/2021/04/IMG_6733.jpg', category: 'interior' },
        { src: 'https://fortune.rw/wp-content/uploads/2023/12/RITCO-to-acquire-150-new-buses-to-meet-festive-season-demand.jpg', category: 'exterior' },
        { src: 'https://pbs.twimg.com/media/Fxtp0bPWIAAh6-p.jpg', category: 'exterior' },
        { src: 'https://www.kigalitoday.com/IMG/jpg/ritco_bus_stop.jpg', category: 'staff' }
    ],
    promotions: [
        { id: 'RITCO01', title: 'Igabanyirizwa ry\'Abanyeshuri', description: 'Bona 15% by\'igabanyirizwa ku ngendo zose werekanye ikarita y\'ishuri.', code: 'STUDENT15', expiryDate: '2024-12-31' }
    ]
  },
  volcano: {
    coverImage: 'https://images.unsplash.com/photo-1593256398246-8853b3815c32?q=80&w=2070&auto=format&fit=crop',
    address: 'Nyabugogo, Kigali, Rwanda',
    hours: 'Buri munsi: 04:30 - 23:00',
    contactEmail: 'contact@volcano.rw',
    stats: { passengers: '3.5M+', fleet: 120, routes: 30 },
    description: "Volcano Express ni kimwe mu bigo bikunzwe cyane mu Rwanda, kizwiho serivisi nziza, isuku, no kugera ku gihe. Bakorera mu mihanda myinshi ikomeye.",
    fleet: [
      { id: 'volcano-1', name: 'Coaster Bus', capacity: 30, image: 'https://images.pexels.com/photos/385997/pexels-photo-385997.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', amenities: ['WiFi', 'AC', 'Charging'], images360: [], specs: { engine: 'Toyota 1HZ', power: '129 HP', features: 'Compact, ideal for smaller groups' } },
      { id: 'volcano-2', name: 'Yutong Explorer', capacity: 55, image: 'https://images.pexels.com/photos/2418491/pexels-photo-2418491.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', amenities: ['AC', 'Charging'], images360: [], specs: { engine: 'Weichai WP10', power: '336 HP', features: 'USB charging at every seat' } },
    ],
    routes: [ { from: 'Kigali', to: 'Rubavu', price: '4,500 FRW' }, { from: 'Kigali', to: 'Musanze', price: '3,500 FRW' }, { from: 'Rubavu', to: 'Kigali', price: '4,500 FRW' } ],
    services: [
        { name: 'Gutwara Ibintu Byihuse', description: 'Serivisi yo gutwara ibintu mu masaha make.', icon: ArchiveBoxIcon },
        { name: 'Ingendo z\'Ubukerarugendo', description: 'Gutegura ingendo zikwereka ibyiza by\'i Musanze na Rubavu.', icon: MapIcon },
        { name: 'WiFi Yihuta', description: 'Komeza ukoreshe interineti mu rugendo.', icon: WifiIcon }
    ],
    schedule: {
      'Kigali-Rubavu': [
        { time: '07:00', arrival: '10:30', bus: 'Yutong Explorer', price: '4,500 FRW' },
        { time: '08:30', arrival: '12:00', bus: 'Yutong Explorer', price: '4,500 FRW' },
        { time: '11:00', arrival: '14:30', bus: 'Coaster Bus', price: '4,500 FRW' },
        { time: '14:00', arrival: '17:30', bus: 'Yutong Explorer', price: '4,500 FRW' },
      ],
      'Kigali-Musanze': [
        { time: '09:00', arrival: '11:00', bus: 'Coaster Bus', price: '3,500 FRW' },
        { time: '13:00', arrival: '15:00', bus: 'Coaster Bus', price: '3,500 FRW' },
      ]
    },
    reviews: [
        { author: 'Mugisha F.', rating: 5, comment: 'Nta kundi navuga, Volcano ni abahanga! Buri gihe serivisi ni nziza.'},
    ],
    gallery: [
        { src: 'https://volcanoexpress.co.rw/wp-content/uploads/2021/02/1-1.jpg', category: 'interior' },
        { src: 'https://volcanoexpress.co.rw/wp-content/uploads/2021/02/DJI_0028-1.jpg', category: 'exterior' },
        { src: 'https://volcanoexpress.co.rw/wp-content/uploads/2021/02/3-1.jpg', category: 'interior' },
        { src: 'https://www.kigalitoday.com/IMG/jpg/volcano-2.jpg', category: 'exterior' },
        { src: 'https://live.staticflickr.com/4885/45920785752_11b33b708b_b.jpg', category: 'staff' },
    ],
    promotions: [
        { id: 'VOLC01', title: 'Gura Itike ya Gatatu ku buntu!', description: 'Gura amatike abiri ajya Rubavu, ubone iya gatatu ku buntu. Byihuse, ibi ntibizatinze!', code: 'GENDANEZA', expiryDate: '2024-11-30' },
        { id: 'VOLC02', title: 'Igabanyirizwa rya Weekend', description: 'Bona 10% by\'igabanyirizwa ku ngendo zose za weekend (Kuwa Gatanu - Ku Cyumweru).', code: 'WEEKEND10', expiryDate: '2024-12-22' }
    ]
  },
};

const defaultCompanyData = {
    coverImage: 'https://images.unsplash.com/photo-1616372819235-9b2e1577a2d4?q=80&w=2070&auto=format&fit=crop',
    address: 'Amakuru ntazwi',
    hours: 'Amakuru ntazwi',
    contactEmail: 'not-available@example.com',
    stats: { passengers: 'N/A', fleet: 'N/A', routes: 'N/A' },
    description: "Nta makuru ahagije kuri iki kigo araboneka. Tuzayongeramo vuba.",
    fleet: [],
    routes: [],
    services: [],
    schedule: {},
    reviews: [],
    gallery: [],
    promotions: [],
}

const AmenityIcon: React.FC<{ amenity: string; withText?: boolean }> = ({ amenity, withText = false }) => {
    const iconClass = withText ? "w-6 h-6 text-blue-600 dark:text-blue-400" : "w-4 h-4 text-gray-500 dark:text-gray-400";
    const containerClass = withText ? "flex flex-col items-center text-center p-4 rounded-lg bg-gray-100 dark:bg-gray-800" : "";
    
    let IconComponent;
    let text = amenity;

    switch (amenity) {
        case 'WiFi':
            IconComponent = WifiIcon;
            break;
        case 'AC':
        case 'Air Conditioning':
            IconComponent = AcIcon;
            text = 'Air Conditioning';
            break;
        case 'Charging':
        case 'Charging Ports':
            IconComponent = PowerIcon;
            text = 'Charging Ports';
            break;
        case 'On-board Restroom':
            IconComponent = UsersIcon;
            break;
        case 'Luggage Allowance':
            IconComponent = BriefcaseIcon;
            break;
        case 'On-board Entertainment':
            IconComponent = TvIcon;
            break;
        case 'Safety Briefing':
            IconComponent = ShieldCheckIcon;
            break;
        default:
            return null;
    }
    
    if (withText) {
        return (
            <div className={containerClass}>
                <IconComponent className={iconClass} />
                <span className="text-sm mt-2 text-gray-700 dark:text-gray-300">{text}</span>
            </div>
        );
    }
    return <IconComponent className={iconClass} title={text} />;
};


interface CompanyProfilePageProps {
  company: { id: string, name: string; logoText: string };
  onSelectTrip: (from?: string, to?: string) => void;
}

const PhotoViewerModal: React.FC<{ images: string[], startIndex: number, onClose: () => void }> = ({ images, startIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(startIndex);

    const nextImage = () => setCurrentIndex(prev => (prev + 1) % images.length);
    const prevImage = () => setCurrentIndex(prev => (prev - 1 + images.length) % images.length);

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/30 transition-colors z-20">
                <XIcon className="w-6 h-6" />
            </button>
            <div className="relative w-full max-w-4xl" onClick={e => e.stopPropagation()}>
                <img src={images[currentIndex]} alt="Company gallery" className="max-h-[85vh] w-auto mx-auto rounded-lg shadow-2xl" />
                <button onClick={prevImage} className="absolute left-0 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white rounded-full hover:bg-white/30 transition-colors ml-2">
                    <ChevronRightIcon className="w-6 h-6 transform rotate-180" />
                </button>
                <button onClick={nextImage} className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white rounded-full hover:bg-white/30 transition-colors mr-2">
                    <ChevronRightIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

const CompanyProfilePage: React.FC<CompanyProfilePageProps> = ({ company, onSelectTrip }) => {
  const [selectedBus, setSelectedBus] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [viewingPhotoIndex, setViewingPhotoIndex] = useState<number | null>(null);
  const [galleryFilter, setGalleryFilter] = useState('all');

  const data = mockCompanyData[company.id] || defaultCompanyData;
  const averageRating = data.reviews.length > 0 ? data.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / data.reviews.length : 0;
  
  const uniqueFromLocations = useMemo(() => [...new Set(data.routes.map((r: any) => r.from))], [data.routes]);
  const availableToLocations = useMemo(() => {
    if (!fromLocation) return [];
    return data.routes.filter((r: any) => r.from === fromLocation).map((r: any) => r.to);
  }, [fromLocation, data.routes]);
  
  const scheduleForRoute = data.schedule[`${fromLocation}-${toLocation}`] || [];

  const filteredGallery = useMemo(() => {
    if (galleryFilter === 'all') return data.gallery;
    return data.gallery.filter((img: any) => img.category === galleryFilter);
  }, [galleryFilter, data.gallery]);

  const TabButton: React.FC<{tabName: string; label: string}> = ({ tabName, label }) => (
    <button
        onClick={() => setActiveTab(tabName)}
        className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 whitespace-nowrap ${activeTab === tabName ? 'border-b-2 border-yellow-400 text-blue-600 dark:text-yellow-300' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}
    >
        {label}
    </button>
  );

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-72 bg-gray-300 dark:bg-gray-700">
        <img src={data.coverImage} alt={`${company.name} cover`} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0 w-full md:w-auto">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="w-32 h-32 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-xl border-4 border-white dark:border-gray-700">
                    <h1 className="text-5xl font-extrabold text-blue-600 dark:text-blue-400">{company.logoText}</h1>
                </div>
                <div className="text-center md:text-left pt-4 md:pt-16">
                    <h2 className="text-4xl font-bold text-gray-800 dark:text-white drop-shadow-lg">{company.name}</h2>
                    <div className="flex items-center justify-center md:justify-start space-x-2 mt-1">
                        <StarRating rating={averageRating} />
                        <span className="text-gray-600 dark:text-gray-400 text-sm">({data.reviews.length} ibitekerezo)</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="border-b border-gray-200 dark:border-gray-700 mb-8 overflow-x-auto custom-scrollbar">
                <nav className="flex space-x-4">
                    <TabButton tabName="about" label="Abo Turi Bo" />
                    <TabButton tabName="schedule" label="Jadwali y'Ingendo" />
                    <TabButton tabName="services" label="Serivisi" />
                    <TabButton tabName="promotions" label="Amashya" />
                    <TabButton tabName="reviews" label="Ibisubizo" />
                    <TabButton tabName="gallery" label="Amashusho" />
                    <TabButton tabName="fleet" label="Imodoka" />
                    <TabButton tabName="contact" label="Twandikire" />
                </nav>
            </div>
            <div className="animate-fade-in">
              {activeTab === 'about' && (
                <div className="space-y-12">
                    <div className="bg-white dark:bg-gray-800/30 p-6 rounded-lg shadow-sm border dark:border-gray-700/50">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Abo Turi Bo</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{data.description}</p>
                    </div>
                </div>
              )}
               {activeTab === 'reviews' && (
                 <div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Ibitekerezo by'Abakiriya</h3>
                    {data.reviews.length > 0 ? (
                        <div className="space-y-6">
                            {data.reviews.map((review: any, index: number) => (
                                <div key={index} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border dark:border-gray-700/50">
                                   <div className="flex items-center mb-2">
                                       <StarRating rating={review.rating} size="small" />
                                       <p className="ml-3 font-bold text-sm text-gray-800 dark:text-gray-200">{review.author}</p>
                                   </div>
                                   <p className="text-gray-600 dark:text-gray-400 text-sm italic">"{review.comment}"</p>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-gray-500 dark:text-gray-400">Nta bitekerezo biratangwa kuri iki kigo.</p>}
                </div>
              )}
              {activeTab === 'schedule' && (
                <div>
                     <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border dark:border-gray-700/50">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Shakisha Igihe cy'Urugendo</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <select value={fromLocation} onChange={e => { setFromLocation(e.target.value); setToLocation(''); }} className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400/50 focus:outline-none">
                                <option value="">-- Hitamo aho uva --</option>
                                {uniqueFromLocations.map((loc: string) => <option key={loc} value={loc}>{loc}</option>)}
                            </select>
                            <select value={toLocation} onChange={e => setToLocation(e.target.value)} disabled={!fromLocation} className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400/50 focus:outline-none disabled:opacity-50">
                                <option value="">-- Hitamo aho ujya --</option>
                                {availableToLocations.map((loc: string) => <option key={loc} value={loc}>{loc}</option>)}
                            </select>
                        </div>
                        <div className="space-y-4">
                            {fromLocation && toLocation && scheduleForRoute.length > 0 ? (
                                scheduleForRoute.map((trip: any, index: number) => (
                                    <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                                        <div className="flex items-center space-x-4">
                                            <ClockIcon className="w-6 h-6 text-blue-500" />
                                            <div>
                                                <p className="font-bold text-lg dark:text-white">{trip.time} <ArrowRightIcon className="w-4 h-4 inline mx-1"/> {trip.arrival}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{trip.bus}</p>
                                            </div>
                                        </div>
                                        <div className="text-lg font-bold text-green-600 dark:text-green-400">{trip.price}</div>
                                        <button onClick={() => onSelectTrip(fromLocation, toLocation)} className="px-4 py-2 text-sm font-semibold rounded-md bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#0033A0] hover:from-yellow-500 hover:to-yellow-600 transition-all">Gura Itike</button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-4">Hitamo urugendo kugira ngo ubone amasaha ahari.</p>
                            )}
                        </div>
                     </div>
                </div>
              )}
               {activeTab === 'promotions' && (
                <div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Amashya Ariho</h3>
                    {data.promotions.length > 0 ? (
                        <div className="space-y-6">
                            {data.promotions.map((promo: any) => (
                                <div key={promo.id} className="bg-gradient-to-r from-yellow-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/20 p-6 rounded-lg border-l-4 border-yellow-400">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-800 dark:text-white flex items-center"><TagIcon className="w-5 h-5 mr-2 text-yellow-500"/>{promo.title}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{promo.description}</p>
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Birangira: {promo.expiryDate}</div>
                                    </div>
                                    <div className="mt-4 flex items-center space-x-4">
                                        <div className="font-mono text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 px-3 py-1 rounded-md border-2 border-dashed border-blue-300 dark:border-blue-700">
                                            {promo.code}
                                        </div>
                                        <button onClick={() => navigator.clipboard.writeText(promo.code).then(() => alert('Code copied!'))} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">Koporora Kode</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-gray-500 dark:text-gray-400">Nta mashya ariho ubu.</p>}
                </div>
              )}
              {activeTab === 'fleet' && (
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Imodoka Zacu</h3>
                  {data.fleet.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {data.fleet.map((bus: any) => (
                            <button key={bus.id} onClick={() => setSelectedBus(bus)} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform duration-300 text-left group border dark:border-gray-700/50 hover:shadow-yellow-400/20">
                                <div className="relative h-40">
                                    <img src={bus.image} alt={bus.name} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-4 text-white">
                                        <h4 className="font-bold text-lg">{bus.name}</h4>
                                        <p className="text-sm text-gray-200">Imyanya: {bus.capacity}</p>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="px-4 py-2 bg-white text-gray-800 text-sm font-bold rounded-full">Reba Ibindi</span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h5 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold mb-3">Ibyiza by'imbere</h5>
                                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                                        {bus.amenities.length > 0 ? bus.amenities.map((amenity: string) => (
                                            <AmenityIcon key={amenity} amenity={amenity} />
                                        )) : <p className="text-sm text-gray-500">Nta byiza by'imbere byihariye.</p>}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                  ) : <p className="text-gray-500 dark:text-gray-400">Amakuru y'imodoka ntazwi.</p>}
                </div>
              )}
               {activeTab === 'gallery' && (
                <div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Amashusho</h3>
                    <div className="flex items-center space-x-2 mb-6 border-b dark:border-gray-700 pb-3">
                        <button onClick={() => setGalleryFilter('all')} className={`px-3 py-1 text-sm rounded-full ${galleryFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Byose</button>
                        <button onClick={() => setGalleryFilter('interior')} className={`px-3 py-1 text-sm rounded-full ${galleryFilter === 'interior' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Bisi Imbere</button>
                        <button onClick={() => setGalleryFilter('exterior')} className={`px-3 py-1 text-sm rounded-full ${galleryFilter === 'exterior' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Hanze</button>
                        <button onClick={() => setGalleryFilter('staff')} className={`px-3 py-1 text-sm rounded-full ${galleryFilter === 'staff' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Abakozi</button>
                    </div>
                    {filteredGallery.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredGallery.map((img: any, index: number) => (
                                <button key={index} onClick={() => setViewingPhotoIndex(data.gallery.findIndex(g => g.src === img.src))} className="aspect-square rounded-lg overflow-hidden group relative">
                                    <img src={img.src} alt={`Gallery image ${index + 1}`} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <CameraIcon className="w-8 h-8 text-white" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : <p className="text-gray-500 dark:text-gray-400">Nta mashusho ahari muri iki cyiciro.</p>}
                </div>
              )}
              {activeTab === 'services' && (
                <div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Serivisi Zindi</h3>
                    {data.services.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {data.services.map((service: any) => (
                                <div key={service.name} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border dark:border-gray-700/50 flex items-center space-x-4">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                        <service.icon className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg dark:text-white">{service.name}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{service.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-gray-500 dark:text-gray-400">Iki kigo ntigifite izindi serivisi zizwi.</p>}
                </div>
              )}
               {activeTab === 'contact' && (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border dark:border-gray-700/50">
                    <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Ohereza ubutumwa</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Ifite ikibazo? Ubutumwa bwawe buzoherezwa kuri <strong className="text-blue-600 dark:text-blue-400">{data.contactEmail}</strong>
                    </p>
                    <form className="space-y-4" onSubmit={e => {e.preventDefault(); alert('Ubutumwa bwawe bwoherejwe!')}}>
                        <div>
                            <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amazina yawe</label>
                            <input type="text" id="contact-name" required className="w-full p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div>
                            <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Imeri yawe</label>
                            <input type="email" id="contact-email" required className="w-full p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div>
                            <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ubutumwa</label>
                            <textarea id="contact-message" rows={4} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600"></textarea>
                        </div>
                         <button type="submit" className="w-full flex items-center justify-center p-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#0033A0] font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-md">
                            Ohereza <PaperAirplaneIcon className="w-5 h-5 ml-2" />
                        </button>
                    </form>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-24 space-y-6">
                 <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 shadow-lg border dark:border-gray-700/50">
                    <h4 className="text-xl font-bold mb-4 dark:text-white">Amakuru y'Ikigo</h4>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-start">
                            <MapPinIcon className="w-5 h-5 mr-3 mt-1 flex-shrink-0 text-gray-400" /> 
                            <span className="text-gray-700 dark:text-gray-300">{data.address}</span>
                        </li>
                        <li className="flex items-start">
                            <ClockIcon className="w-5 h-5 mr-3 mt-1 flex-shrink-0 text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">{data.hours}</span>
                        </li>
                        <li className="flex items-start">
                            <EnvelopeIcon className="w-5 h-5 mr-3 mt-1 flex-shrink-0 text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">{data.contactEmail}</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 shadow-lg border dark:border-gray-700/50">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <BusIcon className="w-8 h-8 mx-auto text-blue-500 mb-1" />
                            <p className="text-xl font-bold dark:text-white">{data.stats.fleet}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Imodoka</p>
                        </div>
                        <div>
                            <UsersIcon className="w-8 h-8 mx-auto text-blue-500 mb-1" />
                            <p className="text-xl font-bold dark:text-white">{data.stats.passengers}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Abagenzi</p>
                        </div>
                        <div>
                            <MapIcon className="w-8 h-8 mx-auto text-blue-500 mb-1" />
                            <p className="text-xl font-bold dark:text-white">{data.stats.routes}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Ingendo</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 shadow-lg border dark:border-gray-700/50">
                    <h4 className="text-xl font-bold mb-4 border-b pb-3 dark:border-gray-700 dark:text-white">Ingendo Zikunzwe</h4>
                    {data.routes.length > 0 ? (
                        <ul className="space-y-3">
                            {data.routes.slice(0, 3).map((route: any, index: number) => (
                                <li key={index}>
                                    <button onClick={() => { setActiveTab('schedule'); setFromLocation(route.from); setToLocation(route.to); }} className="w-full text-left p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex justify-between items-center group">
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-gray-200">{route.from} - {route.to}</p>
                                            <p className="text-sm text-green-600 dark:text-green-400 font-bold">{route.price}</p>
                                        </div>
                                        <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-gray-500 dark:text-gray-400 text-sm">Nta ngendo zizwi.</p>}
                </div>
            </div>
          </aside>
        </div>
      </div>
      {selectedBus && <FleetDetailModal bus={selectedBus} onClose={() => setSelectedBus(null)} />}
      {viewingPhotoIndex !== null && <PhotoViewerModal images={data.gallery.map(g => g.src)} startIndex={viewingPhotoIndex} onClose={() => setViewingPhotoIndex(null)} />}
    </div>
  );
};

export default CompanyProfilePage;
