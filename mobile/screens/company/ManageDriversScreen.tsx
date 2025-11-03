import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockDrivers = [
    { id: 1, name: 'John Doe', assignedBusId: 'VB01', phone: '0788111222', status: 'Active', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop' },
    { id: 2, name: 'Mike Ross', assignedBusId: 'VB02', phone: '0788333444', status: 'On Leave', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop' },
];

const DriverCard = ({ driver }) => (
    <View style={styles.card}>
        <Image source={{ uri: driver.avatarUrl }} style={styles.avatar} />
        <View style={styles.info}>
            <Text style={styles.name}>{driver.name}</Text>
            <Text style={styles.details}>Bus: {driver.assignedBusId} | Phone: {driver.phone}</Text>
        </View>
        <Text style={[styles.status, { color: driver.status === 'Active' ? '#10B981' : '#F59E0B' }]}>{driver.status}</Text>
    </View>
);

export default function ManageDriversScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Manage Drivers</Text>
                <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>+ Add Driver</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={mockDrivers}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => <DriverCard driver={item} />}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { fontSize: 24, fontWeight: 'bold' },
    addButton: { backgroundColor: '#0033A0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
    addButtonText: { color: 'white', fontWeight: '600' },
    list: { padding: 20 },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
    info: { flex: 1 },
    name: { fontSize: 16, fontWeight: 'bold' },
    details: { color: '#6B7280', fontSize: 12, marginTop: 4 },
    status: { fontWeight: '600', fontSize: 12 },
});