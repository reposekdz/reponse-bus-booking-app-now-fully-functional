import React, { useState } from 'react';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, CalendarIcon, BriefcaseIcon, ShieldCheckIcon, ClipboardDocumentListIcon, ChartPieIcon, CameraIcon } from './components/icons';

const StatCard = ({ label, value, icon }) => (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl flex items-center space-x-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
            {React.cloneElement(icon, { className: "w-6 h-6 text-blue-500"})}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="font-bold text-xl dark:text-white">{value}</p>
        </div>
    </div>
);

const getDocumentStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    // To avoid timezone issues, compare dates only
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    
    const daysUntilExpiry = (expiry.getTime() - today.getTime()) / (1000 * 3600 * 24);

    if (daysUntilExpiry < 0) {
        return { text: 'Expired', color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' };
    }
    if (daysUntilExpiry <= 30) {
        return { text: 'Expiring Soon', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' };
    }
    return { text: 'Valid', color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' };
};


interface DriverProfilePageProps {
    driver: any;
}

const DriverProfilePage: React.FC<DriverProfilePageProps> = ({ driver }) => {
    const [activeTab, setActiveTab] = useState('details');

    if (!driver || !driver.name) {
        return <div className="p-8 text-center dark:text-white">Loading driver data...</div>;
    }

    const memberSince = driver.joinDate ? new Date(driver.joinDate).toLocaleString('default', { month: 'long', year: 'numeric' }) : 'N/A';
    
    const { performance, tripHistory, documents } = driver;

    return (
        <div className="bg-gray-100/50 dark:bg-gray-900/50 min-h-full py-12">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="h-40 bg-blue-600 relative group">
                        <img src={driver.coverUrl || 'https://images.unsplash.com/photo-1533104816-588941750c11?q=80&w=1974&auto=format&fit=crop'} alt="Cover" className="w-full h-full object-cover"/>
                        <div className="absolute inset-0 bg-black/30"></div>
                         <button className="absolute top-2 right-2 flex items-center text-xs bg-black/40 text-white px-2 py-1 rounded-full hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                            <CameraIcon className="w-4 h-4 mr-1"/> Edit Cover
                        </button>
                    </div>
                    <div className="px-6 pb-6">
                        <div className="flex flex-col sm:flex-row items-center -mt-16">
                            <div className="relative group">
                                <img src={driver.avatarUrl} alt={driver.name} className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover"/>
                                <button className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <CameraIcon className="w-6 h-6"/>
                                </button>
                            </div>
                            <div className="sm:ml-6 mt-4 sm:mt-16 text-center sm:text-left">
                                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{driver.name}</h1>
                                <p className="text-gray-600 dark:text-gray-400">{driver.company}</p>
                                <div className="mt-2 flex justify-center sm:justify-start flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center"><MapPinIcon className="w-4 h-4 mr-1.5"/>{driver.location || 'Kigali'}</span>
                                    <span className="flex items-center"><CalendarIcon className="w-4 h-4 mr-1.5"/>Joined {memberSince}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 border-y dark:border-gray-700">
                        <StatCard label="On-Time Rate" value={`${performance.onTimeRate}%`} icon={<ChartPieIcon />} />
                        <StatCard label="Avg. Rating" value={`${performance.averageRating}/5`} icon={<ChartPieIcon />} />
                        <StatCard label="Total Trips" value={performance.totalTrips} icon={<ChartPieIcon />} />
                        <StatCard label="Safety Score" value={`${performance.safetyScore}%`} icon={<ChartPieIcon />} />
                    </div>

                    <div className="p-6">
                        <div className="border-b dark:border-gray-700 mb-4">
                            <nav className="flex space-x-6">
                                <button onClick={() => setActiveTab('details')} className={`py-2 px-1 text-sm font-semibold ${activeTab === 'details' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Details</button>
                                <button onClick={() => setActiveTab('history')} className={`py-2 px-1 text-sm font-semibold ${activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Trip History</button>
                                <button onClick={() => setActiveTab('documents')} className={`py-2 px-1 text-sm font-semibold ${activeTab === 'documents' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Documents</button>
                            </nav>
                        </div>
                        
                        {activeTab === 'details' && (
                            <div className="space-y-6 animate-fade-in">
                                {driver.bio && (
                                    <div>
                                        <h3 className="font-bold text-lg dark:text-white mb-2">Bio</h3>
                                        <p className="text-gray-700 dark:text-gray-300 text-sm italic">"{driver.bio}"</p>
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-lg dark:text-white mb-2">Contact Information</h3>
                                    <div className="text-gray-700 dark:text-gray-300 space-y-2 text-sm">
                                         <p className="flex items-center"><PhoneIcon className="w-4 h-4 mr-2 text-gray-400"/> {driver.phone}</p>
                                         <p className="flex items-center"><EnvelopeIcon className="w-4 h-4 mr-2 text-gray-400"/> {driver.email}</p>
                                        <p className="flex items-center"><BriefcaseIcon className="w-4 h-4 mr-2 text-gray-400"/> Assigned Bus: {driver.assignedBusId}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'history' && (
                             <div className="space-y-3 animate-fade-in max-h-96 overflow-y-auto custom-scrollbar">
                                {tripHistory.map((trip: any) => (
                                    <div key={trip.id} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-sm dark:text-white">{trip.route}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(trip.date).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${trip.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{trip.status}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {activeTab === 'documents' && (
                            <div className="space-y-3 animate-fade-in">
                                {documents.map((doc: any) => {
                                    const status = getDocumentStatus(doc.expiry);
                                    return (
                                        <div key={doc.id} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg flex justify-between items-center">
                                            <div className="flex items-center space-x-3">
                                                <ClipboardDocumentListIcon className="w-6 h-6 text-gray-400"/>
                                                <div>
                                                    <p className="font-semibold text-sm dark:text-white">{doc.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Expires: {new Date(doc.expiry).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className={`px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                                                {status.text}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverProfilePage;