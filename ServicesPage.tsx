
import React, { useState, FormEvent } from 'react';
import { Page } from './types';
import { ArchiveBoxIcon, BusIcon, BriefcaseIcon, MapIcon, ShieldCheckIcon, CreditCardIcon, ChevronRightIcon, TruckIcon, QuestionMarkCircleIcon } from './components/icons';
import PackageTrackingModal from './PackageTrackingModal';
import { useLanguage } from './contexts/LanguageContext';
import Modal from './components/Modal';

// --- Internal Components for Service Modals ---

const CorporateTravelForm = ({ onSave, t }) => (
    <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">{t('corporate_modal_desc')}</p>
        <div><label className="block text-sm font-medium">{t('corporate_modal_company')}</label><input type="text" className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700" required /></div>
        <div><label className="block text-sm font-medium">{t('corporate_modal_contact_name')}</label><input type="text" className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700" required /></div>
        <div><label className="block text-sm font-medium">{t('corporate_modal_contact_email')}</label><input type="email" className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700" required /></div>
        <div className="flex justify-end pt-4"><button type="submit" className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg">{t('corporate_modal_submit')}</button></div>
    </form>
);

const TourPackagesView = ({ t }) => (
    <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
        <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700/50">
            <h4 className="font-bold text-lg">{t('tours_modal_goriila_title')}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('tours_modal_goriila_desc')}</p>
            <button className="text-sm font-semibold text-blue-600 mt-2">{t('tours_modal_inquire')}</button>
        </div>
        <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700/50">
            <h4 className="font-bold text-lg">{t('tours_modal_safari_title')}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('tours_modal_safari_desc')}</p>
            <button className="text-sm font-semibold text-blue-600 mt-2">{t('tours_modal_inquire')}</button>
        </div>
    </div>
);

const TravelInsuranceForm = ({ onSave, t }) => (
    <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">{t('insurance_modal_desc')}</p>
        <div><label className="block text-sm font-medium">{t('insurance_modal_travelers')}</label><input type="number" defaultValue="1" className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700" required /></div>
        <div><label className="block text-sm font-medium">{t('insurance_modal_start_date')}</label><input type="date" className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700" required /></div>
        <div className="flex justify-end pt-4"><button type="submit" className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg">{t('insurance_modal_submit')}</button></div>
    </form>
);

const GiftCardForm = ({ onSave, t }) => (
    <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">{t('gifts_modal_desc')}</p>
        <div><label className="block text-sm font-medium">{t('gifts_modal_amount')}</label><select className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700"><option>5,000</option><option>10,000</option><option>25,000</option></select></div>
        <div><label className="block text-sm font-medium">{t('gifts_modal_recipient_email')}</label><input type="email" className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700" required /></div>
        <div className="flex justify-end pt-4"><button type="submit" className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg">{t('gifts_modal_submit')}</button></div>
    </form>
);


interface ServicesPageProps {
    onNavigate: (page: Page, data?: any) => void;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
    const { t } = useLanguage();
    const [trackingId, setTrackingId] = useState('');
    const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
    const [activeService, setActiveService] = useState<any>(null);
    
    const allServices = [
        { id: 'packageDelivery', title: t('service_package_title'), description: t('service_package_desc'), icon: ArchiveBoxIcon, page: 'packageDelivery', isFeatured: true },
        { id: 'busCharter', title: t('service_charter_title'), description: t('service_charter_desc'), icon: BusIcon, page: 'busCharter', isFeatured: true },
        { id: 'lostAndFound', title: t('service_lost_title'), description: t('service_lost_desc'), icon: QuestionMarkCircleIcon, page: 'lostAndFound', isFeatured: false },
        { id: 'corporateTravel', title: t('service_corporate_title'), description: t('service_corporate_desc'), icon: BriefcaseIcon, page: 'corporateTravel' },
        { id: 'tourPackages', title: t('service_tours_title'), description: t('service_tours_desc'), icon: MapIcon, page: 'tourPackages' },
        { id: 'travelInsurance', title: t('service_insurance_title'), description: t('service_insurance_desc'), icon: ShieldCheckIcon, page: 'travelInsurance' },
        { id: 'giftCards', title: t('service_gifts_title'), description: t('service_gifts_desc'), icon: CreditCardIcon, page: 'giftCards' },
    ];

    const handleTrackPackage = (e: FormEvent) => {
        e.preventDefault();
        if (trackingId) {
            setIsTrackingModalOpen(true);
        }
    };
    
    const handleServiceClick = (service: typeof allServices[0]) => {
        if (['packageDelivery', 'busCharter', 'lostAndFound'].includes(service.id)) {
            onNavigate(service.page as Page);
        } else {
            setActiveService(service);
        }
    };
    
    const renderServiceModalContent = () => {
        if (!activeService) return null;
        switch (activeService.id) {
            case 'corporateTravel': return <CorporateTravelForm t={t} onSave={() => { alert(t('alert_inquiry_sent')); setActiveService(null); }} />;
            case 'tourPackages': return <TourPackagesView t={t} />;
            case 'travelInsurance': return <TravelInsuranceForm t={t} onSave={() => { alert(t('alert_quote_ready', {amount: '5,000 RWF'})); setActiveService(null); }} />;
            case 'giftCards': return <GiftCardForm t={t} onSave={() => { alert(t('alert_gift_sent')); setActiveService(null); }} />;
            default: return null;
        }
    };

    return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <header className="bg-white dark:bg-gray-800/50 shadow-sm pt-12 pb-8">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{t('services_title')}</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                    {t('services_subtitle')}
                </p>
            </div>
        </header>
        <main className="container mx-auto px-6 py-12">
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-12 max-w-2xl mx-auto">
                <h2 className="text-xl font-bold dark:text-white mb-2 flex items-center"><TruckIcon className="w-6 h-6 mr-3 text-blue-500" /> {t('services_track_title')}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('services_track_desc')}</p>
                <form onSubmit={handleTrackPackage} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input type="text" value={trackingId} onChange={e => setTrackingId(e.target.value.toUpperCase())} placeholder={t('services_track_placeholder')} className="flex-grow p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">{t('services_track_button')}</button>
                </form>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allServices.map(service => (
                    <button key={service.id} onClick={() => handleServiceClick(service)} className={`w-full p-6 rounded-xl text-left flex items-start space-x-4 group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${service.isFeatured ? 'bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-2 border-blue-200 dark:border-blue-700' : 'bg-white dark:bg-gray-800'}`}>
                        <div className={`flex-shrink-0 p-3 rounded-lg ${service.isFeatured ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-gray-100 dark:bg-gray-700'}`}>
                            <service.icon className={`w-8 h-8 ${service.isFeatured ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300'}`} />
                        </div>
                        <div className="flex-grow">
                            <p className="font-bold text-lg text-gray-800 dark:text-white">{service.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{service.description}</p>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-gray-400 flex-shrink-0 transform transition-transform group-hover:translate-x-1 mt-1" />
                    </button>
                ))}
            </div>
        </main>
        {isTrackingModalOpen && <PackageTrackingModal trackingId={trackingId} onClose={() => setIsTrackingModalOpen(false)} />}
        {activeService && (
            <Modal isOpen={!!activeService} onClose={() => setActiveService(null)} title={activeService.title}>
                {renderServiceModalContent()}
            </Modal>
        )}
    </div>
  );
};

export default ServicesPage;
