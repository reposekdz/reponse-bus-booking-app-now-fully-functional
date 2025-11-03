// FIX: Implemented AgentDepositScreen to fix module not found error.
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AgentDepositScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Make a Deposit</Text>
            <TextInput style={styles.input} placeholder="Passenger Serial Code" />
            <TextInput style={styles.input} placeholder="Amount (RWF)" keyboardType="numeric" />
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Find Passenger & Deposit</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#F3F4F6' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
    input: { backgroundColor: 'white', padding: 16, borderRadius: 8, marginBottom: 12 },
    button: { backgroundColor: '#0033A0', padding: 16, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: 'white', fontWeight: 'bold' },
});
