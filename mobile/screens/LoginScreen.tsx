import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useAuth, User } from '../hooks/useAuth';

// FIX: Changed property names to snake_case (avatar_url, wallet_balance) to match the User type.
const mockUsers: { [key: string]: User } = {
  passenger: { name: 'Kalisa Jean', email: 'passenger@rwandabus.rw', role: 'passenger', avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg', wallet_balance: 15000 },
  company: { name: 'Volcano Express', email: 'manager@volcano.rw', role: 'company', avatar_url: 'https://pbs.twimg.com/profile_images/1237839357116452865/p-28c8o-_400x400.jpg' },
  admin: { name: 'Admin User', email: 'admin@rwandabus.rw', role: 'admin', avatar_url: 'https://randomuser.me/api/portraits/women/44.jpg' },
  driver: { name: 'John Doe', email: 'driver@volcano.rw', role: 'driver', avatar_url: 'https://randomuser.me/api/portraits/men/4.jpg' },
  agent: { name: 'Jane Smith', email: 'jane.s@agent.rw', role: 'agent', avatar_url: 'https://randomuser.me/api/portraits/women/5.jpg' }
};

export default function LoginScreen({ navigation }) {
    const { setUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        setIsLoading(true);
        // Mock login logic
        setTimeout(() => {
            const role = Object.keys(mockUsers).find(r => email.startsWith(r));
            if (role && password === 'password') {
                setUser(mockUsers[role]);
            } else {
                 Alert.alert("Login Failed", "Invalid email or password. Use 'password' for any role.");
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Log in to your account to continue.</Text>
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
             <Text style={styles.demoText}>Demo: use [role]@rwandabus.rw and 'password'</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Login</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>Don't have an account? <Text style={styles.linkTextBold}>Register</Text></Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#FFFFFF' },
    title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: '#111827' },
    subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 32 },
    input: { backgroundColor: '#F3F4F6', padding: 16, borderRadius: 8, marginBottom: 12, fontSize: 16 },
    demoText: { fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginBottom: 12 },
    button: { backgroundColor: '#0033A0', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    linkText: { textAlign: 'center', marginTop: 24, color: '#6B7280' },
    linkTextBold: { color: '#0033A0', fontWeight: 'bold' }
});