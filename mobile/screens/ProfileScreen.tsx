import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';

// Mock Icon
const Icon = ({ name }) => <Text style={{ color: '#6B7280', marginRight: 16, width: 20 }}>{name.substring(0,2)}</Text>;
const Arrow = () => <Text style={{ color: '#9CA3AF' }}>{'>'}</Text>;

const userProfiles = {
    passenger: {
        name: 'Kalisa Jean', email: 'passenger@test.com', role: 'passenger',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop', walletBalance: 25000
    },
    agent: {
        name: 'Jane Smith', email: 'agent@test.com', role: 'agent',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop'
    },
    company: {
        name: 'John Manager', email: 'manager@volcano.rw', role: 'company',
        avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop'
    },
    driver: {
        name: 'Peter Jones', email: 'driver@volcano.rw', role: 'driver',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'
    },
    admin: {
        name: 'Admin User', email: 'admin@rwandabus.rw', role: 'admin',
        avatarUrl: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?q=80&w=1964&auto=format&fit=crop'
    }
};

const ProfileOption = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.option} onPress={onPress}>
        <Icon name={icon} />
        <Text style={styles.optionLabel}>{label}</Text>
        <Arrow />
    </TouchableOpacity>
);

export default function ProfileScreen({ navigation }) {
    const { user, setUser } = useAuth();
    
    const handleNavigation = (screen: string) => {
        navigation.navigate(screen);
    }

    const handleLogout = () => {
        setUser(null);
    }

    const switchRole = (role) => {
        setUser(userProfiles[role]);
    }

    if (!user) {
        return null; // Should be handled by AppNavigator
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.profileHeader}>
                    <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.email}>{user.email}</Text>
                    <Text style={styles.roleBadge}>{user.role}</Text>
                </View>

                {user.role === 'passenger' && (
                    <View style={styles.walletCard}>
                        <Text style={styles.walletLabel}>Wallet Balance</Text>
                        <Text style={styles.walletBalance}>{new Intl.NumberFormat('fr-RW').format(user.walletBalance || 0)} RWF</Text>
                        <TouchableOpacity style={styles.walletButton} onPress={() => alert('Manage Wallet')}>
                            <Text style={styles.walletButtonText}>Manage Wallet</Text>
                        </TouchableOpacity>
                    </View>
                )}
                
                <View style={styles.menu}>
                    <ProfileOption icon="User" label="Edit Profile" onPress={() => handleNavigation('EditProfile')} />
                    <ProfileOption icon="Bell" label="Notifications" onPress={() => alert('Notifications')} />
                    <ProfileOption icon="Shield" label="Security" onPress={() => alert('Security')} />
                </View>

                <View style={styles.menu}>
                     <ProfileOption icon="Help" label="Help Center" onPress={() => alert('Help Center')} />
                     <ProfileOption icon="Info" label="About Us" onPress={() => alert('About Us')} />
                </View>

                {/* Developer Role Switcher */}
                <View style={styles.menu}>
                    <Text style={styles.devTitle}>Developer: Switch Role</Text>
                    <ProfileOption icon="Ps" label="Switch to Passenger" onPress={() => switchRole('passenger')} />
                    <ProfileOption icon="Ag" label="Switch to Agent" onPress={() => switchRole('agent')} />
                    <ProfileOption icon="Co" label="Switch to Company" onPress={() => switchRole('company')} />
                    <ProfileOption icon="Dr" label="Switch to Driver" onPress={() => switchRole('driver')} />
                    <ProfileOption icon="Ad" label="Switch to Admin" onPress={() => switchRole('admin')} />
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
    roleBadge: {
        marginTop: 8,
        backgroundColor: '#E5E7EB',
        color: '#374151',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        overflow: 'hidden'
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
    devTitle: {
        padding: 16,
        paddingBottom: 0,
        color: '#9CA3AF',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase'
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