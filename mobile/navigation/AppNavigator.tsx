import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../hooks/useAuth';
import Icon from '../components/Icon';
import { RootStackParamList, PassengerTabParamList, DriverTabParamList, CompanyTabParamList } from './types';

// --- Screens ---
// Auth
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Passenger Screens
import HomeScreen from '../screens/HomeScreen';
import MyTicketsScreen from '../screens/MyTicketsScreen';
import ServicesScreen from '../screens/ServicesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import SeatSelectionScreen from '../screens/SeatSelectionScreen';
import BookingConfirmationScreen from '../screens/BookingConfirmationScreen';
import TicketDetailsScreen from '../screens/TicketDetailsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

// Driver Screens
import DriverDashboardScreen from '../screens/driver/DriverDashboardScreen';
import BoardingScreen from '../screens/driver/BoardingScreen';
import DriverSettingsScreen from '../screens/driver/DriverSettingsScreen';

// Company Screens
import CompanyDashboardScreen from '../screens/company/CompanyDashboardScreen';
import ManageFleetScreen from '../screens/company/ManageFleetScreen';
import ManageDriversScreen from '../screens/company/ManageDriversScreen';
import AddEditBusScreen from '../screens/company/AddEditBusScreen';
import AddEditDriverScreen from '../screens/company/AddEditDriverScreen';

const Stack = createStackNavigator<RootStackParamList>();
const PassengerTab = createBottomTabNavigator<PassengerTabParamList>();
const DriverTab = createBottomTabNavigator<DriverTabParamList>();
const CompanyTab = createBottomTabNavigator<CompanyTabParamList>();


// --- Stack Navigators for nested screens ---

const HomeStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeMain" component={HomeScreen} />
        <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
        <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} />
        <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
    </Stack.Navigator>
);

const TicketsStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MyTicketsList" component={MyTicketsScreen} />
        <Stack.Screen name="TicketDetails" component={TicketDetailsScreen} />
    </Stack.Navigator>
);

const ProfileStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ProfileMain" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="DriverSettings" component={DriverSettingsScreen} />
    </Stack.Navigator>
)


// --- Role-based Tab Navigators ---

const PassengerTabs = () => (
    <PassengerTab.Navigator screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
            const icons = { Home: 'home', MyTickets: 'ticket', Services: 'briefcase', Profile: 'user-circle' };
            return <Icon name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0033A0',
        tabBarInactiveTintColor: 'gray',
    })}>
        <PassengerTab.Screen name="Home" component={HomeStack} />
        <PassengerTab.Screen name="MyTickets" component={TicketsStack} />
        <PassengerTab.Screen name="Services" component={ServicesScreen} />
        <PassengerTab.Screen name="Profile" component={ProfileStack} />
    </PassengerTab.Navigator>
);

const DriverTabs = () => (
    <DriverTab.Navigator screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
            const icons = { Dashboard: 'chart-bar', Boarding: 'qr-code', Profile: 'user-circle' };
            return <Icon name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0033A0',
        tabBarInactiveTintColor: 'gray',
    })}>
        <DriverTab.Screen name="Dashboard" component={DriverDashboardScreen} />
        <DriverTab.Screen name="Boarding" component={BoardingScreen} />
        <DriverTab.Screen name="Profile" component={ProfileStack} />
    </DriverTab.Navigator>
);

const CompanyTabs = () => (
    <CompanyTab.Navigator screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
            const icons = { Dashboard: 'chart-bar', Fleet: 'bus', Drivers: 'users' };
            return <Icon name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0033A0',
        tabBarInactiveTintColor: 'gray',
    })}>
        <CompanyTab.Screen name="Dashboard" component={CompanyDashboardScreen} />
        <CompanyTab.Screen name="Fleet" component={ManageFleetScreen} />
        <CompanyTab.Screen name="Drivers" component={ManageDriversScreen} />
    </CompanyTab.Navigator>
);

const MainAppStack = () => {
    const { user } = useAuth();
    
    const renderTabsByRole = () => {
        switch (user?.role) {
            case 'driver': return <DriverTabs />;
            case 'company': return <CompanyTabs />;
            // Add Agent and Admin tabs here if needed
            case 'passenger':
            default:
                return <PassengerTabs />;
        }
    }

    return (
         <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={renderTabsByRole} />
            {/* Add any Modal screens that should appear over the tabs here */}
             <Stack.Screen name="AddEditBus" component={AddEditBusScreen} />
             <Stack.Screen name="AddEditDriver" component={AddEditDriverScreen} />
        </Stack.Navigator>
    )
}

const AppNavigator = () => {
    const { user } = useAuth();

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <Stack.Screen name="App" component={MainAppStack} />
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
