// Placeholder for ProfileScreen.tsx.
// This screen is the user's hub for account management, settings, and wallet.

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock Icon
const Icon = ({ name }) => <Text style={{ color: '#6B7280', marginRight: 16 }}>{name}</Text>;
const Arrow = () => <Text style={{ color: '#9CA3AF' }}>></Text>;

const user = {
    name: 'Kalisa Jean',
    email: 'kalisa.j@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop',
    walletBalance: 25000,
};

const ProfileOption = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.option} onPress={onPress}>
        <Icon name={icon} />
        <Text style={styles.optionLabel}>{label}</Text>
        <Arrow />
    </TouchableOpacity>
);

export default function ProfileScreen({ navigation }) {
    
    const handleNavigation = (screen: string) => {
        // In a real app, you would navigate. For this demo, we'll alert.
        // navigation.navigate(screen);
        alert(`Would navigate to ${screen} screen`);
    }

    const handleLogout = () => {
        // Logic to clear user session and navigate to Auth flow
        alert('Logging out...');
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.profileHeader}>
                    <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.email}>{user.email}</Text>
                </View>

                <View style={styles.walletCard}>
                    <Text style={styles.walletLabel}>Wallet Balance</Text>
                    <Text style={styles.walletBalance}>{new Intl.NumberFormat('fr-RW').format(user.walletBalance)} RWF</Text>
                    <TouchableOpacity style={styles.walletButton} onPress={() => handleNavigation('Wallet')}>
                        <Text style={styles.walletButtonText}>Manage Wallet</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.menu}>
                    <ProfileOption icon="User" label="Edit Profile" onPress={() => handleNavigation('EditProfile')} />
                    <ProfileOption icon="Bell" label="Notifications" onPress={() => handleNavigation('Notifications')} />
                    <ProfileOption icon="Shield" label="Security" onPress={() => handleNavigation('Security')} />
                    <ProfileOption icon="Globe" label="Language" onPress={() => handleNavigation('Language')} />
                </View>

                <View style={styles.menu}>
                     <ProfileOption icon="Help" label="Help Center" onPress={() => handleNavigation('HelpCenter')} />
                     <ProfileOption icon="Info" label="About Us" onPress={() => handleNavigation('AboutUs')} />
                </View>
                
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    profileHeader: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: 'white',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    name: {
        marginTop: 12,
        fontSize: 22,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 14,
        color: '#6B7280',
    },
    walletCard: {
        margin: 20,
        padding: 20,
        borderRadius: 16,
        backgroundColor: '#0033A0',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    walletLabel: {
        color: '#A7C7E7',
        fontSize: 14,
    },
    walletBalance: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    walletButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 8,
    },
    walletButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    menu: {
        marginHorizontal: 20,
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    optionLabel: {
        flex: 1,
        fontSize: 16,
    },
    logoutButton: {
        marginHorizontal: 20,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
    },
    logoutText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '600',
    },
});