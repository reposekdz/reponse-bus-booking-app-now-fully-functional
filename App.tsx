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

export type Page = 'home' | 'login' | 'register' | 'bookings' | 'companies' | 'help' | 'contact' | 'searchResults' | 'seatSelection' | 'companyProfile' | 'profile';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showNextTripWidget, setShowNextTripWidget] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const navigate = (targetPage: Page, data?: any) => {
    if ((targetPage === 'bookings' || targetPage === 'profile') && !isLoggedIn) {
      setPage('login');
      return;
    }
    if (targetPage === 'companyProfile' && data) {
        setSelectedCompany(data);
    }
    setPage(targetPage);
    window.scrollTo(0, 0);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowNextTripWidget(true); // Show widget on login
    setPage('home');
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowNextTripWidget(false); // Hide widget on logout
    setPage('home');
  };

  const handleSearch = (from?: string, to?: string) => {
    console.log(`Searching for routes from ${from} to ${to}`);
    navigate('searchResults');
  };
  
  const handleTripSelect = (trip: any) => {
    setBookingData({ trip });
    navigate('seatSelection');
  };
  
  const handleBookingConfirm = (selection: any) => {
    console.log('Booking confirmed:', selection);
    alert('Itike yawe yemejwe! Reba amakuru yayo mu "Amatike Yanjye".');
    navigate('bookings');
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
      case 'searchResults':
        return <SearchResultsPage onTripSelect={handleTripSelect} />;
      case 'seatSelection':
        return <SeatSelectionPage tripData={bookingData.trip} onConfirm={handleBookingConfirm} />;
      case 'companyProfile':
        return <CompanyProfilePage company={selectedCompany} onSelectTrip={handleSearch} />;
      case 'profile':
        return <ProfilePage />;
      case 'home':
      default:
        return (
          <>
            <HeroSection onSearch={() => handleSearch()} />
            <PartnerCompanies navigate={navigate} />
            <HowItWorks />
          </>
        );
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 min-h-screen flex flex-col">
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
      {isLoggedIn && showNextTripWidget && (
          <NextTripWidget trip={upcomingTripForWidget} onDismiss={() => setShowNextTripWidget(false)} onTrack={() => navigate('bookings')} />
      )}
      <BottomNavigation navigate={navigate} currentPage={page} />
    </div>
  );
};

export default App;