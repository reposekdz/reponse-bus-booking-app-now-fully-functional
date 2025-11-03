import React, { useState, useEffect } from 'react';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import PartnerCompanies from './components/PartnerCompanies';
import BottomNavigation from './components/BottomNavigation';
import CompaniesAside from './components/CompaniesAside';
import NextTripWidget from './components/NextTripWidget';
import LoadingSpinner from './components/LoadingSpinner';
import ServicesAside from './components/ServicesAside'; // New Import

// Pages
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import BookingsPage from './BookingsPage';
import CompaniesPage from './CompaniesPage';
import CompanyProfilePage from './CompanyProfilePage';
import HelpPage from './HelpPage';
import ContactPage from './ContactPage';
import BookingSearchPage from './BookingSearchPage';
import SeatSelectionPage from './SeatSelectionPage';
import ProfilePage from './ProfilePage';
import ServicesPage from './ServicesPage';
import ScheduledTripsPage from './ScheduledTripsPage';
import DriverDashboard from './DriverDashboard';
import AgentDashboard from './AgentDashboard';
import AdminLayout from './admin/AdminLayout';
import CompanyLayout from './company/CompanyLayout';
import DriverProfilePage from './DriverProfilePage';
import AgentProfilePage from './AgentProfilePage';
import PackageDeliveryPage from './PackageDeliveryPage';
import BusCharterPage from './BusCharterPage';

// Data
import { mockCompaniesData } from './admin/AdminDashboard';

export type Page = 
  | 'home' 
  | 'login' 
  | 'register' 
  | 'bookingSearch' 
  | 'seatSelection' 
  | 'bookings' 
  | 'companies' 
  | 'companyProfile' 
  | 'services' 
  | 'help' 
  | 'contact' 
  | 'profile'
  | 'scheduled'
  | 'admin'
  | 'company'
  | 'driver'
  | 'agent'
  | 'driverProfile'
  | 'agentProfile'
  | 'packageDelivery'
  | 'busCharter';


const user = {
    name: 'Kalisa Jean',
    email: 'kalisa.j@example.com',
    memberSince: 'Mutarama 2023',
    walletPin: '1234', // Hardcoded for simulation
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=2070&auto=format&fit=crop'
};

