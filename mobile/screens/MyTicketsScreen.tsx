import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import BookingCard from '../components/BookingCard';

// In a real app, you would use this:
// import AsyncStorage from '@react-native-async-storage/async-storage';
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
  { id: '1', company: 'Volcano Express', from: 'Kigali', to: 'Rubavu', date: '28 Oct, 2024', time: '07:00 AM', seats: 'A5, A6', qrValue: 'VK-83AD1', logoUrl: 'https://seeklogo.com/images/V/volcano-express-logo-F735513A51-seeklogo.com.png' },
];

const mockPastTickets = [
  { id: '2', company: 'RITCO', from: 'Kigali', to: 'Huye', date: '15 Sep, 2024', time: '09:30 AM', seats: 'C1', qrValue: 'RT-98CD3', logoUrl: 'https://www.ritco.rw/wp-content/uploads/2021/03/logo.svg' },
  { id: '3', company: 'Horizon Express', from: 'Huye', to: 'Musanze', date: '15 Sep, 2024', time: '09:00 AM', seats: 'C2', qrValue: 'HZ-45BC2', logoUrl: 'https://media.jobinrwanda.com/logo/horizon-express-ltd-1681284534.png' },
];

const fetchTicketsAPI = async (type) => {
    console.log(`Fetching ${type} tickets from API...`);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(type === 'Upcoming' ? mockUpcomingTickets : mockPastTickets);
        }, 800);
    });
};


export default function MyTicketsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAndFetchTickets = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true); else setIsRefreshing(true);

    if (activeTab === 'Upcoming') {
        try {
            const storedTicketsJSON = await AsyncStorage.getItem(TICKETS_STORAGE_KEY);
            if (storedTicketsJSON) {
                console.log("Loaded upcoming tickets from storage.");
                setTickets(JSON.parse(storedTicketsJSON));
            }
        } catch (e) {
            console.warn('Error reading tickets from storage', e);
        }
    }

    try {
        const fetchedTickets = await fetchTicketsAPI(activeTab) as any[];
        setTickets(fetchedTickets);
        
        if (activeTab === 'Upcoming' && fetchedTickets.length > 0) {
            console.log("Saving fresh upcoming tickets to storage.");
            await AsyncStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(fetchedTickets));
        }
    } catch (e) {
        console.warn('Failed to fetch from API. Displaying stored data.', e);
    } finally {
        if (!isRefresh) setIsLoading(false); else setIsRefreshing(false);
    }
  }, [activeTab]);

  useFocusEffect(
    useCallback(() => {
        loadAndFetchTickets();
    }, [loadAndFetchTickets])
  );
  
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
            contentContainerStyle={styles.list as any}
            refreshControl={
                <RefreshControl 
                    refreshing={isRefreshing}
                    onRefresh={() => loadAndFetchTickets(true)}
                    tintColor="#FFFFFF"
                />
            }
            ListHeaderComponent={() => (
                activeTab === 'Upcoming' && <Text style={styles.offlineNotice}>Pull down to refresh. Your upcoming tickets are available offline.</Text>
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
    marginHorizontal: 20,
    marginTop: 20,
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
    paddingTop: 10,
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