import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stat = ({ label, value }) => (
    <View style={styles.stat}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
    </View>
);

export default function DriverDashboardScreen() {
    const currentTrip = {
        route: 'Kigali - Rubavu',
        departure: '07:00 AM',
        arrival: '10:30 AM',
        busPlate: 'RAD 123 B',
        passengerCount: 38,
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Current Trip</Text>
            </View>
            <View style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.route}>{currentTrip.route}</Text>
                    <View style={styles.timeContainer}>
                        <Text style={styles.time}>{currentTrip.departure}</Text>
                        <Text style={styles.arrow}>→</Text>
                        <Text style={styles.time}>{currentTrip.arrival}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statsRow}>
                        <Stat label="Bus Plate" value={currentTrip.busPlate} />
                        <Stat label="Passengers" value={currentTrip.passengerCount} />
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Notifications</Text>
                    <Text style={styles.placeholder}>No new notifications.</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { padding: 20, backgroundColor: 'white' },
    headerTitle: { fontSize: 28, fontWeight: 'bold' },
    content: { padding: 20 },
    card: { backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 20 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    route: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
    timeContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 8 },
    time: { fontSize: 20, color: '#374151' },
    arrow: { fontSize: 20, color: '#9CA3AF', marginHorizontal: 12 },
    divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 16 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
    stat: { alignItems: 'center' },
    statLabel: { color: '#6B7280', fontSize: 12 },
    statValue: { fontSize: 16, fontWeight: '600', marginTop: 4 },
    placeholder: { color: '#9CA3AF' },
});