import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const services = [
    { id: 'charter', title: 'Bus Charter', description: 'Request a private bus for your group.', screen: 'BusCharter', icon: '🚌' },
    { id: 'package', title: 'Package Delivery', description: 'Send packages across the country.', screen: null, icon: '📦' },
    { id: 'tours', title: 'Tour Packages', description: 'Explore Rwanda with curated tours.', screen: null, icon: '🗺️' },
];

const ServiceCard = ({ item, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
        <Text style={styles.icon}>{item.icon}</Text>
        <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
        </View>
        <Text style={styles.arrow}>{'>'}</Text>
    </TouchableOpacity>
);

export default function ServicesScreen({ navigation }) {
    
    const handlePress = (service) => {
        if (service.screen) {
            navigation.navigate(service.screen);
        } else {
            alert(`${service.title} is coming soon!`);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Our Services</Text>
            </View>
            <FlatList
                data={services}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <ServiceCard item={item} onPress={() => handlePress(item)} />}
                contentContainerStyle={styles.list as any}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    headerTitle: { fontSize: 28, fontWeight: 'bold' },
    list: { padding: 20 },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    icon: {
        fontSize: 32,
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    description: {
        color: '#6B7280',
        marginTop: 4,
    },
    arrow: {
        fontSize: 24,
        color: '#D1D5DB',
    },
});