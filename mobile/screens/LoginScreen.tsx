import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useAuth, User } from '../hooks/useAuth';

const userProfiles: { [key: string]: Omit<User, 'email'> } = {
    passenger: { name: 'Kalisa Jean', role: 'passenger' as const, avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop', walletBalance: 25000 },
    agent: { name: 'Jane Smith', role: 'agent' as const, avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop' },
    driver: { name: 'Peter Jones', role: 'driver' as const, avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop', company: 'Volcano Express', assignedBus: 'RAD 123 B' },
    company: { name: 'John Manager', role: 'company' as const, avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop', company: 'Volcano Express' },
};


export default function LoginScreen({ navigation }) {
    const { setUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert("Missing Fields", "Please enter both email and password.");
            return;
        }
        setIsLoading(true);
        // Mock login with role detection from email
        setTimeout(() => {
            const emailLower = email.toLowerCase();
            let userToSet: User;

            if (emailLower.includes('driver')) {
                userToSet = { ...userProfiles.driver, email };
            } else if (emailLower.includes('agent')) {
                 userToSet = { ...userProfiles.agent, email };
            } else if (emailLower.includes('company')) {
                 userToSet = { ...userProfiles.company, email };
            } else {
                 userToSet = { ...userProfiles.passenger, email };
            }
            
            setUser(userToSet);
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
             <Text style={styles.demoText}>Demo: use 'driver@test.com' or 'company@test.com' to see other roles.</Text>
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