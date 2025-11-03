// New screen for interactive seat selection.

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// FIX: Import SeatStatus type and define a Seat type to ensure correct type inference.
import BusSeat, { SeatStatus } from '../components/BusSeat';

type Seat = {
    id: string;
    status: SeatStatus;
};

const generateSeats = (): Seat[][] => {
    return Array.from({ length: 12 }, (_, i) => [
        { id: `A${i+1}`, status: Math.random() > 0.7 ? 'occupied' : 'available' },
        { id: `B${i+1}`, status: Math.random() > 0.8 ? 'occupied' : 'available' },
        { id: `aisle-${i}`, status: 'aisle' },
        { id: `C${i+1}`, status: Math.random() > 0.6 ? 'occupied' : 'available' },
        { id: `D${i+1}`, status: Math.random() > 0.75 ? 'occupied' : 'available' },
    ]);
};

export default function SeatSelectionScreen({ route, navigation }) {
    // const { trip } = route.params; // In a real app
    const trip = { price: 4500, company: 'Volcano Express' };
    
    const [seats, setSeats] = useState(generateSeats());
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    const handleSelectSeat = (seatId: string) => {
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(id => id !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };
    
    const totalPrice = selectedSeats.length * trip.price;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backButton}>{'<'}</Text></TouchableOpacity>
                <Text style={styles.headerTitle}>Select Your Seat</Text>
            </View>
            
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.busContainer}>
                    <View style={styles.driverArea}><Text>Driver</Text></View>
                    {seats.map((row, rowIndex) => (
                        <View key={rowIndex} style={styles.seatRow}>
                            {row.map(seat => (
                                <BusSeat 
                                    key={seat.id} 
                                    seatId={seat.id}
                                    status={selectedSeats.includes(seat.id) ? 'selected' : seat.status} 
                                    onPress={handleSelectSeat}
                                />
                            ))}
                        </View>
                    ))}
                </View>
                 <View style={styles.legendContainer}>
                    <View style={styles.legendItem}><View style={[styles.legendBox, styles.available]} /><Text>Available</Text></View>
                    <View style={styles.legendItem}><View style={[styles.legendBox, styles.occupied]} /><Text>Occupied</Text></View>
                    <View style={styles.legendItem}><View style={[styles.legendBox, styles.selected]} /><Text>Selected</Text></View>
                </View>
            </ScrollView>
            
            <View style={styles.footer}>
                <View>
                    <Text style={styles.totalPrice}>{new Intl.NumberFormat('fr-RW').format(totalPrice)} RWF</Text>
                    <Text style={styles.seatsSelected}>{selectedSeats.length} seat(s) selected</Text>
                </View>
                <TouchableOpacity 
                    style={[styles.confirmButton, selectedSeats.length === 0 && styles.disabledButton]}
                    disabled={selectedSeats.length === 0}
                    onPress={() => navigation.navigate('BookingConfirmation')}
                >
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center' },
    backButton: { fontSize: 24, fontWeight: 'bold', marginRight: 16, color: '#0033A0' },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    scrollContainer: { padding: 20 },
    busContainer: {
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        padding: 16,
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    driverArea: {
        height: 50,
        backgroundColor: '#D1D5DB',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    seatRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    legendContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
    legendItem: { flexDirection: 'row', alignItems: 'center' },
    legendBox: { width: 14, height: 14, borderRadius: 3, marginRight: 6 },
    available: { backgroundColor: '#A7C7E7' },
    occupied: { backgroundColor: '#D1D5DB' },
    selected: { backgroundColor: '#FBBF24' },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    totalPrice: { fontSize: 22, fontWeight: 'bold' },
    seatsSelected: { color: '#6B7280' },
    confirmButton: {
        backgroundColor: '#0033A0',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 8,
    },
    disabledButton: { backgroundColor: '#9CA3AF' },
    confirmButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});