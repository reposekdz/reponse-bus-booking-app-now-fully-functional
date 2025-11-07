
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import PartnerCompanies from './components/PartnerCompanies';
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


export type Page = 
  | 'home' | 'login' | 'register' | 'bookings' | 'scheduled' | 'search' 
  | 'seatSelection' | 'payment' | 'confirmation' | 'profile' | 'companies' 
  | 'companyProfile' | 'help' | 'contact' | 'services' | 'packageDelivery' 
  | 'busCharter' | 'adminDashboard' | 'companyDashboard' | 'driverDashboard' 
  | 'agentDashboard' | 'adminCompanies' | 'adminDrivers' | 'adminAgents' 
  | 'adminPassengers' | 'adminUsers' | 'adminFinancials' | 'adminAds' 
  | 'adminPromotions' | 'companyBuses' | 'companyDrivers' | 'companyRoutes' 
  | 'companyPassengers' | 'companyFinancials' | 'companySettings' 
  | 'fleetMonitoring' | 'driverProfile' | 'agentProfile' | 'bookingSearch';

// Mock User Data
const mockUsers = {
  passenger: { name: 'Kalisa Jean', email: 'passenger@rwandabus.rw', role: 'passenger', avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg', walletBalance: 15000, pin: '1234' },
  company: { name: 'Volcano Express', email: 'manager@volcano.rw', role: 'company', avatarUrl: 'https://pbs.twimg.com/profile_images/1237839357116452865/p-28c8o-_400x400.jpg', pin: '2024' },
  admin: { name: 'Admin User', email: 'admin@rwandabus.rw', role: 'admin', avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg' },
  driver: { id: 'd1', name: 'John Doe', email: 'driver@volcano.rw', role: 'driver', avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg', company: 'Volcano Express', assignedBusId: 'RAD 123 B', phone: '0788111222', status: 'Active', joinDate: '2022-03-10', bio: 'Experienced driver with over 10 years on the Kigali-Rubavu route. Safety is my priority.', certifications: [{id: 'CERT-001', name: 'Defensive Driving', expiry: '2025-12-31'}]},
  agent: { id: 'a1', name: 'Jane Smith', email: 'jane.s@agent.rw', role: 'agent', avatarUrl: 'https://randomuser.me/api/portraits/women/5.jpg', location: 'Nyabugogo', commissionRate: 0.05, totalDeposits: 2500000, pin: '5678', phone: '0788777888' }
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
  const [agentTransactions, setAgentTransactions] = useState([]);

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
      navigate('search', { from, to });
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'login': return <LoginPage onNavigate={navigate} onLogin={handleLogin} />;
      case 'register': return <RegisterPage onNavigate={navigate} />;
      case 'search': return <SearchResultsPage results={allSearchResults} onTripSelect={(trip) => navigate('seatSelection', trip)} />;
      case 'seatSelection': return <SeatSelectionPage onConfirm={() => alert("Proceed to payment")} onBack={() => navigate('search')} tripData={pageData} />;
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
      case 'bookingSearch': return <BookingSearchPage onSearch={handleSearch} navigate={navigate} />;
      
      case 'adminDashboard': case 'adminCompanies': case 'adminDrivers': case 'adminAgents': case 'adminPassengers': case 'adminUsers': case 'adminFinancials': case 'adminAds': case 'adminPromotions':
        return <AdminLayout currentPage={currentPage} navigate={navigate} />;
        
      case 'companyDashboard': case 'companyBuses': case 'companyDrivers': case 'companyRoutes': case 'companyPassengers': case 'companyFinancials': case 'companySettings': case 'fleetMonitoring':
        return <CompanyLayout currentPage={currentPage} navigate={navigate} companyData={user} />;
        
      case 'driverDashboard':
        return <DriverDashboard onLogout={handleLogout} theme={theme} setTheme={setTheme} driverData={mockUsers.driver} allCompanies={[]} onPassengerBoarding={() => {}} navigate={navigate} />;

      case 'agentDashboard':
        return <AgentDashboard onLogout={handleLogout} theme={theme} setTheme={setTheme} agentData={mockUsers.agent} onAgentDeposit={handleAgentDeposit} passengerSerialCode={passengerSerialCode} transactions={agentTransactions} navigate={navigate} />;
        
      case 'driverProfile': return <DriverProfilePage driver={pageData || mockUsers.driver} />;
      case 'agentProfile': return <AgentProfilePage agent={pageData || mockUsers.agent} allTransactions={agentTransactions} />;

      default:
        return (
          <>
            <HeroSection onSearch={handleSearch} />
            <HowItWorks />
            <PartnerCompanies navigate={navigate} />
          </>
        );
    }
  };
  
  const isDashboard = ['adminDashboard', 'companyDashboard', 'driverDashboard', 'agentDashboard', 'adminCompanies', 'adminDrivers', 'adminAgents', 'adminPassengers', 'adminUsers', 'adminFinancials', 'adminAds', 'adminPromotions', 'companyBuses', 'companyDrivers', 'companyRoutes', 'companyPassengers', 'companyFinancials', 'companySettings', 'fleetMonitoring', 'agentProfile', 'driverProfile'].includes(currentPage);
  const showBottomNav = !isDashboard && ['home', 'bookingSearch', 'companies', 'profile', 'services'].includes(currentPage);

  return (
    <div className={`${theme} font-sans bg-white dark:bg-gray-900`}>
        {!isDashboard && (
             <Header 
                currentPage={currentPage} 
                onNavigate={navigate}
                user={user}
                onLogout={handleLogout}
                theme={theme}
                setTheme={setTheme}
             />
        )}
        <main className={isDashboard ? '' : 'pt-20'}>
            <div key={currentPage} className="animate-fade-in">
                {renderPage()}
            </div>
        </main>
        {!isDashboard && <Footer />}
        
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
