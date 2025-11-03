// Placeholder for MyTicketsScreen.tsx in a React Native app.
// This screen would fetch tickets and store them for offline use via AsyncStorage.

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// In a real app, you would use this:
// import AsyncStorage from '@react-native-async-storage/async-storage';

import BookingCard from '../components/BookingCard';

// Mock AsyncStorage for demonstration in a web environment
const mockAsyncStorage = {
    _data: {},
    setItem: async (key, value) => {
        mockAsyncStorage._data[key] = value;
        return Promise.resolve(null);
    },
    getItem: async (key) => {
        return Promise.resolve(mockAsyncStorage._data[key] || null);
    },
};
const AsyncStorage = mockAsyncStorage;
const TICKETS_STORAGE_KEY = '@RwandaBus:tickets';


const mockUpcomingTickets = [
  { id: '1', company: 'Volcano Express', from: 'Kigali', to: 'Rubavu', date: '28 Oct, 2024', time: '07:00 AM', seats: 'A5, A6', qrValue: 'VK-83AD1' },
];

const mockPastTickets = [
  { id: '2', company: 'RITCO', from: 'Kigali', to: 'Huye', date: '15 Sep, 2024', time: '09:30 AM', seats: 'C1', qrValue: 'RT-98CD3' },
];

// Mock API fetch function
const fetchTicketsAPI = async (type) => {
    console.log(`Fetching ${type} tickets from API...`);
    return new Promise(resolve => {
        setTimeout(() => {
            if (type === 'Upcoming') {
                resolve(mockUpcomingTickets);
            } else {
                resolve(mockPastTickets);
            }
        }, 800);
    });
};


export default function MyTicketsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // This effect simulates loading tickets from local storage (for offline access)
  // and then fetching fresh data from an API.
  useEffect(() => {
    const loadTickets = async () => {
      setIsLoading(true);
      
      // Step 1: For upcoming tickets, try to load from storage first for offline capability.
      // This provides an instant view of tickets even without internet.
      if (activeTab === 'Upcoming') {
        try {
          const storedTicketsJSON = await AsyncStorage.getItem(TICKETS_STORAGE_KEY);
          if (storedTicketsJSON) {
            console.log("Loaded upcoming tickets from local storage.");
            setTickets(JSON.parse(storedTicketsJSON));
          }
        } catch (e) {
          console.warn('Error reading tickets from storage', e);
        }
      }

      // Step 2: Fetch fresh data from API to update the list.
      try {
        const fetchedTickets = await fetchTicketsAPI(activeTab);
        setTickets(fetchedTickets as any);
        
        // Step 3: If viewing upcoming tickets, save the fresh data to storage for the next offline view.
        if (activeTab === 'Upcoming') {
          console.log("Saving fresh upcoming tickets to local storage.");
          await AsyncStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(fetchedTickets));
        }
      } catch (e) {
        console.warn('Failed to fetch tickets from API. Displaying stored data.', e);
        // If API fails, the view will gracefully keep showing the stored data.
      } finally {
        setIsLoading(false);
      }
    };

    loadTickets();
  }, [activeTab]);
  
  const handleTicketPress = (ticket) => {
      // navigation.navigate('TicketDetails', { ticket });
      alert(`Navigating to details for ticket: ${ticket.qrValue}`);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tickets</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('Upcoming')} style={[styles.tab, activeTab === 'Upcoming' && styles.activeTab]}>
          <Text style={[styles.tabText, activeTab === 'Upcoming' && styles.activeTabText]}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Past')} style={[styles.tab, activeTab === 'Past' && styles.activeTab]}>
          <Text style={[styles.tabText, activeTab === 'Past' && styles.activeTabText]}>Past</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="white" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
            data={tickets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <BookingCard 
                    ticket={item} 
                    isPast={activeTab === 'Past'} 
                    onPress={() => handleTicketPress(item)}
                />
            )}
            contentContainerStyle={styles.list}
            ListHeaderComponent={() => (
            activeTab === 'Upcoming' && <Text style={styles.offlineNotice}>Your upcoming tickets are available offline.</Text>
            )}
            ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No {activeTab.toLowerCase()} tickets found.</Text>
                </View>
            )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#002B7F' },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#FFFFFF30' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  tabContainer: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: '#001A52',
    borderRadius: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: 'white',
  },
  tabText: {
    color: 'white',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#002B7F',
  },
  list: {
    paddingHorizontal: 20,
  },
  offlineNotice: {
      color: '#A7C7E7',
      textAlign: 'center',
      fontSize: 12,
      marginBottom: 16,
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    color: 'white',
    fontSize: 16,
  },
});