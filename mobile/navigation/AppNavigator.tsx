import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { Text, View } from 'react-native';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import MyTicketsScreen from '../screens/MyTicketsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LiveTrackingScreen from '../screens/LiveTrackingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import SeatSelectionScreen from '../screens/SeatSelectionScreen';
import TicketDetailsScreen from '../screens/TicketDetailsScreen';
import BookingConfirmationScreen from '../screens/BookingConfirmationScreen';
import BusCharterScreen from '../screens/BusCharterScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ServicesScreen from '../screens/ServicesScreen';

// Agent screens
import AgentDashboardScreen from '../screens/agent/AgentDashboardScreen';
import AgentDepositScreen from '../screens/agent/AgentDepositScreen';
import AgentTransactionsScreen from '../screens/agent/AgentTransactionsScreen';
import AgentProfileScreen from '../screens/agent/AgentProfileScreen';

// Company screens
import CompanyDashboardScreen from '../screens/company/CompanyDashboardScreen';
import ManageFleetScreen from '../screens/company/ManageFleetScreen';
import ManageDriversScreen from '../screens/company/ManageDriversScreen';

// Driver screens
import DriverDashboardScreen from '../screens/driver/DriverDashboardScreen';
import BoardingScreen from '../screens/driver/BoardingScreen';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Mock icons
const Icon = ({ name }) => <Text style={{ fontSize: 18 }}>{name.substring(0,2)}</Text>;

// Fallback screen for roles without a full UI
const PlaceholderScreen = ({ route }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Under Construction</Text>
        <Text>{route.params?.role} Dashboard</Text>
    </View>
);

function PassengerTabs() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#0033A0' }}>
            <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: () => <Icon name="Home" />}} />
            <Tab.Screen name="MyTickets" component={MyTicketsScreen} options={{ tabBarIcon: () => <Icon name="Tix" />, title: "Tickets" }} />
            <Tab.Screen name="Services" component={ServicesScreen} options={{ tabBarIcon: () => <Icon name="Serv" /> }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: () => <Icon name="User" />}} />
        </Tab.Navigator>
    );
}

function AgentTabs() {
     return (
        <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#0033A0' }}>
            <Tab.Screen name="AgentDashboard" component={AgentDashboardScreen} options={{ tabBarIcon: () => <Icon name="Dash" />, title: "Dashboard" }} />
            <Tab.Screen name="AgentDeposit" component={AgentDepositScreen} options={{ tabBarIcon: () => <Icon name="Depo" />, title: "Deposit" }} />
            <Tab.Screen name="AgentTransactions" component={AgentTransactionsScreen} options={{ tabBarIcon: () => <Icon name="Hist" />, title: "History" }} />
            <Tab.Screen name="AgentProfile" component={AgentProfileScreen} options={{ tabBarIcon: () => <Icon name="User" />, title: "Profile" }} />
        </Tab.Navigator>
    );
}

function CompanyTabs() {
     return (
        <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#0033A0' }}>
            <Tab.Screen name="CoDashboard" component={CompanyDashboardScreen} options={{ tabBarIcon: () => <Icon name="Dash" />, title: "Dashboard" }} />
            <Tab.Screen name="CoFleet" component={ManageFleetScreen} options={{ tabBarIcon: () => <Icon name="Bus" />, title: "Fleet" }} />
            <Tab.Screen name="CoDrivers" component={ManageDriversScreen} options={{ tabBarIcon: () => <Icon name="Driv" />, title: "Drivers" }} />
            <Tab.Screen name="CoProfile" component={ProfileScreen} options={{ tabBarIcon: () => <Icon name="Prof" />, title: "Profile" }} />
        </Tab.Navigator>
    );
}

function DriverTabs() {
     return (
        <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#0033A0' }}>
            <Tab.Screen name="DriverDashboard" component={DriverDashboardScreen} options={{ tabBarIcon: () => <Icon name="Dash" />, title: "Current Trip" }} />
            <Tab.Screen name="DriverBoarding" component={BoardingScreen} options={{ tabBarIcon: () => <Icon name="Scan" />, title: "Boarding" }} />
            <Tab.Screen name="DriverProfile" component={ProfileScreen} options={{ tabBarIcon: () => <Icon name="User" />, title: "Profile" }} />
        </Tab.Navigator>
    );
}


function AppStack() {
    const { user } = useAuth();
    
    let MainTabs;
    switch(user?.role) {
        case 'passenger': MainTabs = PassengerTabs; break;
        case 'agent': MainTabs = AgentTabs; break;
        case 'company': MainTabs = CompanyTabs; break;
        case 'driver': MainTabs = DriverTabs; break;
        default: MainTabs = () => <PlaceholderScreen route={{ params: { role: user?.role || 'Unknown' }}} />; break;
    }
    
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={MainTabs} />
            {/* Common screens accessible by multiple roles */}
            <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
            <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} />
            <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
            <Stack.Screen name="TicketDetails" component={TicketDetailsScreen} />
            <Stack.Screen name="BusCharter" component={BusCharterScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} />
        </Stack.Navigator>
    );
}

function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    );
}

export default function AppNavigator() {
    const { user } = useAuth();
    return (
        <NavigationContainer>
            {user ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
}