// types.ts
import { NavigatorScreenParams } from '@react-navigation/native';
import { User } from '../hooks/useAuth';

// Define params for each screen
export type HomeStackParamList = {
  HomeMain: undefined;
  SearchResults: { from: string; to: string };
  SeatSelection: { trip: any };
  BookingConfirmation: { trip: any; selectedSeats: string[] };
};

export type TicketsStackParamList = {
  MyTicketsList: undefined;
  TicketDetails: { ticket: any };
};

export type ProfileStackParamList = {
    ProfileMain: undefined;
    EditProfile: undefined;
    DriverSettings: undefined;
};

// Define params for each tab
export type PassengerTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  MyTickets: NavigatorScreenParams<TicketsStackParamList>;
  Services: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

export type DriverTabParamList = {
    Dashboard: undefined;
    Boarding: undefined;
    Profile: NavigatorScreenParams<ProfileStackParamList>;
};

export type CompanyTabParamList = {
    Dashboard: undefined;
    Fleet: undefined;
    Drivers: undefined;
};


// The root stack contains everything, including modals
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  App: NavigatorScreenParams<{
      MainTabs: undefined;
      // Modals
      AddEditBus: { bus?: any };
      AddEditDriver: { driver?: any };
  }>;
};

// This allows us to use useNavigation with type safety
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
