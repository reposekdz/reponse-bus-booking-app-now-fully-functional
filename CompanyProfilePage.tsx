import React from 'react';
import { ClockIcon, MapPinIcon, ChevronRightIcon, BusIcon, WifiIcon, AcIcon, PowerIcon } from './components/icons';

const mockCompanyData: { [key: string]: any } = {
  ritco: {
    description: "RITCO ni ikigo cya Leta gishinzwe gutwara abantu mu buryo bwa rusange, kizwiho kugira imodoka nini kandi zigezweho zitwara abantu mu gihugu hose.",
    fleet: [
      { name: 'Yutong Grand', capacity: 65, image: 'https://images.pexels.com/photos/18413861/pexels-photo-18413861/free-photo-of-a-bus-is-driving-down-a-road-in-the-mountains.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', amenities: ['AC', 'Charging'] },
      { name: 'Scania Marcopolo', capacity: 70, image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2048&auto=format&fit=crop', amenities: ['AC'] },
    ],
    routes: [ { from: 'Kigali', to: 'Huye', price: '3,000 FRW' }, { from: 'Kigali', to: 'Nyungwe', price: '7,000 FRW' } ]
  },
  volcano: {
    description: "Volcano Express ni kimwe mu bigo bikunzwe cyane mu Rwanda, kizwiho serivisi nziza, isuku, no kugera ku gihe. Bakorera mu mihanda myinshi ikomeye.",
    fleet: [
      { name: 'Coaster Bus', capacity: 30, image: 'https://images.pexels.com/photos/385997/pexels-photo-385997.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', amenities: ['WiFi', 'AC', 'Charging'] },
      { name: 'Yutong Explorer', capacity: 55, image: 'https://images.pexels.com/photos/2418491/pexels-photo-2418491.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', amenities: ['AC', 'Charging'] },
    ],
    routes: [ { from: 'Kigali', to: 'Rubavu', price: '4,500 FRW' }, { from: 'Kigali', to: 'Musanze', price: '3,500 FRW' } ]
  },
  // Add other companies if needed
};

const defaultCompanyData = {
    description: "Nta makuru ahagije kuri iki kigo araboneka. Tuzayongeramo vuba.",
    fleet: [],
    routes: []
}

const AmenityIcon: React.FC<{ amenity: string }> = ({ amenity }) => {
    const iconClass = "w-4 h-4 text-gray-500 dark:text-gray-400";
    if (amenity === 'WiFi') return <WifiIcon className={iconClass} />;
    if (amenity === 'AC') return <AcIcon className={iconClass} />;
    if (amenity === 'Charging') return <PowerIcon className={iconClass} />;
    return null;
};

interface CompanyProfilePageProps {
  company: { id: string, name: string; logoText: string };
  onSelectTrip: () => void;
}

const CompanyProfilePage: React.FC<CompanyProfilePageProps> = ({ company, onSelectTrip }) => {
  const data = mockCompanyData[company.id] || defaultCompanyData;

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-blue-500 to-green-500 dark:from-blue-800 dark:to-green-800">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1616372819235-9b2e1577a2d4?q=80&w=2070&auto=format&fit=crop')" }}></div>
        <div className="container mx-auto px-6 h-full flex items-end pb-8">
            <div className="flex items-center space-x-6">
                <div className="w-28 h-28 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-xl border-4 border-white dark:border-gray-700">
                    <h1 className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">{company.logoText}</h1>
                </div>
                <div>
                    <h2 className="text-4xl font-bold text-white shadow-md">{company.name}</h2>
                    <p className="text-lg text-yellow-300">Urugendo Rwiza Hamwe Natwe</p>
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* About Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Abo Turi Bo</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{data.description}</p>
            </div>
            
            {/* Fleet Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Imodoka Zacu</h3>
              {data.fleet.length > 0 ? (
                <div className="flex space-x-6 pb-4 overflow-x-auto custom-scrollbar -mx-6 px-6">
                    {data.fleet.map((bus: any, index: number) => (
                        <div key={index} className="flex-shrink-0 w-72 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform">
                            <img src={bus.image} alt={bus.name} className="w-full h-40 object-cover" />
                            <div className="p-4">
                                <h4 className="font-bold">{bus.name}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Imyanya: {bus.capacity}</p>
                                <div className="flex space-x-3 mt-2">
                                    {bus.amenities.map((amenity: string) => <AmenityIcon key={amenity} amenity={amenity} />)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
              ) : <p className="text-gray-500 dark:text-gray-400">Amakuru y'imodoka ntazwi.</p>}
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 sticky top-24 shadow-lg">
                <h4 className="text-xl font-bold mb-4 border-b pb-3 dark:border-gray-700 dark:text-white">Ingendo Zikunzwe</h4>
                {data.routes.length > 0 ? (
                    <ul className="space-y-3">
                        {data.routes.map((route: any, index: number) => (
                            <li key={index}>
                                <button onClick={onSelectTrip} className="w-full text-left p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex justify-between items-center group">
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
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfilePage;