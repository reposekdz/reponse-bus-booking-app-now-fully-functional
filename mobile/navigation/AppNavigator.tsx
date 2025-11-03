// FIX: Implemented AppNavigator to fix module not found error.
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { Text } from 'react-native';

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

// Agent screens
import AgentDashboardScreen from '../screens/agent/AgentDashboardScreen';
import AgentDepositScreen from '../screens/agent/AgentDepositScreen';
import AgentTransactionsScreen from '../screens/agent/AgentTransactionsScreen';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Mock icons
const Icon = ({ name }) => <Text>{name.substring(0,1)}</Text>;

function PassengerTabs() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: () => <Icon name="Home" />}} />
            <Tab.Screen name="MyTickets" component={MyTicketsScreen} options={{ tabBarIcon: () => <Icon name="Ticket" />}} />
            <Tab.Screen name="LiveTrack" component={LiveTrackingScreen} options={{ tabBarIcon: () => <Icon name="Map" />}} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: () => <Icon name="User" />}} />
        </Tab.Navigator>
    );
}

function AgentTabs() {
     return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="AgentDashboard" component={AgentDashboardScreen} options={{ tabBarIcon: () => <Icon name="Dashboard" />, title: "Dashboard" }} />
            <Tab.Screen name="AgentDeposit" component={AgentDepositScreen} options={{ tabBarIcon: () => <Icon name="Deposit" />, title: "Deposit" }} />
            <Tab.Screen name="AgentTransactions" component={AgentTransactionsScreen} options={{ tabBarIcon: () => <Icon name="Transactions" />, title: "History" }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: () => <Icon name="User" />}} />
        </Tab.Navigator>
    );
}


function AppStack() {
    const { user } = useAuth();
    
    // In a real app, you would have different tabs/stacks per role
    const MainTabs = user?.role === 'agent' ? AgentTabs : PassengerTabs;
    
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
            <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} />
            <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
            <Stack.Screen name="TicketDetails" component={TicketDetailsScreen} />
            <Stack.Screen name="BusCharter" component={BusCharterScreen} />
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
