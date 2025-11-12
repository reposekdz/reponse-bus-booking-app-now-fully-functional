

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import OurPartners from './components/PartnerCompanies';
import Footer from './components/Footer';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import SearchResultsPage from './SearchResultsPage';
import SeatSelectionPage from './SeatSelectionPage';
import BookingsPage from './BookingsPage';
import ProfilePage from './ProfilePage';
import CompaniesPage from './CompaniesPage';
import CompanyProfilePage from './CompanyProfilePage';
import HelpPage from './HelpPage';
import ContactPage from './ContactPage';
import ScheduledTripsPage from './ScheduledTripsPage';
import AdminLayout from './admin/AdminLayout';
import CompanyLayout from './company/CompanyLayout';
import DriverDashboard from './DriverDashboard';
import AgentDashboard from './AgentDashboard';
import ServicesPage from './ServicesPage';
import PackageDeliveryPage from './PackageDeliveryPage';
import BusCharterPage from './BusCharterPage';
import BookingSearchPage from './BookingSearchPage';
import BottomNavigation from './components/BottomNavigation';
import TicketModal from './components/TicketModal';
import { LanguageProvider } from './contexts/LanguageContext';
import DriverProfilePage from './DriverProfilePage';
import AgentProfilePage from './AgentProfilePage';
import PassengerProfilePage from './PassengerProfilePage';
import LostAndFoundPage from './LostAndFoundPage';
import CorporateTravelPage from './CorporateTravelPage';
import TourPackagesPage from './TourPackagesPage';
import GiftCardsPage from './GiftCardsPage';
import TravelInsurancePage from './TravelInsurancePage';
import FeaturedDestinations from './components/FeaturedDestinations';
import Testimonials from './components/Testimonials';
import HotelBookingPage from './HotelBookingPage';
import EventTicketsPage from './EventTicketsPage';
import VehicleRentalsPage from './VehicleRentalsPage';
import VipLoungePage from './VipLoungePage';
import WhyChooseUs from './components/WhyChooseUs';
import SpecialOffers from './components/SpecialOffers';
import BookingConfirmationPage from './BookingConfirmationPage';
import FavoritesPage from './FavoritesPage';
import PriceAlertsPage from './PriceAlertsPage';
import LoyaltyPage from './LoyaltyPage';
import PaymentPage from './PaymentPage';
import WalletPage from './WalletPage';
import { useAuth } from './contexts/AuthContext';
import * as api from './services/apiService';
import { mockCompaniesData } from './lib/api';


export type Page = 
  | 'home' | 'login' | 'register' | 'bookings' | 'scheduled' | 'search' 
  | 'seatSelection' | 'payment' | 'profile' | 'companies' 
  | 'companyProfile' | 'help' | 'contact' | 'services' | 'packageDelivery' 
  | 'busCharter' | 'lostAndFound' | 'adminDashboard' | 'companyDashboard' | 'driverDashboard' 
  | 'agentDashboard' | 'adminCompanies' | 'adminDrivers' | 'adminAgents' 
  | 'adminUsers' | 'adminFinancials' | 'adminAds' 
  | 'adminPromotions' | 'companyBuses' | 'companyDrivers' | 'companyRoutes' 
  | 'companyPassengers' | 'companyFinancials' | 'companySettings' 
  | 'fleetMonitoring' | 'driverProfile' | 'agentProfile' | 'bookingSearch' | 'passengerProfile'
  | 'corporateTravel' | 'tourPackages' | 'travelInsurance' | 'giftCards' | 'adminAnnouncements'
  | 'hotelBooking' | 'eventTickets' | 'vehicleRentals' | 'vipLounge' | 'companyRouteAnalytics'
  | 'bookingConfirmation' | 'favorites' | 'priceAlerts' | 'loyalty' | 'wallet';


