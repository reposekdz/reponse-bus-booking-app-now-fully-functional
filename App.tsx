import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturedRoutes from './components/FeaturedRoutes';
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
import AITripPlanner from './components/AITripPlanner';
import BottomNavigation from './components/BottomNavigation';
import CompanyProfilePage from './CompanyProfilePage';

export type Page = 'home' | 'login' | 'register' | 'bookings' | 'companies' | 'help' | 'contact' | 'searchResults' | 'seatSelection' | 'companyProfile';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const navigate = (targetPage: Page, data?: any) => {
    if ((targetPage === 'bookings') && !isLoggedIn) {
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
    setPage('home');
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setPage('home');
  };

  const handleSearch = () => {
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

  const renderContent = () => {
    switch (page) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={navigate} />;
      case 'register':
        return <RegisterPage onNavigate={navigate} />;
      case 'bookings':
        return <BookingsPage />;
      case 'companies':
        return <CompaniesPage />;
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
      case 'home':
      default:
        return (
          <>
            <HeroSection onSearch={handleSearch} />
            <PartnerCompanies navigate={navigate} />
            <FeaturedRoutes />
            <HowItWorks />
            <AITripPlanner />
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
      <BottomNavigation navigate={navigate} currentPage={page} />
    </div>
  );
};

export default App;