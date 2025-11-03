import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const initialPassengers = [
    { id: 1, name: 'Kalisa Jean', seat: 'A5', ticketId: 'VK-83AD1', status: 'booked' },
    { id: 2, name: 'Mutesi Aline', seat: 'A6', ticketId: 'VK-83AD2', status: 'booked' },
    { id: 3, name: 'Gatete David', seat: 'B1', ticketId: 'VK-83AD3', status: 'boarded' },
    { id: 4, name: 'Chris Lee', seat: 'B2', ticketId: 'VK-83AD4', status: 'booked' },
    { id: 5, name: 'Jane Smith', seat: 'C1', ticketId: 'VK-83AD5', status: 'booked' },
];

const PassengerRow = ({ item, onBoard }) => (
    <View style={styles.row}>
        <View style={styles.passengerInfo}>
            <Text style={styles.passengerName}>{item.name}</Text>
            <Text style={styles.seatInfo}>Seat: {item.seat} | ID: {item.ticketId}</Text>
        </View>
        <TouchableOpacity 
            onPress={() => onBoard(item.id)}
            disabled={item.status === 'boarded'}
            style={[styles.statusButton, item.status === 'boarded' ? styles.boardedButton : styles.bookButton]}
        >
            <Text style={styles.statusText}>{item.status === 'boarded' ? 'Boarded' : 'Board'}</Text>
        </TouchableOpacity>
    </View>
);

export default function BoardingScreen() {
    const [passengers, setPassengers] = useState(initialPassengers);
    const [scannedId, setScannedId] = useState('');

    const boardPassenger = (id) => {
        setPassengers(passengers.map(p => p.id === id ? { ...p, status: 'boarded' } : p));
    };
    
    const handleScan = () => {
        const passenger = passengers.find(p => p.ticketId.toUpperCase() === scannedId.toUpperCase());
        if (passenger) {
            if (passenger.status === 'boarded') {
                Alert.alert("Already Boarded", `${passenger.name} has already been marked as boarded.`);
            } else {
                boardPassenger(passenger.id);
                Alert.alert("Success", `${passenger.name} (Seat ${passenger.seat}) has been boarded.`);
            }
        } else {
            Alert.alert("Not Found", "No passenger found with that ticket ID.");
        }
        setScannedId('');
    };

    const boardedCount = passengers.filter(p => p.status === 'boarded').length;
    const totalCount = passengers.length;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Passenger Boarding</Text>
                <Text style={styles.progressText}>{boardedCount} / {totalCount} Boarded</Text>
            </View>
            
            <View style={styles.scanContainer}>
                <TextInput 
                    style={styles.input}
                    placeholder="Enter or Scan Ticket ID"
                    value={scannedId}
                    onChangeText={setScannedId}
                    autoCapitalize="characters"
                />
                <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
                    <Text style={styles.scanButtonText}>Verify</Text>
                </TouchableOpacity>
            </View>
            
            <FlatList
                data={passengers}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => <PassengerRow item={item} onBoard={boardPassenger} />}
                contentContainerStyle={styles.list as any}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    headerTitle: { fontSize: 24, fontWeight: 'bold' },
    progressText: { fontSize: 16, color: '#6B7280', marginTop: 4 },
    scanContainer: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    input: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        padding: 12,
        borderRadius: 8,
        marginRight: 12,
    },
    scanButton: {
        backgroundColor: '#0033A0',
        paddingHorizontal: 20,
        justifyContent: 'center',
        borderRadius: 8,
    },
    scanButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    list: { padding: 20 },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
    },
    passengerInfo: { flex: 1 },
    passengerName: { fontWeight: '600', fontSize: 16 },
    seatInfo: { color: '#6B7280', fontSize: 12, marginTop: 4 },
    statusButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    bookButton: {
        backgroundColor: '#DBEAFE',
    },
    boardedButton: {
        backgroundColor: '#D1FAE5',
    },
    statusText: {
        fontWeight: '600',
        fontSize: 12,
    }
});