import React, { useState, useEffect } from 'react';
import { BusIcon, SunIcon, MoonIcon, BellIcon, MenuIcon, XIcon } from './icons';
import type { Page } from '../App';

interface HeaderProps {
  navigate: (page: Page) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  currentPage: Page;
}

const Header: React.FC<HeaderProps> = ({ navigate, isLoggedIn, onLogout, theme, setTheme, currentPage }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // Corresponds to lg breakpoint
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems: { label: string; page: Page }[] = [
    { label: 'Ahabanza', page: 'home' },
    { label: 'Amatike Yanjye', page: 'bookings' },
    { label: 'Ibigo', page: 'companies' },
    { label: 'Ubufasha', page: 'help' },
    { label: 'Twandikire', page: 'contact' },
  ];
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  const handleNavClick = (page: Page) => {
    navigate(page);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#0033A0] to-[#0c2461] shadow-lg text-white dark:from-gray-900 dark:to-black">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <button onClick={() => handleNavClick('home')} className="flex items-center space-x-2 focus:outline-none">
            <BusIcon className="h-8 w-8 bg-gradient-to-r from-blue-400 to-yellow-300 p-1 rounded" />
            <span className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-yellow-300">
              RWANDA BUS
            </span>
          </button>
          
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`relative group transition-colors duration-300 ${currentPage === item.page ? 'text-yellow-300' : 'text-gray-200 hover:text-yellow-300'}`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-yellow-300 transition-all duration-300 ${currentPage === item.page ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="text-gray-200 hover:text-yellow-300 transition-colors duration-300">
              {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
            </button>
            
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="text-gray-200 hover:text-yellow-300 transition-colors duration-300">
                <BellIcon className="w-6 h-6" />
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 text-gray-800 dark:text-gray-200">
                  <p className="font-bold mb-2">Ibimenyetso</p>
                  <div className="text-sm space-y-2">
                    <p>Urugendo rwawe rujya i Rubavu ni ejo!</p>
                    <p className="text-green-600 dark:text-green-400">Gura itike ubu ubone igabanyirizwa rya 10%.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center space-x-4">
              {isLoggedIn ? (
                <button 
                  onClick={onLogout}
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#0033A0] hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-md text-sm font-semibold"
                >
                  Sohoka
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => handleNavClick('login')}
                    className="px-4 py-2 rounded-md border border-blue-400 text-blue-300 hover:bg-blue-400 hover:text-white transition-all duration-300 text-sm font-semibold"
                  >
                    Injira
                  </button>
                  <button 
                    onClick={() => handleNavClick('register')}
                    className="px-4 py-2 rounded-md bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#0033A0] hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-md text-sm font-semibold"
                  >
                    Iyandikishe
                  </button>
                </>
              )}
            </div>
          <div className="lg:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Tablet & Mobile Side Menu */}
      <div 
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <aside className={`absolute top-0 left-0 h-full w-72 bg-gradient-to-b from-[#0033A0] to-[#0c2461] dark:from-gray-900 dark:to-black shadow-2xl p-6 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
               <span className="text-lg font-bold text-white">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="text-white">
                    <XIcon className="w-6 h-6" />
                </button>
            </div>
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button key={item.page} onClick={() => handleNavClick(item.page)} className={`p-3 rounded-lg text-left transition-colors duration-200 ${currentPage === item.page ? 'bg-yellow-400 text-[#0033A0] font-bold' : 'text-gray-200 hover:bg-white/10'}`}>
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="sm:hidden flex flex-col items-center space-y-4 pt-6 border-t border-gray-700 w-full mt-6">
               {isLoggedIn ? (
                  <button onClick={onLogout} className="w-full px-4 py-2 rounded-md bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#0033A0] text-sm font-semibold">
                    Sohoka
                  </button>
                ) : (
                  <>
                    <button onClick={() => handleNavClick('login')} className="w-full px-4 py-2 rounded-md border border-blue-400 text-blue-300 text-sm font-semibold">
                      Injira
                    </button>
                    <button onClick={() => handleNavClick('register')} className="w-full px-4 py-2 rounded-md bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#0033A0] text-sm font-semibold">
                      Iyandikishe
                    </button>
                  </>
                )}
              </div>
        </aside>
      </div>
    </>
  );
};

export default Header;