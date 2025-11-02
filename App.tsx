import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import BookingsPage from './BookingsPage';
import CompaniesPage from './CompaniesPage';
import HelpPage from './HelpPage';
import ContactPage from './ContactPage';
import SearchResultsPage from './SearchResultsPage';
import SeatSelectionPage from './SeatSelectionPage';
import PartnerCompanies from './components/PartnerCompanies';
import BottomNavigation from './components/BottomNavigation';
import CompanyProfilePage from './CompanyProfilePage';
import ProfilePage from './ProfilePage';
import NextTripWidget from './components/NextTripWidget';
import AdminDashboard from './AdminDashboard';
import CompanyDashboard from './CompanyDashboard';
import ServicesPage from './ServicesPage';
import LoadingSpinner from './components/LoadingSpinner';
import { mockCompaniesData } from './AdminDashboard';

export type Page = 'home' | 'login' | 'register' | 'bookings' | 'companies' | 'help' | 'contact' | 'searchResults' | 'seatSelection' | 'companyProfile' | 'profile' | 'services';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'passenger' | 'admin' | 'company' | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [bookingData, setBookingData] = useState<any>(null);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showNextTripWidget, setShowNextTripWidget] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState(mockCompaniesData); // State for companies lifted up

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const protectedPages: Page[] = ['bookings', 'profile'];

  const navigate = (targetPage: Page, data?: any) => {
    if (protectedPages.includes(targetPage) && !isLoggedIn) {
      setPage('login');
      return;
    }
    if (targetPage === 'companyProfile' && data) {
        setSelectedCompany(data);
    }
    setPage(targetPage);
    window.scrollTo(0, 0);
  };

  const handleLogin = (credentials: { email?: string, password?: string }) => {
    showLoader();
    setTimeout(() => {
        if (credentials.email === 'reponse@gmail.com' && credentials.password === '2025') {
            setIsLoggedIn(true);
            setUserRole('admin');
            setCurrentUser({ name: 'Admin Reponse' });
            hideLoader();
            return;
        }
        
        // Use the live 'companies' state for login check
        const companyUser = companies.find(
          c => c.contactEmail === credentials.email && c.password === credentials.password
        );

        if (companyUser) {
            setIsLoggedIn(true);
            setUserRole('company');
            setCurrentUser(companyUser);
            hideLoader();
            return;
        }
        
        setIsLoggedIn(true);
        setUserRole('passenger');
        setCurrentUser({ name: 'Kalisa Jean' });
        setShowNextTripWidget(true);
        setPage('home');
        hideLoader();
    }, 1500);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentUser(null);
    setShowNextTripWidget(false);
    setPage('home');
  };

  const handleSearch = (from?: string, to?: string) => {
    showLoader();
    setTimeout(() => {
      console.log(`Searching for routes from ${from} to ${to}`);
      navigate('searchResults');
      hideLoader();
    }, 1000);
  };
  
  const handleTripSelect = (trip: any) => {
    setBookingData({ trip });
    navigate('seatSelection');
  };
  
  const handleBookingConfirm = (selection: any) => {
    showLoader();
    setTimeout(() => {
      console.log('Booking confirmed:', selection);
      hideLoader();
    }, 2000);
  }

  const upcomingTripForWidget = {
      route: 'Kigali - Rubavu',
      departureTime: 'Ejo saa 07:00 AM',
      company: 'Volcano Express',
  };

  const renderContent = () => {
    switch (page) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={navigate} />;
      case 'register':
        return <RegisterPage onNavigate={navigate} />;
      case 'bookings':
        return <BookingsPage />;
      case 'companies':
        return <CompaniesPage onNavigate={navigate} />;
      case 'help':
        return <HelpPage />;
      case 'contact':
        return <ContactPage />;
      case 'services':
        return <ServicesPage />;
      case 'searchResults':
        return <SearchResultsPage onTripSelect={handleTripSelect} />;
      case 'seatSelection':
        return <SeatSelectionPage tripData={bookingData.trip} onConfirm={handleBookingConfirm} navigate={navigate} />;
      case 'companyProfile':
        return <CompanyProfilePage company={selectedCompany} onSelectTrip={handleSearch} />;
      case 'profile':
        return <ProfilePage />;
      case 'home':
      default:
        return (
          <>
            <HeroSection onSearch={handleSearch} />
            <PartnerCompanies navigate={navigate} />
            <HowItWorks />
          </>
        );
    }
  };

  if (isLoggedIn) {
      if (userRole === 'admin') {
          return <AdminDashboard onLogout={handleLogout} theme={theme} setTheme={setTheme} companies={companies} onUpdateCompanies={setCompanies} />;
      }
      if (userRole === 'company') {
          return <CompanyDashboard onLogout={handleLogout} theme={theme} setTheme={setTheme} companyData={currentUser} />;
      }
  }

  return (
    <div className="bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 min-h-screen flex flex-col">
      {isLoading && <LoadingSpinner />}
      <Header 
        navigate={navigate} 
        isLoggedIn={isLoggedIn} 
        onLogout={handleLogout}
        theme={theme}
        setTheme={setTheme}
        currentPage={page}
      />
      <main className="flex-grow pt-16 pb-20 md:pb-0">
        <div key={page} className="animate-fade-in">
          {renderContent()}
        </div>
      </main>
      <Footer />
      {isLoggedIn && userRole === 'passenger' && showNextTripWidget && (
          <NextTripWidget trip={upcomingTripForWidget} onDismiss={() => setShowNextTripWidget(false)} onTrack={() => navigate('bookings')} />
      )}
      <BottomNavigation navigate={navigate} currentPage={page} />
    </div>
  );
};

export default App;