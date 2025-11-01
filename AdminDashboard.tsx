import React from 'react';
import { SunIcon, MoonIcon, BellIcon, UserCircleIcon, CogIcon, UsersIcon, ChartBarIcon } from './components/icons';

interface AdminDashboardProps {
  onLogout: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, theme, setTheme }) => {
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen flex ${theme}`}>
      <aside className="w-64 bg-gray-800 text-gray-300 flex flex-col">
        <div className="h-16 flex items-center justify-center text-white font-bold text-xl border-b border-gray-700">
          ADMIN DASHBOARD
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a href="#" className="flex items-center px-4 py-2 text-gray-100 bg-gray-700 rounded-md">
            <ChartBarIcon className="w-5 h-5 mr-3" />
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md">
            <UsersIcon className="w-5 h-5 mr-3" />
            <span>Users</span>
          </a>
          <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md">
            <CogIcon className="w-5 h-5 mr-3" />
            <span>Settings</span>
          </a>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900">
        <header className="h-16 bg-white dark:bg-gray-800 shadow-md flex items-center justify-end px-6">
          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
            </button>
            <button className="text-gray-500 dark:text-gray-400">
              <BellIcon className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <UserCircleIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Admin</span>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Welcome, Admin!</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Users</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">1,234</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Bookings Today</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">56</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Revenue</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">1,250,000 FRW</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Active Routes</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">35</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
