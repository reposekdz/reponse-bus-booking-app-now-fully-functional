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
import NextTripWidget from './components/NextTripWidget';
import LiveTrackingModal from './components/LiveTrackingModal';
import ServicesPage from './ServicesPage';
import PackageDeliveryPage from './PackageDeliveryPage';
import BusCharterPage from './BusCharterPage';
import BookingSearchPage, { allSearchResults } from './BookingSearchPage';
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
  | 'bookingConfirmation' | 'favorites' | 'priceAlerts' | 'loyalty';

// Mock User Data
const mockUsers = {
  passenger: { name: 'Kalisa Jean', email: 'passenger@rwandabus.rw', role: 'passenger', avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg', coverUrl: 'https://images.unsplash.com/photo/1619534103142-93b3f276c120?q=80&w=2070&auto=format&fit=crop', walletBalance: 15000, pin: '1234', priceAlerts: [], loyaltyPoints: 1250, referralCode: 'KAL-JEAN-8B' },
  company: { name: 'Volcano Express', email: 'manager@volcano.rw', role: 'company', avatarUrl: 'https://pbs.twimg.com/profile_images/1237839357116452865/p-28c8o-_400x400.jpg', coverUrl: 'https://images.unsplash.com/photo/1544620347-c4fd4a3d5957?q=80&w=2048&auto=format&fit=crop', pin: '2024' },
  admin: { name: 'Admin User', email: 'admin@rwandabus.rw', role: 'admin', avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg', coverUrl: 'https://images.unsplash.com/photo/1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop' },
  driver: { 
    id: 'd1', 
    name: 'John Doe', 
    email: 'driver@volcano.rw', 
    role: 'driver', 
    avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg', 
    coverUrl: 'https://images.unsplash.com/photo/1533104816-588941750c11?q=80&w=1974&auto=format&fit=crop',
    company: 'Volcano Express', 
    assignedBusId: 'RAD 123 B', 
    phone: '0788111222', 
    status: 'Active', 
    joinDate: '2022-03-10', 
    bio: 'Experienced driver with over 10 years on the Kigali-Rubavu route. Safety is my priority.', 
    documents: [
      {id: 'DL-RW-12345', name: 'Driver\'s License Category D', expiry: '2026-08-15'},
      {id: 'CERT-001', name: 'Defensive Driving', expiry: '2025-12-31'},
      {id: 'NID-98765', name: 'National ID', expiry: '2030-01-01'},
      {id: 'BADGE-042', name: 'Public Transport Badge', expiry: '2024-11-20'}, // Expiring soon
    ],
    performance: {
        onTimeRate: 98.5,
        completionRate: 100,
        averageRating: 4.8,
        safetyScore: 99,
        totalTrips: 245,
    },
    tripHistory: [
        {id: 'TRIP-501', route: 'Kigali - Rubavu', date: '2024-10-28', status: 'Completed', passengers: 54},
        {id: 'TRIP-502', route: 'Kigali - Musanze', date: '2024-10-27', status: 'Completed', passengers: 28},
        {id: 'TRIP-503', route: 'Kigali - Huye', date: '2024-10-26', status: 'Completed', passengers: 62},
        {id: 'TRIP-504', route: 'Kigali - Rubavu', date: '2024-10-29', status: 'Upcoming', passengers: 0},
    ]
  },
  agent: { id: 'a1', name: 'Jane Smith', email: 'jane.s@agent.rw', role: 'agent', avatarUrl: 'https://randomuser.me/api/portraits/women/5.jpg', coverUrl: 'https://images.unsplash.com/photo/1614323992655-037a34c19a31?q=80&w=2070&auto=format&fit=crop', location: 'Nyabugogo', commissionRate: 0.05, totalDeposits: 2500000, pin: '5678', phone: '0788777888' }
};

const mockNextTrip = {
    route: 'Kigali - Huye',
    departureTime: 'in 45 minutes',
    company: 'Volcano Express',
};

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageData, setPageData] = useState<any>(null);
  const [user, setUser] = useState<any | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showNextTrip, setShowNextTrip] = useState(false);
  const [showLiveTracking, setShowLiveTracking] = useState(false);
  const [viewingTicket, setViewingTicket] = useState<any | null>(null);
  
  // Passenger serial code for agent demo
  const passengerSerialCode = "UM1234";
  const [agentTransactions, setAgentTransactions] = useState([
      { id: 1, agentId: 'a1', passengerSerial: 'UM5678', passengerName: 'Mutesi Aline', amount: 15000, commission: 750, date: new Date().toISOString() },
      { id: 2, agentId: 'a2', passengerSerial: 'UM9101', passengerName: 'Gatete David', amount: 25000, commission: 1250, date: new Date().toISOString() },
      { id: 3, agentId: 'a1', passengerSerial: 'UM1121', passengerName: 'Uwineza Grace', amount: 10000, commission: 500, date: new Date().toISOString() },
  ]);

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
  
  const handleAgentDeposit = (serialCode, amount) => {
    if(serialCode.toUpperCase() !== passengerSerialCode) return { success: false, message: 'Passenger not found.'};
    
    const commission = amount * 0.05;
    const newTransaction = {
      id: Date.now(),
      agentId: mockUsers.agent.id,
      passengerSerial: serialCode,
      passengerName: 'Kalisa Jean',
      amount,
      commission,
      date: new Date().toISOString()
    };
    setAgentTransactions(prev => [newTransaction, ...prev]);
    return { success: true, passengerName: 'Kalisa Jean', commission };
  };


  const navigate = (page: Page, data?: any) => {
    setCurrentPage(page);
    setPageData(data);
  };

  const handleLogin = (role: keyof typeof mockUsers) => {
    const loggedInUser = mockUsers[role];
    setUser(loggedInUser);
    if(loggedInUser.role === 'passenger') {
        navigate('home');
        setShowNextTrip(true);
    } else if (loggedInUser.role === 'admin') {
        navigate('adminDashboard');
    } else if (loggedInUser.role === 'company') {
        navigate('companyDashboard');
    } else if (loggedInUser.role === 'driver') {
        navigate('driverDashboard');
    } else if (loggedInUser.role === 'agent') {
        navigate('agentDashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setShowNextTrip(false);
    navigate('home');
  };
  
  const handleSearch = (from?: string, to?: string) => {
      navigate('bookingSearch', { from, to });
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'login': return <LoginPage onNavigate={navigate} onLogin={handleLogin} />;
      case 'register': return <RegisterPage onNavigate={navigate} />;
      case 'search': return <SearchResultsPage results={allSearchResults} onTripSelect={(trip) => navigate('seatSelection', trip)} />;
      case 'seatSelection': return <SeatSelectionPage tripData={pageData} onConfirm={(bookingDetails) => navigate('payment', bookingDetails)} onBack={() => navigate('search')} user={user} />;
      case 'payment': return <PaymentPage bookingDetails={pageData} onNavigate={navigate} />;
      case 'bookingConfirmation': return <BookingConfirmationPage bookingDetails={pageData} onNavigate={navigate} setUser={setUser} />;
      case 'bookings': return <BookingsPage onViewTicket={setViewingTicket} user={user} />;
      case 'profile': return <ProfilePage onNavigate={navigate} user={user} setUser={setUser} />;
      case 'scheduled': return <ScheduledTripsPage onSearch={handleSearch}/>;
      case 'companies': return <CompaniesPage onNavigate={navigate} />;
      case 'companyProfile': return <CompanyProfilePage company={pageData} onSelectTrip={handleSearch} />;
      case 'help': return <HelpPage />;
      case 'contact': return <ContactPage />;
      case 'services': return <ServicesPage onNavigate={navigate} />;
      case 'packageDelivery': return <PackageDeliveryPage onNavigate={navigate} />;
      case 'busCharter': return <BusCharterPage onNavigate={navigate} />;
      case 'lostAndFound': return <LostAndFoundPage onNavigate={navigate} />;
      case 'bookingSearch': return <BookingSearchPage onSearch={handleSearch} navigate={navigate} />;
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
      
      case 'adminDashboard': case 'adminCompanies': case 'adminDrivers': case 'adminAgents': case 'adminUsers': case 'adminFinancials': case 'adminAds': case 'adminPromotions': case 'adminAnnouncements':
        return <AdminLayout currentPage={currentPage} navigate={navigate} />;
        
      case 'companyDashboard': case 'companyBuses': case 'companyDrivers': case 'companyRoutes': case 'companyPassengers': case 'companyFinancials': case 'companySettings': case 'fleetMonitoring': case 'companyRouteAnalytics':
        return <CompanyLayout currentPage={currentPage} navigate={navigate} companyData={user} />;
        
      case 'driverDashboard':
        return <DriverDashboard onLogout={handleLogout} theme={theme} setTheme={setTheme} driverData={mockUsers.driver} allCompanies={[]} onPassengerBoarding={() => {}} navigate={navigate} />;

      case 'agentDashboard':
        return <AgentDashboard onLogout={handleLogout} theme={theme} setTheme={setTheme} agentData={mockUsers.agent} onAgentDeposit={handleAgentDeposit} passengerSerialCode={passengerSerialCode} transactions={agentTransactions} navigate={navigate} />;
        
      case 'driverProfile': return <DriverProfilePage driver={pageData || mockUsers.driver} />;
      case 'agentProfile': return <AgentProfilePage agent={pageData || mockUsers.agent} allTransactions={agentTransactions} />;
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
                user={user}
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
        
        {user?.role === 'passenger' && showNextTrip && (
            <NextTripWidget 
                trip={mockNextTrip} 
                onDismiss={() => setShowNextTrip(false)}
                onTrack={() => setShowLiveTracking(true)}
            />
        )}
        
        {showLiveTracking && <LiveTrackingModal onClose={() => setShowLiveTracking(false)} />}
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