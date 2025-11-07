// New screen to confirm a successful booking.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CheckIcon = () => <Text style={styles.checkIcon}>✓</Text>;

export default function BookingConfirmationScreen({ navigation }) {
    const pointsEarned = Math.floor((Math.random() * 50) + 50); // Mock points

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <CheckIcon />
                </View>
                <Text style={styles.title}>Booking Confirmed!</Text>
                <Text style={styles.subtitle}>Your ticket has been sent to your email. You can also find it in the "My Tickets" section.</Text>
                
                <Text style={styles.pointsText}>✨ You've earned {pointsEarned} GoPoints! ✨</Text>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Kigali to Rubavu</Text>
                    <Text style={styles.cardCompany}>Volcano Express</Text>
                    <View style={styles.divider} />
                    <Text style={styles.cardDetails}>Date: Oct 28, 2024</Text>
                    <Text style={styles.cardDetails}>Seats: A5, B2</Text>
                </View>

                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => navigation.navigate('MyTickets')}
                >
                    <Text style={styles.buttonText}>View My Tickets</Text>
                </TouchableOpacity>

                 <TouchableOpacity onPress={() => navigation.popToTop()}>
                    <Text style={styles.homeLink}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#10B981',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    checkIcon: {
        color: 'white',
        fontSize: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 16,
    },
    pointsText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#D97706',
        marginBottom: 24,
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        marginBottom: 24,
    },
    cardTitle: { fontSize: 20, fontWeight: 'bold' },
    cardCompany: { color: '#6B7280', marginBottom: 12 },
    divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 },
    cardDetails: { fontSize: 14, color: '#374151', marginBottom: 4 },
    button: {
        backgroundColor: '#0033A0',
        padding: 16,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    homeLink: {
        marginTop: 20,
        color: '#0033A0',
        fontWeight: '600',
    }
});