import React, { useState, FormEvent } from 'react';
import { BusIcon, ArrowRightIcon, BriefcaseIcon, MapIcon, SparklesIcon, TruckIcon, ArchiveBoxIcon, ShieldCheckIcon, CreditCardIcon, PaperAirplaneIcon, CheckCircleIcon } from './components/icons';

const services = [
    {
      id: 'bus-charter',
      title: 'Kodesha Imodoka',
      description: 'Tegura urugendo rwihariye rw\'itsinda ryawe.',
      icon: BusIcon,
      details: {
          image: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?q=80&w=2070&auto=format&fit=crop',
          fullDescription: 'Tegura urugendo rwihariye rw\'itsinda ryawe. Dukodesha bisi zigezweho ku birori, ingendo z\'amashuri, ubukwe, cyangwa ikindi gikorwa cyose gisaba gutwara abantu benshi. Imodoka zacu zifite ibyangombwa byose by\'ubuziranenge kandi zitwarwa n\'abashoferi b\'inararibonye kugira ngo urugendo rwawe rube intangarugero.'
      }
    },
    {
      id: 'cargo-logistics',
      title: 'Gutwara Ibintu',
      description: 'Ohereza cyangwa wakire imizigo yawe mu buryo bwizewe.',
      icon: ArchiveBoxIcon,
      details: {
          image: 'https://images.unsplash.com/photo-1587293852726-70cdb120c546?q=80&w=2070&auto=format&fit=crop',
          fullDescription: 'Ohereza cyangwa wakire imizigo yawe mu buryo bwizewe kandi bwihuse ukoresheje umuyoboro wacu wagutse mu gihugu hose. Dufata ubwoko bwose bw\'imizigo, kuva ku mapaki mato kugeza ku bintu binini.'
      }
    },
    {
      id: 'corporate-travel',
      title: 'Ingendo z\'Ubucuruzi',
      description: 'Ibisubizo byihariye ku bigo. Fasha abakozi bawe kugenda neza.',
      icon: BriefcaseIcon,
      details: {
          image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop',
          fullDescription: 'Ibisubizo byihariye ku bigo. Fasha abakozi bawe kugenda neza kandi ku giciro cyiza. Dutanga uburyo bwo kwishyura buri kwezi, gukurikirana ingendo, no guhabwa raporo zihariye.'
      }
    },
    {
      id: 'tour-packages',
      title: 'Ingendo z\'Ubukerarugendo',
      description: 'Sura ibyiza nyaburanga by\'u Rwanda. Dufite ingendo zateguwe.',
      icon: MapIcon,
      details: {
          image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=2070&auto=format&fit=crop',
          fullDescription: 'Sura ibyiza nyaburanga by\'u Rwanda. Dufite ingendo zateguwe zikugeza muri pariki n\'ahandi nyaburanga. Twagufasha gutegura urugendo rw\'umunsi umwe, weekend, cyangwa icyumweru cyose.'
      }
    },
     {
      id: 'travel-insurance',
      title: 'Ubwishingizi bw\'ingendo',
      description: 'Genda amahoro ufite ubwishingizi bwuzuye ku rugendo rwawe.',
      icon: ShieldCheckIcon,
      details: {
          image: 'https://images.unsplash.com/photo-1560523157-1d73a9e0c18a?q=80&w=2070&auto=format&fit=crop',
          fullDescription: 'Ntukagire impungenge z\'ibitagenda neza. Dufatanyije n\'ibigo by\'ubwishingizi bikomeye, dushobora kuguha ubwishingizi ku mizigo yawe, impanuka, cyangwa no guhagarika urugendo. Saba amakuru arambuye.'
      }
    },
    {
      id: 'gift-cards',
      title: 'Amakarita y\'impano',
      description: 'Tanga impano y\'urugendo. Amakarita yacu arakora ku bigo byose.',
      icon: CreditCardIcon,
       details: {
          image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=1974&auto=format&fit=crop',
          fullDescription: 'Tanga impano y\'urugendo ku nshuti n\'umuryango. Amakarita yacu y\'impano ashobora gukoreshwa mu kugura itike ku kigo icyo aricyo cyose dukorana. Hitamo amafaranga ushaka hanyuma wohereze ikarita kuri imeri y\'uwo uyihaye.'
      }
    },
];

const FormSubmitted: React.FC = () => (
    <div className="text-center py-8 flex flex-col items-center">
        <CheckCircleIcon className="w-20 h-20 text-green-500 mb-4" />
        <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">Twakiriye ubusabe bwawe!</h3>
        <p className="text-gray-600 dark:text-gray-300">Itsinda ryacu rigiye kubisuzuma, turagusubiza vuba kuri imeri yawe.</p>
    </div>
);

const ServiceForm: React.FC<{ children: React.ReactNode, onSubmit: (e: FormEvent) => void }> = ({ children, onSubmit }) => (
    <form onSubmit={onSubmit} className="space-y-4">
        {children}
        <div className="pt-4 border-t dark:border-gray-700 space-y-4">
            <h3 className="text-lg font-semibold dark:text-white">Amakuru yawe</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm dark:text-gray-300">Amazina Yuzuye</label>
                    <input type="text" className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required/>
                </div>
                <div>
                    <label className="text-sm dark:text-gray-300">Telefone</label>
                    <input type="tel" className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required/>
                </div>
            </div>
            <div>
                <label className="text-sm dark:text-gray-300">Imeri</label>
                <input type="email" className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required/>
            </div>
        </div>
        <button type="submit" className="w-full flex items-center justify-center p-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#0033A0] font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-md">
            Ohereza Ubusabe <PaperAirplaneIcon className="w-5 h-5 ml-2" />
        </button>
    </form>
);

