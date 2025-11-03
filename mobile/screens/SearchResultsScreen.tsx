// New screen to display search results for bus trips.

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const searchResults = [
  { id: '1', company: 'Volcano Express', from: 'Kigali', to: 'Rubavu', departureTime: '07:00', arrivalTime: '10:30', price: 4500, availableSeats: 23 },
  { id: '2', company: 'Horizon Express', from: 'Kigali', to: 'Rubavu', departureTime: '08:30', arrivalTime: '12:15', price: 4800, availableSeats: 15 },
  { id: '3', company: 'RITCO', from: 'Kigali', to: 'Rubavu', departureTime: '09:00', arrivalTime: '12:30', price: 4500, availableSeats: 0 },
];

const TripCard = ({ trip, onPress }) => (
    <TouchableOpacity style={styles.tripCard} onPress={onPress} disabled={trip.availableSeats === 0}>
        <View>
            <Text style={styles.company}>{trip.company}</Text>
            <View style={styles.timeContainer}>
                <Text style={styles.time}>{trip.departureTime}</Text>
                <Text style={styles.arrow}> → </Text>
                <Text style={styles.time}>{trip.arrivalTime}</Text>
            </View>
        </View>
        <View style={styles.priceContainer}>
            <Text style={styles.price}>{new Intl.NumberFormat('fr-RW').format(trip.price)} RWF</Text>
            <Text style={trip.availableSeats > 0 ? styles.seatsAvailable : styles.seatsFull}>
                {trip.availableSeats > 0 ? `${trip.availableSeats} seats left` : 'Full'}
            </Text>
        </View>
    </TouchableOpacity>
);

export default function SearchResultsScreen({ route, navigation }) {
    // const { from, to } = route.params; // In a real app
    const from = "Kigali";
    const to = "Rubavu";

    const handleSelectTrip = (trip) => {
        navigation.navigate('SeatSelection', { trip });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backButton}>{'<'}</Text></TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>{from} to {to}</Text>
                    <Text style={styles.headerSubtitle}>October 28, 2024</Text>
                </View>
            </View>
            <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <TripCard trip={item} onPress={() => handleSelectTrip(item)} />}
                contentContainerStyle={styles.list as any}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: {
        padding: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        fontSize: 24,
        fontWeight: 'bold',
        marginRight: 16,
        color: '#0033A0',
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    headerSubtitle: { fontSize: 14, color: '#6B7280' },
    list: { padding: 20 },
    tripCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    company: { fontSize: 16, fontWeight: '600', color: '#374151' },
    timeContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    time: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
    arrow: { color: '#9CA3AF' },
    priceContainer: { alignItems: 'flex-end' },
    price: { fontSize: 18, fontWeight: 'bold', color: '#059669' },
    seatsAvailable: { fontSize: 12, color: '#6B7280', marginTop: 4 },
    seatsFull: { fontSize: 12, color: '#EF4444', fontWeight: '600', marginTop: 4 },
});