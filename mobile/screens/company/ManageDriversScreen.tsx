import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockDrivers = [
    { id: '1', name: 'John Doe', assignedBus: 'RAD 123 B', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop' },
    { id: '2', name: 'Peter Jones', assignedBus: 'RAE 456 C', avatarUrl: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?q=80&w=1964&auto=format&fit=crop' },
];

const DriverCard = ({ driver, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
        <Image source={{ uri: driver.avatarUrl }} style={styles.avatar} />
        <View style={styles.info}>
            <Text style={styles.name}>{driver.name}</Text>
            <Text style={styles.bus}>Bus: {driver.assignedBus}</Text>
        </View>
        <Text style={styles.arrow}>{'>'}</Text>
    </TouchableOpacity>
);

export default function ManageDriversScreen({ navigation }) {
     const handleAddDriver = () => {
        navigation.navigate('AddEditDriver');
    };

    const handleEditDriver = (driver) => {
        navigation.navigate('AddEditDriver', { driver });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Manage Drivers</Text>
                 <TouchableOpacity style={styles.addButton} onPress={handleAddDriver}>
                    <Text style={styles.addButtonText}>+ Add Driver</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={mockDrivers}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <DriverCard driver={item} onPress={() => handleEditDriver(item)} />}
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
        alignItems: 'center',
    },
    avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 16 },
    info: { flex: 1 },
    name: { fontSize: 18, fontWeight: 'bold' },
    bus: { color: '#6B7280', marginTop: 4 },
    arrow: { fontSize: 24, color: '#D1D5DB' },
});