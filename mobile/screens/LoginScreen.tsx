import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/useAuth';

// FIX: Use 'as const' to prevent TypeScript from widening the 'role' property to a generic 'string'.
const userProfiles = {
    passenger: { name: 'Kalisa Jean', email: 'passenger@test.com', role: 'passenger' as const, avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop' },
    agent: { name: 'Jane Smith', email: 'agent@test.com', role: 'agent' as const, avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop' },
    driver: { name: 'Peter Jones', email: 'driver@test.com', role: 'driver' as const, avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop' },
};

export default function LoginScreen({ navigation }) {
    const { setUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        setIsLoading(true);
        // Mock login with role detection
        setTimeout(() => {
            let userToSet = userProfiles.passenger;
            const emailLower = email.toLowerCase();
            if (emailLower.includes('driver')) {
                userToSet = userProfiles.driver;
            } else if (emailLower.includes('agent')) {
                userToSet = userProfiles.agent;
            }
            
            setUser({ ...userToSet, email });
            setIsLoading(false);
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Log in to continue your journey.</Text>
            <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Login</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>Don't have an account? <Text style={styles.linkTextBold}>Register</Text></Text>
            </TouchableOpacity>
             <Text style={styles.demoText}>Demo: use 'driver@test.com' or 'agent@test.com' to see other roles.</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#FFFFFF' },
    title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: '#111827' },
    subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 32 },
    input: { backgroundColor: '#F3F4F6', padding: 16, borderRadius: 8, marginBottom: 12, fontSize: 16 },
    button: { backgroundColor: '#0033A0', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    linkText: { textAlign: 'center', marginTop: 24, color: '#6B7280' },
    linkTextBold: { color: '#0033A0', fontWeight: 'bold' },
    demoText: { textAlign: 'center', marginTop: 40, color: '#9CA3AF', fontSize: 12, fontStyle: 'italic' }
});