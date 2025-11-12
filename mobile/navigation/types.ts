
// types.ts
import { NavigatorScreenParams } from '@react-navigation/native';

// Define params for each screen that receives them
type SearchResultsParams = { from: string; to: string };
type SeatSelectionParams = { trip: any };
type BookingConfirmationParams = { trip: any; selectedSeats: string[] };
type TicketDetailsParams = { ticket: any };
type AddEditBusParams = { bus?: any };
type AddEditDriverParams = { driver?: any };

// The root stack contains everything, including modals and nested navigators
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainApp: undefined; // This will hold the tab navigators
  // Screens that can be pushed on top of any tab
  SearchResults: SearchResultsParams;
  SeatSelection: SeatSelectionParams;
  BookingConfirmation: BookingConfirmationParams;
  TicketDetails: TicketDetailsParams;
  DriverBoarding: undefined;
  BusCharter: undefined;
  LostAndFound: undefined;
  PackageDelivery: undefined;
  ReportLostItem: undefined;
  // Modals or forms
  AddEditBus: AddEditBusParams;
  AddEditDriver: AddEditDriverParams;
  // Profile stack screens
  EditProfile: undefined;
  Wallet: undefined;
  Loyalty: undefined;
  ProfileMain: undefined; // Add this for the ProfileNavigator
};

// This allows us to use useNavigation with type safety
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
