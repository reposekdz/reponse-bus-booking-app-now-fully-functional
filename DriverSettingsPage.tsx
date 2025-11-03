
import React, { useState, useRef } from 'react';
import { CameraIcon, SunIcon, MoonIcon, BellIcon, ShieldCheckIcon, UserCircleIcon, BriefcaseIcon } from './components/icons';

const SettingToggle = ({ label, description, enabled, onToggle }) => (
    <div className="flex items-center justify-between py-3">
        <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">{label}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <button onClick={onToggle} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);


const DriverSettingsPage = ({ driverData, companyData, theme, setTheme }) => {
    const [driverInfo, setDriverInfo] = useState(driverData);
    const [notificationSettings, setNotificationSettings] = useState({
        newTrips: true,
        scheduleChanges: true,
        platformAnnouncements: false,
    });
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const handleInfoChange = (e) => {
        setDriverInfo(prev => ({...prev, [e.target.name]: e.target.value}));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setDriverInfo(prev => ({...prev, avatarUrl: reader.result as string}));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleToggle = (setting: keyof typeof notificationSettings) => {
        setNotificationSettings(prev => ({...prev, [setting]: !prev[setting]}));
    }

    return (
        <div className="animate-fade-in container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">Settings</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left side with various settings */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Profile Editing */}
                    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold dark:text-white mb-4 flex items-center"><UserCircleIcon className="w-6 h-6 mr-3 text-blue-500"/> Edit Profile</h2>
                        <div className="flex items-center space-x-4 mb-6">
                             <div className="relative group">
                                <img src={driverInfo.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover"/>
                                <button onClick={() => avatarInputRef.current?.click()} className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <CameraIcon className="w-6 h-6"/>
                                </button>
                                <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                            </div>
                            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500">Full Name</label>
                                    <input type="text" name="name" value={driverInfo.name} onChange={handleInfoChange} className="w-full p-2 border-b-2 dark:bg-transparent dark:border-gray-600 focus:outline-none focus:border-blue-500"/>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500">Phone</label>
                                    <input type="text" name="phone" value={driverInfo.phone || '0788111222'} onChange={handleInfoChange} className="w-full p-2 border-b-2 dark:bg-transparent dark:border-gray-600 focus:outline-none focus:border-blue-500"/>
                                </div>
                            </div>
                        </div>
                        <div>
                             <label className="text-xs font-semibold text-gray-500">Bio</label>
                             <textarea name="bio" value={driverInfo.bio || ''} onChange={handleInfoChange} rows={3} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="text-right mt-4">
                            <button onClick={() => alert("Profile Saved!")} className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">Save Changes</button>
                        </div>
                    </div>

                    {/* Notification Settings */}
                     <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold dark:text-white mb-2 flex items-center"><BellIcon className="w-6 h-6 mr-3 text-yellow-500"/> Notifications</h2>
                         <div className="divide-y dark:divide-gray-700">
                             <SettingToggle label="New Trip Assignments" description="Get notified when a new trip is assigned to you." enabled={notificationSettings.newTrips} onToggle={() => handleToggle('newTrips')} />
                             <SettingToggle label="Schedule Changes" description="Alerts for changes to your upcoming trips." enabled={notificationSettings.scheduleChanges} onToggle={() => handleToggle('scheduleChanges')} />
                             <SettingToggle label="Platform Announcements" description="Receive general news and updates from Rwanda Bus." enabled={notificationSettings.platformAnnouncements} onToggle={() => handleToggle('platformAnnouncements')} />
                        </div>
                    </div>
                </div>

                {/* Right side with company info and other settings */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold dark:text-white mb-4 flex items-center"><BriefcaseIcon className="w-6 h-6 mr-3 text-green-500"/> My Company</h2>
                        <div className="flex items-center space-x-4">
                            <img src={companyData.logoUrl} alt={companyData.name} className="w-16 h-16 object-contain bg-gray-100 dark:bg-gray-700 rounded-full p-1"/>
                            <div>
                                <p className="font-bold text-lg dark:text-white">{companyData.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Status: {driverData.status || 'Active'}</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-4 italic">"{companyData.description}"</p>
                    </div>

                     <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold dark:text-white mb-4 flex items-center"><ShieldCheckIcon className="w-6 h-6 mr-3 text-red-500"/> Security</h2>
                         <div>
                            <label className="text-xs font-semibold text-gray-500">Current Password</label>
                            <input type="password" className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                        </div>
                        <div className="mt-2">
                            <label className="text-xs font-semibold text-gray-500">New Password</label>
                            <input type="password" className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                        </div>
                        <button className="w-full mt-4 py-2 bg-gray-200 dark:bg-gray-700 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Change Password</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DriverSettingsPage;
