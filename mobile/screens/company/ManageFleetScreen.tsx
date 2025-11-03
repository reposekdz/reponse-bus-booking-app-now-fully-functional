import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockBuses = [
    { id: '1', plate: 'RAD 123 B', model: 'Yutong Explorer', capacity: 55, status: 'Operational' },
    { id: '2', plate: 'RAE 456 C', model: 'Coaster Bus', capacity: 30, status: 'On Route' },
    { id: '3', plate: 'RAF 789 D', model: 'Scania Marcopolo', capacity: 70, status: 'Maintenance' },
];

const BusCard = ({ bus, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
        <View>
            <Text style={styles.plate}>{bus.plate}</Text>
            <Text style={styles.model}>{bus.model}</Text>
            <Text style={styles.capacity}>{bus.capacity} seats</Text>
        </View>
        <View style={[styles.statusBadge, styles[bus.status.toLowerCase().replace(' ', '')]]}>
            <Text style={styles.statusText}>{bus.status}</Text>
        </View>
    </TouchableOpacity>
);

export default function ManageFleetScreen({ navigation }) {
    const handleAddBus = () => {
        navigation.navigate('AddEditBus');
    };

    const handleEditBus = (bus) => {
        navigation.navigate('AddEditBus', { bus });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Manage Fleet</Text>
                <TouchableOpacity style={styles.addButton} onPress={handleAddBus}>
                    <Text style={styles.addButtonText}>+ Add Bus</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={mockBuses}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <BusCard bus={item} onPress={() => handleEditBus(item)} />}
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
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: { fontSize: 24, fontWeight: 'bold' },
    addButton: { backgroundColor: '#0033A0', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
    addButtonText: { color: 'white', fontWeight: 'bold' },
    list: { padding: 20 },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    plate: { fontSize: 18, fontWeight: 'bold' },
    model: { color: '#6B7280', marginVertical: 4 },
    capacity: { color: '#374151', fontStyle: 'italic' },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusText: { color: 'white', fontWeight: '600', fontSize: 12 },
    operational: { backgroundColor: '#10B981' },
    onroute: { backgroundColor: '#3B82F6' },
    maintenance: { backgroundColor: '#F59E0B' },
});