const agentTransactions = [
    { id: 1, passengerName: 'Kalisa Jean', passengerSerial: 'UM1234', amount: 30000, commission: 600, date: '2024-10-25T10:00:00Z'},
    { id: 2, passengerName: 'Mutesi Aline', passengerSerial: 'UM5678', amount: 15000, commission: 300, date: '2024-10-25T11:30:00Z'},
    { id: 3, passengerName: 'Gatete David', passengerSerial: 'UM9012', amount: 5000, commission: 100, date: '2024-10-24T15:00:00Z'},
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageData, setPageData] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'passenger' | 'driver' | 'agent' | 'company' | 'admin'>('passenger');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(true);
  const [showCompaniesAside, setShowCompaniesAside] = useState(false);
  const [showServicesAside, setShowServicesAside] = useState(false);
  const [showNextTripWidget, setShowNextTripWidget] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);

  const [walletData, setWalletData] = useState({
    balance: 25000,
    currency: 'RWF',
    serialCode: 'UM1234',
    transactions: [
        { id: 1, type: 'deposit', description: 'Agent Deposit', amount: 30000, date: '2024-10-20', status: 'completed' },
        { id: 2, type: 'payment', description: 'Volcano Express Ticket', amount: -4500, date: '2024-10-18', status: 'completed' },
    ]
  });

  const [boardingStatus, setBoardingStatus] = useState<Record<string, 'booked' | 'boarded'>>({
      'VK-83AD1': 'booked',
      'VK-83AD2': 'booked',
      'VK-83AD3': 'booked',
      'RT-98CD3': 'booked',
      'RT-98CD4': 'booked',
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    // Check for persisted session
    try {
        const session = localStorage.getItem('rwandaBusSession');
        if (session) {
            const { email } = JSON.parse(session);
            handleLogin({ email }, false); // Don't navigate on auto-login
        }
    } catch (error) {
        console.error("Could not parse session data", error);
    }
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const navigate = (page: Page, data: any = null) => {
    setIsLoading(true);
    setPageData(data);
    setCurrentPage(page);
    window.scrollTo(0, 0);
    setTimeout(() => setIsLoading(false), 300);
  };
  
  const handleLogin = (credentials, rememberMe = false, shouldNavigate = true) => {
    setIsLoggedIn(true);
    // Simple role check based on email
    if (credentials.email?.includes('driver')) setUserRole('driver');
    else if (credentials.email?.includes('agent')) setUserRole('agent');
    else if (credentials.email?.includes('company')) setUserRole('company');
    else if (credentials.email?.includes('admin')) setUserRole('admin');
    else setUserRole('passenger');

    if (rememberMe) {
        localStorage.setItem('rwandaBusSession', JSON.stringify({ email: credentials.email }));
    }
    
    if (shouldNavigate) {
        navigate(credentials.email?.includes('driver') ? 'driver' : credentials.email?.includes('agent') ? 'agent' : credentials.email?.includes('company') ? 'company' : credentials.email?.includes('admin') ? 'admin' : 'home');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('passenger');
    localStorage.removeItem('rwandaBusSession');
    navigate('home');
  };
  
  const handleSearch = (from?: string, to?: string) => {
    navigate('bookingSearch', { from, to });
  };
  
  const handleTripSelect = (trip: any) => {
    const tripWithPriceString = {
        ...trip,
        price: `${new Intl.NumberFormat('fr-RW').format(trip.price)} RWF`
    };
    setSelectedTrip(tripWithPriceString);
    navigate('seatSelection', tripWithPriceString);
  };

  const handleBookingConfirm = (selection: any) => {
    const amountPaid = parseFloat(selection.totalPrice.replace(/[^0-9.-]+/g, ""));
    const newBalance = walletData.balance - amountPaid;

    const newTransaction = {
        id: Date.now(),
        type: 'payment',
        description: `${selection.tripData.company} Ticket`,
        amount: -amountPaid,
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
    };

    setWalletData(prev => ({
        ...prev,
        balance: newBalance,
        transactions: [newTransaction, ...prev.transactions]
    }));
  };
  
  const handlePassengerBoarding = (ticketId: string) => {
      setBoardingStatus(prev => ({ ...prev, [ticketId]: 'boarded' }));
  };

  const handleWalletUpdate = (data) => {
      setWalletData(data);
  }

  const handleAgentDeposit = (serialCode: string, amount: number) => {
      if (serialCode.toUpperCase() === walletData.serialCode) {
          const commission = amount * 0.02; // 2% commission
          setWalletData(prev => ({
              ...prev,
              balance: prev.balance + amount,
              transactions: [{
                  id: Date.now(),
                  type: 'deposit',
                  description: 'Agent Deposit',
                  amount: amount,
                  date: new Date().toISOString(),
                  status: 'completed'
              }, ...prev.transactions]
          }));
          return { success: true, passengerName: 'Kalisa Jean', commission };
      }
      return { success: false, message: 'Kode y\'umugenzi itariyo.' };
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login': return <LoginPage onLogin={handleLogin} onNavigate={navigate} />;
      case 'register': return <RegisterPage onNavigate={navigate} />;
      case 'bookingSearch': return <BookingSearchPage onTripSelect={handleTripSelect} initialSearch={pageData} />;
      case 'seatSelection': return <SeatSelectionPage tripData={pageData} onConfirm={handleBookingConfirm} navigate={navigate} walletData={walletData} user={user} />;
      case 'bookings': return <BookingsPage />;
      case 'companies': return <CompaniesPage onNavigate={navigate} />;
      case 'companyProfile': return <CompanyProfilePage company={pageData} onSelectTrip={handleSearch} />;
      case 'services': return <ServicesPage onNavigate={navigate} onToggleServicesAside={() => setShowServicesAside(true)} />;
      case 'help': return <HelpPage />;
      case 'contact': return <ContactPage />;
      case 'profile': return <ProfilePage user={user} walletData={walletData} onWalletUpdate={handleWalletUpdate} boardingStatus={boardingStatus} onSearch={handleSearch} />;
      case 'scheduled': return <ScheduledTripsPage onSearch={handleSearch} />;
      case 'driverProfile': return <DriverProfilePage driver={pageData || {}} />;
      case 'agentProfile': return <AgentProfilePage agent={pageData} allTransactions={agentTransactions} />;
      case 'packageDelivery': return <PackageDeliveryPage onNavigate={navigate} />;
      case 'busCharter': return <BusCharterPage onNavigate={navigate} />;
      case 'admin': return <AdminLayout onLogout={handleLogout} theme={theme} setTheme={setTheme} navigate={navigate} />;
      case 'company': return <CompanyLayout onLogout={handleLogout} theme={theme} setTheme={setTheme} companyData={{...mockCompaniesData[0], pin: '5678'}} />;
      case 'driver': return <DriverDashboard onLogout={handleLogout} theme={theme} setTheme={setTheme} driverData={{ id: 1, name: 'John Doe', avatarUrl: user.avatarUrl, assignedBusId: 'VB01' }} allCompanies={mockCompaniesData} onPassengerBoarding={handlePassengerBoarding} navigate={(page, data) => navigate(page, data)} />;
      case 'agent': return <AgentDashboard onLogout={handleLogout} theme={theme} setTheme={setTheme} agentData={{ id: 1, name: 'Jane Smith', location: 'Nyabugogo', pin: '9999' }} onAgentDeposit={handleAgentDeposit} passengerSerialCode={walletData.serialCode} transactions={agentTransactions} />;
      case 'home':
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

  const isDashboard = ['admin', 'company', 'driver', 'agent'].includes(currentPage);

  return (
    <div className={`${theme} bg-white dark:bg-gray-900`}>
      {isLoading && <LoadingSpinner />}
      {!isDashboard && <Header 
        navigate={navigate} 
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        theme={theme}
        setTheme={setTheme}
        currentPage={currentPage}
        onToggleCompaniesAside={() => setShowCompaniesAside(true)}
        onToggleServicesAside={() => setShowServicesAside(true)}
      />}
      
      <main className={!isDashboard ? "pt-[68px] pb-20 md:pb-0" : ""}>
        {renderPage()}
      </main>

      {!isDashboard && <Footer />}
      {!isDashboard && <BottomNavigation navigate={navigate} currentPage={currentPage} />}
      {!isDashboard && <CompaniesAside isOpen={showCompaniesAside} onClose={() => setShowCompaniesAside(false)} navigate={navigate} />}
      {!isDashboard && <ServicesAside isOpen={showServicesAside} onClose={() => setShowServicesAside(false)} navigate={navigate} />}
      
      {isLoggedIn && userRole === 'passenger' && showNextTripWidget && currentPage === 'home' && (
        <NextTripWidget 
            trip={{ route: 'Kigali - Rubavu', departureTime: '07:00 AM', company: 'Volcano Express' }}
            onDismiss={() => setShowNextTripWidget(false)}
            onTrack={() => navigate('bookings')}
        />
      )}
    </div>
  );
};

export default App;