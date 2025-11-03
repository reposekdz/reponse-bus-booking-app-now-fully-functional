
import React from 'react';
import { MegaphoneIcon } from '../components/icons';

const PlatformAnnouncements: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">Platform Announcements</h1>
            <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg text-center">
                 <MegaphoneIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"/>
                <h2 className="text-xl font-bold dark:text-white">Broadcast a Message</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">This feature is coming soon. You'll be able to send announcements and notifications to all users or target specific roles (e.g., all drivers).</p>
            </div>
        </div>
    );
};

export default PlatformAnnouncements;
