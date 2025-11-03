// FIX: Implemented AgentDashboardScreen to fix module not found error.
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AgentDashboardScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>Agent Dashboard</Text>
                {/* Mock content */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Today's Deposits</Text>
                    <Text style={styles.cardValue}>1,250,000 RWF</Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Today's Commission</Text>
                    <Text style={styles.cardValue}>25,000 RWF</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#F3F4F6' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
    card: { backgroundColor: 'white', padding: 20, borderRadius: 12, marginBottom: 16 },
    cardTitle: { color: '#6B7280' },
    cardValue: { fontSize: 24, fontWeight: 'bold', marginTop: 8 },
});