const BusCharterService: React.FC<{ service: typeof services[0] }> = ({ service }) => {
    const [submitted, setSubmitted] = useState(false);
    if (submitted) return <FormSubmitted />;
    return (
        <div>
            <img src={service.details.image} alt={service.title} className="w-full h-56 object-cover rounded-lg mb-6"/>
            <h2 className="text-3xl font-bold mb-2 dark:text-white">{service.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{service.details.fullDescription}</p>
             <ServiceForm onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="text-sm dark:text-gray-300">Uva</label><input type="text" placeholder="e.g., Kigali" className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required/></div>
                    <div><label className="text-sm dark:text-gray-300">Ujya</label><input type="text" placeholder="e.g., Rubavu" className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required/></div>
                    <div><label className="text-sm dark:text-gray-300">Itariki yo Kugenda</label><input type="date" className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required/></div>
                    <div><label className="text-sm dark:text-gray-300">Umubare w'abantu</label><input type="number" min="10" placeholder="e.g., 25" className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required/></div>
                </div>
            </ServiceForm>
        </div>
    );
};

const CargoService: React.FC<{ service: typeof services[0] }> = ({ service }) => {
    const [submitted, setSubmitted] = useState(false);
    const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

    const handleEstimate = (e: FormEvent) => {
        e.preventDefault();
        setEstimatedPrice(Math.floor(Math.random() * 5000) + 1000);
    };
    
    if (submitted) return <FormSubmitted />;
    return (
        <div>
            <img src={service.details.image} alt={service.title} className="w-full h-56 object-cover rounded-lg mb-6"/>
            <h2 className="text-3xl font-bold mb-2 dark:text-white">{service.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{service.details.fullDescription}</p>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Gereranya Igiciro</h3>
                <form onSubmit={handleEstimate} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                    <div><label className="text-sm dark:text-gray-300">Ibiro (kg)</label><input type="number" min="1" placeholder="5" className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" /></div>
                    <div><label className="text-sm dark:text-gray-300">Urugendo</label><input type="text" placeholder="Kigali - Huye" className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" /></div>
                    <button type="submit" className="w-full p-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">Gereranya</button>
                </form>
                {estimatedPrice && <p className="text-center font-bold text-lg mt-4 dark:text-white">Igiciro giteganyijwe: <span className="text-green-600">{new Intl.NumberFormat('fr-RW').format(estimatedPrice)} RWF</span></p>}
            </div>
            <ServiceForm onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                <div>
                    <label className="text-sm dark:text-gray-300">Icyo aribyo</label>
                    <input type="text" placeholder="e.g., Ikarito, Ibikoresho" className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required/>
                </div>
            </ServiceForm>
        </div>
    );
};

const DefaultServiceView: React.FC<{ service: typeof services[0] }> = ({ service }) => {
    const [submitted, setSubmitted] = useState(false);
    if (submitted) return <FormSubmitted />;

    return (
        <div>
            <img src={service.details.image} alt={service.title} className="w-full h-56 object-cover rounded-lg mb-6"/>
            <h2 className="text-3xl font-bold mb-2 dark:text-white">{service.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{service.details.fullDescription}</p>
            <ServiceForm onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                 <div>
                    <label className="text-sm dark:text-gray-300">Ubutumwa</label>
                    <textarea rows={4} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" placeholder="Tuvugishe birambuye ku byo ukenera..." required></textarea>
                </div>
            </ServiceForm>
        </div>
    );
};


const ServicesPage: React.FC = () => {
    const [selectedServiceId, setSelectedServiceId] = useState(services[0].id);
    const selectedService = services.find(s => s.id === selectedServiceId);

    const renderServiceContent = () => {
        if (!selectedService) return null;

        switch (selectedService.id) {
            case 'bus-charter':
                return <BusCharterService service={selectedService} />;
            case 'cargo-logistics':
                return <CargoService service={selectedService} />;
            default:
                return <DefaultServiceView service={selectedService} />;
        }
    };
  
    return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <header className="bg-white dark:bg-gray-800/50 shadow-sm pt-12 pb-8">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Serivisi zacu zidasanzwe</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                    Byinshi birenze amatike. Turi hano kugira ngo urugendo rwawe rwose rube intangarugero.
                </p>
            </div>
        </header>
        <main className="container mx-auto px-6 py-12">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                <aside className="lg:w-1/4 xl:w-1/5">
                    <nav className="sticky top-24 space-y-2">
                        {services.map(service => (
                            <button
                                key={service.id}
                                onClick={() => setSelectedServiceId(service.id)}
                                className={`w-full flex items-center p-3 rounded-lg text-left transition-all duration-200 group ${
                                    selectedServiceId === service.id 
                                    ? 'bg-blue-600 text-white shadow-lg' 
                                    : 'bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700/50'
                                }`}
                            >
                                <service.icon className={`w-7 h-7 mr-4 flex-shrink-0 transition-colors ${selectedServiceId === service.id ? 'text-white' : 'text-blue-500'}`} />
                                <div>
                                    <p className={`font-semibold ${selectedServiceId === service.id ? 'text-white' : 'text-gray-800 dark:text-white'}`}>{service.title}</p>
                                    <p className={`text-xs ${selectedServiceId === service.id ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>{service.description}</p>
                                </div>
                            </button>
                        ))}
                    </nav>
                </aside>

                <section className="lg:w-3/4 xl:w-4/5">
                    <div key={selectedServiceId} className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in">
                        {renderServiceContent()}
                    </div>
                </section>
            </div>
        </main>
    </div>
  );
};

export default ServicesPage;
