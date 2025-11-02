import React, { useState, useEffect } from 'react';

import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import PartnerCompanies from './components/PartnerCompanies';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import BookingsPage from './BookingsPage';
import CompaniesPage from './CompaniesPage';
import CompanyProfilePage from './CompanyProfilePage';
import HelpPage from './HelpPage';
import ContactPage from './ContactPage';
import SeatSelectionPage from './SeatSelectionPage';
import BookingSearchPage from './BookingSearchPage';
import ProfilePage from './ProfilePage';
import AdminLayout from './admin/AdminLayout';
import CompanyLayout from './company/CompanyLayout';
import DriverDashboard from './DriverDashboard';
import AgentDashboard from './AgentDashboard';
import ServicesPage from './ServicesPage';
import ScheduledTripsPage from './ScheduledTripsPage';
import BottomNavigation from './components/BottomNavigation';
import CompaniesAside from './components/CompaniesAside';
import NextTripWidget from './components/NextTripWidget';
import LoadingSpinner from './components/LoadingSpinner';

import { mockCompaniesData as initialCompanies } from './admin/AdminDashboard';

export type Page =
    | 'home'
    | 'login'
    | 'register'
    | 'bookingSearch'
    | 'bookings'
    | 'companies'
    | 'companyProfile'
    | 'services'
    | 'help'
    | 'contact'
    | 'seatSelection'
    | 'profile'
    | 'adminDashboard'
    | 'companyDashboard'
    | 'driverDashboard'
    | 'agentDashboard'
    | 'scheduled';

const initialDrivers = [
  { id: 'drv1', name: 'James Gatete', assignedBusId: 'VB01', companyId: 'volcano', phone: '0788111111', status: 'Active' },
  { id: 'drv2', name: 'Aline Uwase', assignedBusId: 'RT01', companyId: 'ritco', phone: '0788222222', status: 'Active' },
  { id: 'drv3', name: 'Emmanuel Mugisha', assignedBusId: 'HZ01', companyId: 'horizon', phone: '0788333333', status: 'Inactive' },
];

const initialBuses = [
    { id: 'VB01', plate: 'RAA 123 B', model: 'Yutong Grand', capacity: 65, driverId: 'drv1', status: 'On Route', companyId: 'volcano' },
    { id: 'VB02', plate: 'RAA 456 C', model: 'Scania Marcopolo', capacity: 70, driverId: null, status: 'Idle', companyId: 'volcano' },
    { id: 'RT01', plate: 'RAB 789 D', model: 'Yutong Grand', capacity: 65, driverId: 'drv2', status: 'On Route', companyId: 'ritco' },
];

