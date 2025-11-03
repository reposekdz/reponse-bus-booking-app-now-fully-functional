import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockBuses = [
    { id: 'VB01', plate: 'RAD 123 B', model: 'Yutong Explorer', capacity: 55, status: 'On Route' },
    { id: 'VB02', plate: 'RAD 124 B', model: 'Coaster Bus', capacity: 30, status: 'Idle' },
    { id: 'VB03', plate: 'RAE 456 C', model: 'Yutong Explorer', capacity: 55, status: 'Maintenance' },
];

const BusCard = ({ bus }) => (
    <View style={styles.card}>
        <View>
            <Text style={styles.plate}>{bus.plate}</Text>
            <Text style={styles.model}>{bus.model} - {bus.capacity} seats</Text>
        </View>
        <View style={[styles.statusBadge, styles[bus.status.replace(' ', '')]]}>
            <Text style={styles.statusText}>{bus.status}</Text>
        </View>
    </View>
);

export default function ManageFleetScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Manage Fleet</Text>
                <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>+ Add Bus</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={mockBuses}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <BusCard bus={item} />}
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
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    plate: { fontSize: 16, fontWeight: 'bold' },
    model: { color: '#6B7280', marginTop: 4 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    statusText: { fontSize: 12, fontWeight: '600', color: 'white' },
    OnRoute: { backgroundColor: '#3B82F6' },
    Idle: { backgroundColor: '#10B981' },
    Maintenance: { backgroundColor: '#F59E0B' },
});