import React, { useState, useRef, useEffect } from 'react';
import { Page } from '../App';
import { SunIcon, MoonIcon, MenuIcon, XIcon, UserCircleIcon, TicketIcon, LanguageIcon, ChevronDownIcon, WalletIcon, BusIcon, BellIcon, TagIcon, StarIcon, BellAlertIcon, SparklesIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user: any | null;
  onLogout: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const NavLink: React.FC<{ page: Page; currentPage: Page; onNavigate: (page: Page) => void; children: React.ReactNode }> = ({ page, currentPage, onNavigate, children }) => (
  <button 
    onClick={() => onNavigate(page)}
    className={`px-4 py-2 text-sm font-semibold transition-colors duration-200 ${currentPage === page ? 'text-yellow-300' : 'text-white hover:text-yellow-200'}`}
  >
    {children}
  </button>
);

const DropdownMenu: React.FC<{isOpen: boolean; children: React.ReactNode; className?: string}> = ({isOpen, children, className}) => (
    <div 
      className={`absolute right-0 mt-3 origin-top-right rounded-xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 dark:from-sky-600 dark:via-blue-700 dark:to-indigo-800 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-300 ease-in-out text-white ${className} ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
    >
      {children}
    </div>
);

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, user, onLogout, theme, setTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const langRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const { language, setLanguage, t, languages } = useLanguage();

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const selectLanguage = (lang) => {
    setLanguage(lang.code);
    setIsLangOpen(false);
  };

  const currentLang = languages.find(l => l.code === language);
  
  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-[#0033A0] via-[#00574B] to-[#204F46] text-white shadow-lg backdrop-blur-sm bg-opacity-90 animated-gradient-bg">
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        <button onClick={() => onNavigate('home')} className="group flex items-center gap-2 text-2xl font-extrabold tracking-tight transition-transform duration-300 hover:scale-105">
          <BusIcon className="w-8 h-8 transition-transform duration-500 group-hover:-translate-x-1 group-hover:text-yellow-300" />
          <span>Go<span className="text-yellow-300">Bus</span></span>
        </button>

        <nav className="hidden lg:flex items-center space-x-2">
          <NavLink page="home" currentPage={currentPage} onNavigate={onNavigate}>{t('nav_home')}</NavLink>
          <NavLink page="bookingSearch" currentPage={currentPage} onNavigate={onNavigate}>{t('nav_booking')}</NavLink>
          <NavLink page="companies" currentPage={currentPage} onNavigate={onNavigate}>{t('nav_companies')}</NavLink>
          <NavLink page="services" currentPage={currentPage} onNavigate={onNavigate}>{t('nav_services')}</NavLink>
          <NavLink page="help" currentPage={currentPage} onNavigate={onNavigate}>{t('nav_help')}</NavLink>
          <NavLink page="contact" currentPage={currentPage} onNavigate={onNavigate}>{t('nav_contact')}</NavLink>
        </nav>

        <div className="flex items-center space-x-2 sm:space-x-4">
           <div className="relative hidden sm:block" ref={langRef}>
            <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center space-x-1 p-2 rounded-full hover:bg-white/10">
              <LanguageIcon className="w-5 h-5" />
              <span className="text-xs font-bold hidden sm:inline">{currentLang?.code}</span>
              <ChevronDownIcon className={`w-4 h-4 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>
             <DropdownMenu isOpen={isLangOpen} className="w-48">
                <div className="py-1">
                    {languages.map(lang => (
                      <button key={lang.code} onClick={() => selectLanguage(lang)} className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-white/20">
                        <span className="mr-3 text-lg">{lang.flag}</span>
                        {lang.name}
                      </button>
                    ))}
                </div>
              </DropdownMenu>
          </div>

          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/10 hidden sm:block">
            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
          </button>

          <div className="relative hidden sm:block" ref={notificationsRef}>
            <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="p-2 rounded-full hover:bg-white/10 relative">
              <BellIcon className="w-5 h-5" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white/20"></span>
            </button>
            <DropdownMenu isOpen={isNotificationsOpen} className="w-80">
                <div className="p-3 font-bold border-b border-white/20">Notifications</div>
                <div className="py-2 max-h-64 overflow-y-auto">
                    <div className="px-4 py-3 text-sm hover:bg-white/20 flex items-start space-x-3">
                        <TicketIcon className="w-5 h-5 text-yellow-300 mt-0.5"/>
                        <div>
                            <p className="font-semibold">Trip Reminder</p>
                            <p className="text-xs opacity-80">Your trip to Rubavu is tomorrow at 07:00.</p>
                        </div>
                    </div>
                     <div className="px-4 py-3 text-sm hover:bg-white/20 flex items-start space-x-3">
                         <TagIcon className="w-5 h-5 text-yellow-300 mt-0.5"/>
                         <div>
                            <p className="font-semibold text-yellow-300">Promotion!</p>
                            <p className="text-xs opacity-80">Get 10% off on all weekend trips. Use code WEEKEND10.</p>
                        </div>
                    </div>
                </div>
                 <div className="p-2 border-t border-white/20 text-center">
                    <button className="text-xs font-semibold">View All</button>
                </div>
            </DropdownMenu>
          </div>

          <div className="block sm:hidden flex items-center space-x-2">
            <div className="relative" ref={langRef}>
                <button onClick={() => setIsLangOpen(!isLangOpen)} className="p-2 rounded-full hover:bg-white/10">
                    <LanguageIcon className="w-5 h-5"/>
                </button>
            </div>
             <div className="relative" ref={notificationsRef}>
                <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="p-2 rounded-full hover:bg-white/10">
                    <BellIcon className="w-5 h-5"/>
                </button>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center space-x-2 p-1 rounded-full hover:bg-white/10">
                  <img src={user.avatarUrl} alt="User" className="w-8 h-8 rounded-full" />
                </button>
                <DropdownMenu isOpen={isUserMenuOpen}>
                    <div className="p-4 border-b border-white/20">
                        <p className="font-bold">{user.name}</p>
                        <p className="text-xs opacity-80">{user.email}</p>
                    </div>
                     <div className="p-4 border-b border-white/20">
                        <p className="text-xs font-semibold opacity-80">Wallet Balance</p>
                        <p className="font-bold text-xl text-green-300">{new Intl.NumberFormat('fr-RW').format(user.walletBalance)} RWF</p>
                    </div>
                    <div className="py-2">
                        <button onClick={() => { onNavigate('profile'); setIsUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-white/20 flex items-center"><UserCircleIcon className="w-5 h-5 mr-3"/> {t('usermenu_profile')}</button>
                        <button onClick={() => { onNavigate('bookings'); setIsUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-white/20 flex items-center"><TicketIcon className="w-5 h-5 mr-3"/> {t('usermenu_bookings')}</button>
                        <button onClick={() => { onNavigate('loyalty'); setIsUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-white/20 flex items-center"><SparklesIcon className="w-5 h-5 mr-3"/> My GoPoints</button>
                        <button onClick={() => { onNavigate('priceAlerts'); setIsUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-white/20 flex items-center"><BellAlertIcon className="w-5 h-5 mr-3"/> Price Alerts</button>
                        <button onClick={() => { onNavigate('favorites'); setIsUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-white/20 flex items-center"><StarIcon className="w-5 h-5 mr-3"/> My Favorites</button>
                    </div>
                     <div className="border-t border-white/20 p-2">
                        <button onClick={onLogout} className="w-full text-left px-3 py-2 text-sm font-semibold text-red-300 rounded-md hover:bg-red-900/20">{t('usermenu_logout')}</button>
                    </div>
                </DropdownMenu>
              </div>
            ) : (
              <button onClick={() => onNavigate('login')} className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#0033A0] rounded-md hover:saturate-150 transition-all shadow-md transform hover:-translate-y-0.5">{t('login_button')}</button>
            )}
          </div>
          
          <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      
       {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm lg:hidden">
            <div className="absolute top-0 right-0 w-full max-w-xs bg-gradient-to-b from-[#0033A0] to-[#0c2461] h-full p-6">
                <div className="flex justify-between items-center mb-8">
                    <span className="text-xl font-bold">Menu</span>
                    <button onClick={() => setIsMobileMenuOpen(false)}><XIcon className="w-6 h-6"/></button>
                </div>
                 <nav className="flex flex-col space-y-4">
                    <button onClick={() => {onNavigate('home'); setIsMobileMenuOpen(false);}}>{t('nav_home')}</button>
                    <button onClick={() => {onNavigate('bookingSearch'); setIsMobileMenuOpen(false);}}>{t('nav_booking')}</button>
                    <button onClick={() => {onNavigate('companies'); setIsMobileMenuOpen(false);}}>{t('nav_companies')}</button>
                    <button onClick={() => {onNavigate('services'); setIsMobileMenuOpen(false);}}>{t('nav_services')}</button>
                    <button onClick={() => {onNavigate('help'); setIsMobileMenuOpen(false);}}>{t('nav_help')}</button>
                    <button onClick={() => {onNavigate('contact'); setIsMobileMenuOpen(false);}}>{t('nav_contact')}</button>

                     <div className="border-t border-white/20 my-4"></div>
                     {user ? (
                         <>
                            <button onClick={() => {onNavigate('profile'); setIsMobileMenuOpen(false);}} className="flex items-center space-x-3">
                                <img src={user.avatarUrl} alt="User" className="w-8 h-8 rounded-full" />
                                <span>{user.name}</span>
                            </button>
                            <button onClick={() => {onLogout(); setIsMobileMenuOpen(false);}} className="text-red-400 text-left">{t('usermenu_logout')}</button>
                         </>
                     ) : (
                        <button onClick={() => {onNavigate('login'); setIsMobileMenuOpen(false);}} className="px-4 py-2 text-sm font-semibold bg-yellow-400 text-[#0033A0] rounded-md hover:bg-yellow-500 transition-colors">{t('login_button')}</button>
                     )}
                 </nav>
            </div>
        </div>
      )}
    </header>
  );
};

export default Header;