const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageData, setPageData] = useState<any>(null);
  const { user, logout, isLoading } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [viewingTicket, setViewingTicket] = useState<any | null>(null);
  const [isSeeded, setIsSeeded] = useState(false);

  // This will seed the database on first load for demonstration purposes.
  useEffect(() => {
      const seedDb = async () => {
          try {
              console.log("Seeding database...");
              await api.seedDatabase();
              console.log("Database seeded successfully.");
              setIsSeeded(true);
          } catch(e) {
              console.warn("Database may already be seeded.", e.message);
              setIsSeeded(true); // Assume it's okay
          }
      };
      if (!isSeeded) {
          seedDb();
      }
  }, [isSeeded]);
  

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);


  const navigate = (page: Page, data?: any) => {
    setCurrentPage(page);
    setPageData(data);
  };

  const handleLogout = () => {
    logout();
    navigate('home');
  };
  
  const handleSearch = (from?: string, to?: string, date?: string) => {
      navigate('bookingSearch', { from, to, date });
  }

  if (isLoading || !isSeeded) {
      return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 dark:text-white">Loading Application...</div>;
  }

  const renderPage = () => {
    // If not logged in, force login page for protected routes
    const protectedPages: Page[] = ['bookings', 'profile', 'favorites', 'priceAlerts', 'loyalty', 'wallet'];
    if (!user && protectedPages.includes(currentPage)) {
        return <LoginPage onNavigate={navigate} />;
    }

    // FIX: Add mock handlers for missing dashboard props
    const onPassengerBoarding = (ticketId: string) => {
        console.log(`Boarding passenger with ticket: ${ticketId}`);
    };
    const onAgentDeposit = (serialCode: string, amount: number) => {
        console.log(`Depositing ${amount} for serial ${serialCode}`);
        return { success: true, passengerName: 'Mock Passenger', commission: amount * 0.05 };
    };

    switch (currentPage) {
      case 'login': return <LoginPage onNavigate={navigate} />;
      case 'register': return <RegisterPage onNavigate={navigate} />;
      case 'search': return <SearchResultsPage results={pageData} onTripSelect={(tripId) => navigate('seatSelection', { tripId })} />;
      case 'seatSelection': return <SeatSelectionPage tripId={pageData.tripId} onConfirm={(bookingDetails) => navigate('payment', bookingDetails)} onBack={() => navigate('bookingSearch')} />;
      case 'payment': return <PaymentPage bookingDetails={pageData} onNavigate={navigate} />;
      case 'bookingConfirmation': return <BookingConfirmationPage bookingDetails={pageData} onNavigate={navigate} />;
      case 'bookings': return <BookingsPage onViewTicket={setViewingTicket} />;
      case 'profile': return <ProfilePage onNavigate={navigate} />;
      case 'scheduled': return <ScheduledTripsPage onSearch={handleSearch}/>;
      case 'companies': return <CompaniesPage onNavigate={navigate} />;
      case 'companyProfile': return <CompanyProfilePage company={pageData} onSelectTrip={handleSearch} />;
      case 'help': return <HelpPage />;
      case 'contact': return <ContactPage />;
      case 'services': return <ServicesPage onNavigate={navigate} />;
      case 'packageDelivery': return <PackageDeliveryPage onNavigate={navigate} />;
      case 'busCharter': return <BusCharterPage onNavigate={navigate} />;
      case 'lostAndFound': return <LostAndFoundPage onNavigate={navigate} />;
      case 'bookingSearch': return <BookingSearchPage searchParams={pageData} onNavigate={navigate} />;
      case 'corporateTravel': return <CorporateTravelPage onNavigate={navigate} />;
      case 'tourPackages': return <TourPackagesPage onNavigate={navigate} />;
      case 'travelInsurance': return <TravelInsurancePage onNavigate={navigate} />;
      case 'giftCards': return <GiftCardsPage onNavigate={navigate} />;
      case 'hotelBooking': return <HotelBookingPage onNavigate={navigate} />;
      case 'eventTickets': return <EventTicketsPage onNavigate={navigate} />;
      case 'vehicleRentals': return <VehicleRentalsPage onNavigate={navigate} />;
      case 'vipLounge': return <VipLoungePage onNavigate={navigate} />;
      case 'favorites': return <FavoritesPage onNavigate={navigate} />;
      case 'priceAlerts': return <PriceAlertsPage onNavigate={navigate} user={user} />;
      case 'loyalty': return <LoyaltyPage user={user} onNavigate={navigate} />;
      case 'wallet': return <WalletPage onNavigate={navigate} />;
      
      case 'adminDashboard': case 'adminCompanies': case 'adminDrivers': case 'adminAgents': case 'adminUsers': case 'adminFinancials': case 'adminAds': case 'adminPromotions': case 'adminAnnouncements':
        return user?.role === 'admin' ? <AdminLayout currentPage={currentPage} navigate={navigate} /> : <p>Access Denied</p>;
        
      case 'companyDashboard': case 'companyBuses': case 'companyDrivers': case 'companyRoutes': case 'companyPassengers': case 'companyFinancials': case 'companySettings': case 'fleetMonitoring': case 'companyRouteAnalytics':
        return user?.role === 'company' ? <CompanyLayout currentPage={currentPage} navigate={navigate} companyData={user} /> : <p>Access Denied</p>;
        
      case 'driverDashboard':
        // FIX: Pass all required props to DriverDashboard
        return user?.role === 'driver' ? <DriverDashboard driverData={user} navigate={navigate} onLogout={handleLogout} theme={theme} setTheme={setTheme} allCompanies={mockCompaniesData} onPassengerBoarding={onPassengerBoarding} /> : <p>Access Denied</p>;

      case 'agentDashboard':
        // FIX: Pass all required props to AgentDashboard
        return user?.role === 'agent' ? <AgentDashboard agentData={user} navigate={navigate} onLogout={handleLogout} theme={theme} setTheme={setTheme} onAgentDeposit={onAgentDeposit} passengerSerialCode="UM1234" transactions={[]} /> : <p>Access Denied</p>;
        
      case 'driverProfile': return <DriverProfilePage driver={pageData} />;
      case 'agentProfile': return <AgentProfilePage agent={pageData} allTransactions={[]} />;
      case 'passengerProfile': return <PassengerProfilePage passenger={pageData} />;

      default:
        return (
          <>
            <HeroSection onSearch={handleSearch} />
            <div className="bg-gray-50 dark:bg-gray-900">
              <div className="space-y-16 md:space-y-24 py-16 md:py-24">
                  <FeaturedDestinations onSearch={handleSearch} />
                  <WhyChooseUs />
                  <SpecialOffers onSearch={handleSearch} />
                  <HowItWorks />
                  <Testimonials />
                  <OurPartners navigate={navigate} />
              </div>
            </div>
          </>
        );
    }
  };
  
  const isDashboard = ['adminDashboard', 'companyDashboard', 'driverDashboard', 'agentDashboard', 'adminCompanies', 'adminDrivers', 'adminAgents', 'adminUsers', 'adminFinancials', 'adminAds', 'adminPromotions', 'adminAnnouncements', 'companyBuses', 'companyDrivers', 'companyRoutes', 'companyPassengers', 'companyFinancials', 'companySettings', 'fleetMonitoring', 'agentProfile', 'driverProfile', 'passengerProfile', 'companyRouteAnalytics'].includes(currentPage);
  const isFullScreenPage = ['bookingConfirmation'].includes(currentPage);
  const showHeader = !isDashboard && !isFullScreenPage;
  const showFooter = !isDashboard && !isFullScreenPage;
  const mainPadding = showHeader ? 'pt-20' : '';
  const showBottomNav = !isDashboard && !isFullScreenPage && ['home', 'bookingSearch', 'companies', 'profile', 'services'].includes(currentPage);

  return (
    <div className={`font-sans bg-white dark:bg-gray-900`}>
        {showHeader && (
             <Header 
                currentPage={currentPage} 
                onNavigate={navigate}
                onLogout={handleLogout}
                theme={theme}
                setTheme={setTheme}
             />
        )}
        <main className={mainPadding}>
            <div key={currentPage} className="animate-fade-in">
                {renderPage()}
            </div>
        </main>
        {showFooter && <Footer />}
        
        {viewingTicket && <TicketModal ticket={viewingTicket} onClose={() => setViewingTicket(null)} />}

        {showBottomNav && (
            <>
                <div className="lg:hidden h-20" /> 
                <BottomNavigation navigate={navigate} currentPage={currentPage} />
            </>
        )}
    </div>
  );
};

const App: React.FC = () => {
    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    )
}

export default App;