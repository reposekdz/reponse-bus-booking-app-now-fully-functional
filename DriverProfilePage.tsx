import React, { useState, useRef, ChangeEvent, useMemo } from 'react';
import { Page } from './App';
import { SunIcon, MoonIcon, CameraIcon, PencilSquareIcon, EnvelopeIcon, PhoneIcon, BriefcaseIcon, StarIcon, TruckIcon } from './components/icons';

interface DriverProfilePageProps {
    driver: any;
    onUpdateProfile: (updatedDriver: any) => void;
    onLogout: () => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    navigate: (page: Page) => void;
}

const StatCard: React.FC<{ title: string, value: string | number, icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl flex items-center space-x-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{value}</p>
        </div>
    </div>
);

const DriverProfilePage: React.FC<DriverProfilePageProps> = ({ driver, onUpdateProfile, onLogout, theme, setTheme, navigate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: driver.name,
        phone: driver.phone,
        email: driver.email,
        avatarUrl: driver.avatarUrl,
        coverUrl: driver.coverUrl,
    });
    const [avatarPreview, setAvatarPreview] = useState(driver.avatarUrl);
    const [coverPreview, setCoverPreview] = useState(driver.coverUrl);

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    const yearsOfService = useMemo(() => {
        if (!driver.joinDate) return 'N/A';
        const start = new Date(driver.joinDate);
        const now = new Date();
        let years = now.getFullYear() - start.getFullYear();
        const m = now.getMonth() - start.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < start.getDate())) {
            years--;
        }
        return years > 0 ? `${years} years` : 'Less than a year';
    }, [driver.joinDate]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (type === 'avatar') setAvatarPreview(reader.result as string);
                if (type === 'cover') setCoverPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = () => {
        onUpdateProfile({
            ...driver,
            ...formData,
            avatarUrl: avatarPreview,
            coverUrl: coverPreview,
        });
        setIsEditing(false);
    };

    return (
        <div className={`min-h-screen flex flex-col ${theme} bg-gray-100 dark:bg-gray-900`}>
            <header className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm flex items-center justify-between px-6 border-b dark:border-gray-700/50 sticky top-0 z-10">
                <div className="font-bold text-gray-800 dark:text-white">My Profile</div>
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('driverDashboard')} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">Back to Dashboard</button>
                    <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400">{theme === 'light' ? <MoonIcon className="w-6 h-6"/> : <SunIcon className="w-6 h-6"/>}</button>
                    <button onClick={onLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Logout</button>
                </div>
            </header>
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="relative mb-8">
                        <div className="h-48 md:h-64 bg-gray-300 dark:bg-gray-700 rounded-xl overflow-hidden group">
                            <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                            {isEditing && (
                                <button onClick={() => coverInputRef.current?.click()} className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <CameraIcon className="w-8 h-8" />
                                    <span className="text-sm font-semibold mt-1">Upload Cover Photo</span>
                                </button>
                            )}
                        </div>
                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                            <div className="relative group">
                                <img src={avatarPreview} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg" />
                                {isEditing && (
                                    <button onClick={() => avatarInputRef.current?.click()} className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity text-center">
                                        <CameraIcon className="w-6 h-6" />
                                        <span className="text-xs font-semibold mt-1">Upload Avatar</span>
                                    </button>
                                )}
                            </div>
                        </div>
                        <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={e => handleFileChange(e, 'cover')} />
                        <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={e => handleFileChange(e, 'avatar')} />
                    </div>

                    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg mt-20">
                        <div className="flex justify-end mb-4">
                            {!isEditing ? (
                                <button onClick={() => setIsEditing(true)} className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    <PencilSquareIcon className="w-5 h-5" />
                                    <span>Edit Profile</span>
                                </button>
                            ) : (
                                <div className="flex space-x-2">
                                    <button onClick={() => { setIsEditing(false); setAvatarPreview(formData.avatarUrl); setCoverPreview(formData.coverUrl); }} className="px-4 py-2 text-sm font-semibold border rounded-lg dark:border-gray-600">Cancel</button>
                                    <button onClick={handleSaveChanges} className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700">Save Changes</button>
                                </div>
                            )}
                        </div>

                        <div className="text-center mb-6">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="text-3xl font-bold text-center bg-transparent border-b-2 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:text-white"
                                />
                            ) : (
                                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{formData.name}</h1>
                            )}
                        </div>

                        <div className="max-w-md mx-auto space-y-4 text-center">
                           <div className="flex items-center justify-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <PhoneIcon className="w-5 h-5 text-gray-400" />
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="text-gray-600 dark:text-gray-300 bg-transparent border-b-2 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                                        />
                                    ) : (
                                        <span className="text-gray-600 dark:text-gray-300">{formData.phone}</span>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="text-gray-600 dark:text-gray-300 bg-transparent border-b-2 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                                        />
                                    ) : (
                                        <span className="text-gray-600 dark:text-gray-300">{formData.email}</span>
                                    )}
                                </div>
                           </div>

                             <div className="flex justify-center space-x-3 pt-4">
                                <a href={`tel:${formData.phone}`} className="px-6 py-2 text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 rounded-full hover:bg-green-200 dark:hover:bg-green-900 transition-colors flex items-center space-x-2">
                                    <PhoneIcon className="w-4 h-4" />
                                    <span>Call Driver</span>
                                </a>
                                <a href={`mailto:${formData.email}`} className="px-6 py-2 text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors flex items-center space-x-2">
                                    <EnvelopeIcon className="w-4 h-4" />
                                    <span>Email Driver</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg mt-8">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">Performance Analytics</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <StatCard title="Years of Service" value={yearsOfService} icon={<BriefcaseIcon className="w-6 h-6 text-blue-600" />} />
                            <StatCard title="Total Trips Completed" value={driver.totalTrips.toLocaleString()} icon={<TruckIcon className="w-6 h-6 text-blue-600" />} />
                            <StatCard title="Safety Score" value={`${driver.safetyScore} / 5.0`} icon={<StarIcon className="w-6 h-6 text-blue-600" />} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DriverProfilePage;