const App = () => {
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [pageData, setPageData] = useState<any>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState<'user' | 'admin' | 'company' | 'driver' | 'agent' | null>(null);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [isLoading, setIsLoading] = useState(false);
    const [isCompaniesAsideOpen, setIsCompaniesAsideOpen] = useState(false);
    const [nextTrip, setNextTrip] = useState<any | null>(null);

    // Centralized Data State
    const [companies, setCompanies] = useState(initialCompanies);
    const [drivers, setDrivers] = useState(initialDrivers);
    const [buses, setBuses] = useState(initialBuses);
    
    // Boarding Status State
    const [boardingStatus, setBoardingStatus] = useState<Record<string, 'booked' | 'boarded'>>({});
    
    const driverData = { id: 'drv1', name: 'James Gatete', assignedBusId: 'VB01'};
    const agentData = { id: 'agt1', name: 'Aline Uwase', location: 'Nyabugogo' };
    
    const [agentTransactions, setAgentTransactions] = useState([
        { id: 1, passengerName: 'Kalisa Jean', passengerSerial: 'KJ7821', amount: 10000, commission: 200, date: new Date().toISOString() },
        { id: 2, passengerName: 'Mutesi Aline', passengerSerial: 'MA1234', amount: 5000, commission: 100, date: new Date().toISOString() },
    ]);


    // Mock wallet data
    const [walletData, setWalletData] = useState({
        balance: 50000,
        currency: 'RWF',
        serialCode: 'KJ7821',
        transactions: [
            { id: 1, type: 'deposit', description: 'Agent Deposit', amount: 20000, date: '25 Oct, 2024', status: 'completed' },
            { id: 2, type: 'payment', description: 'Ticket to Rubavu', amount: -4500, date: '25 Oct, 2024', status: 'completed' },
            { id: 3, type: 'deposit', description: 'Mobile Money', amount: 35000, date: '15 Oct, 2024', status: 'completed' },
        ]
    });
    
    
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const navigate = (page: Page, data: any = null) => {
        setIsLoading(true);
        setPageData(data);
        setTimeout(() => {
            setCurrentPage(page);
            window.scrollTo(0, 0);
            setIsLoading(false);
        }, 300);
    };

    const handleLogin = (credentials: any) => {
        setIsLoading(true);
        setTimeout(() => {
            if (credentials.email?.includes('admin')) {
                setUserRole('admin');
                setIsLoggedIn(true);
                navigate('adminDashboard');
            } else if (credentials.email?.includes('company')) {
                setUserRole('company');
                setIsLoggedIn(true);
                navigate('companyDashboard');
            } else if (credentials.email?.includes('driver')) {
                setUserRole('driver');
                setIsLoggedIn(true);
                navigate('driverDashboard');
            } else if (credentials.email?.includes('agent')) {
                setUserRole('agent');
                setIsLoggedIn(true);
                navigate('agentDashboard');
            } else {
                setUserRole('user');
                setIsLoggedIn(true);
                navigate('home');
            }
            setIsLoading(false);
        }, 1000);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserRole(null);
        navigate('home');
    };
    
    const handleSearch = (from?: string, to?: string) => {
        navigate('bookingSearch', { from, to });
    };

    const handleTripSelect = (trip: any) => {
        navigate('seatSelection', trip);
    };
    
    const handleBookingConfirm = (selection: any) => {
        setNextTrip({
            route: `${selection.tripData.from} - ${selection.tripData.to}`,
            departureTime: selection.tripData.departureTime,
            company: selection.tripData.company,
        });
        const amount = parseFloat(selection.totalPrice.replace(/[^0-9.-]+/g,""));
        setWalletData(prev => ({
            ...prev,
            balance: prev.balance - amount,
            transactions: [
                 { id: Date.now(), type: 'payment', description: `Ticket to ${selection.tripData.to || 'destination'}`, amount: -amount, date: new Date().toLocaleDateString(), status: 'completed' },
                 ...prev.transactions
            ]
        }))
    };

    const handleAgentDeposit = (serialCode: string, amount: number) => {
        if(serialCode.toUpperCase() === walletData.serialCode){
            setWalletData(prev => ({
                ...prev,
                balance: prev.balance + amount
            }));
             const newTransaction = {
                id: Date.now(),
                passengerName: 'Kalisa Jean',
                passengerSerial: serialCode,
                amount: amount,
                commission: amount * 0.02, // 2% commission
                date: new Date().toISOString()
            };
            setAgentTransactions(prev => [newTransaction, ...prev]);
            return { success: true, passengerName: 'Kalisa Jean' };
        }
        return { success: false, message: 'Passenger serial code not found.' };
    };

    const handlePassengerBoarding = (ticketId: string) => {
        setBoardingStatus(prev => ({ ...prev, [ticketId]: 'boarded' }));
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'login': return <LoginPage onLogin={handleLogin} onNavigate={navigate} />;
            case 'register': return <RegisterPage onNavigate={navigate} />;
            case 'bookings': return <BookingsPage />;
            case 'companies': return <CompaniesPage onNavigate={navigate} />;
            case 'companyProfile': return <CompanyProfilePage company={pageData} onSelectTrip={handleSearch} />;
            case 'services': return <ServicesPage />;
            case 'help': return <HelpPage />;
            case 'contact': return <ContactPage />;
            case 'seatSelection': return <SeatSelectionPage tripData={pageData} onConfirm={handleBookingConfirm} navigate={navigate} walletData={walletData}/>;
            case 'bookingSearch': return <BookingSearchPage onTripSelect={handleTripSelect} />;
            case 'profile': return <ProfilePage walletData={walletData} onWalletUpdate={setWalletData} boardingStatus={boardingStatus} onSearch={handleSearch}/>;
            case 'scheduled': return <ScheduledTripsPage onSearch={handleSearch} />;
            case 'adminDashboard': return <AdminLayout onLogout={handleLogout} theme={theme} setTheme={setTheme} />;
            case 'companyDashboard': return <CompanyLayout onLogout={handleLogout} theme={theme} setTheme={setTheme} />;
            case 'driverDashboard': return <DriverDashboard onLogout={handleLogout} theme={theme} setTheme={setTheme} driverData={driverData} allCompanies={companies} onPassengerBoarding={handlePassengerBoarding}/>
            case 'agentDashboard': return <AgentDashboard onLogout={handleLogout} theme={theme} setTheme={setTheme} agentData={agentData} onAgentDeposit={handleAgentDeposit} passengerSerialCode={walletData.serialCode} transactions={agentTransactions} />;
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
    
    const showHeaderFooter = ![
        'login', 'register', 'adminDashboard', 'companyDashboard', 'driverDashboard', 'agentDashboard'
    ].includes(currentPage);
    
    return (
        <div className={`app-container ${theme} bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200`}>
            {isLoading && <LoadingSpinner />}
            {showHeaderFooter && <Header 
                navigate={navigate}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                theme={theme}
                setTheme={setTheme}
                currentPage={currentPage}
                onToggleCompaniesAside={() => setIsCompaniesAsideOpen(!isCompaniesAsideOpen)}
            />}
            <main className={showHeaderFooter ? "pt-16" : ""}>
                {renderPage()}
            </main>
            {showHeaderFooter && <Footer />}
            {showHeaderFooter && <BottomNavigation navigate={navigate} currentPage={currentPage} />}
            <CompaniesAside isOpen={isCompaniesAsideOpen} onClose={() => setIsCompaniesAsideOpen(false)} navigate={navigate}/>
            {nextTrip && isLoggedIn && <NextTripWidget trip={nextTrip} onDismiss={() => setNextTrip(null)} onTrack={() => { /* logic */ }} />}
        </div>
    );
};

export default App;