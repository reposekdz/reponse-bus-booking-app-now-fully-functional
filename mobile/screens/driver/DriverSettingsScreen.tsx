import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';

const Section = ({ title, children }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionCard}>
            {children}
        </View>
    </View>
);

// FIX: The 'description' prop was inferred as required, causing errors where it was omitted.
// Adding a default value makes it optional, aligning with its usage.
const SettingsRow = ({ label, description = null, children }) => (
    <View style={styles.row}>
        <View style={styles.rowTextContainer}>
            <Text style={styles.rowLabel}>{label}</Text>
            {description && <Text style={styles.rowDescription}>{description}</Text>}
        </View>
        {children}
    </View>
);

export default function DriverSettingsScreen({ navigation }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState({
        newTrips: true,
        scheduleChanges: true,
    });
    
    const toggleSwitch = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    }

    return (
        <SafeAreaView style={styles.container}>
             <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backButton}>{'<'}</Text></TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                <Section title="Preferences">
                    <SettingsRow label="Dark Mode">
                        <Switch disabled value={false} />
                    </SettingsRow>
                    <View style={styles.divider}/>
                    <SettingsRow label="New Trip Assignments" description="Get notified for new trips.">
                        <Switch value={notifications.newTrips} onValueChange={() => toggleSwitch('newTrips')} />
                    </SettingsRow>
                    <View style={styles.divider}/>
                    <SettingsRow label="Schedule Changes" description="Alerts for trip time changes.">
                         <Switch value={notifications.scheduleChanges} onValueChange={() => toggleSwitch('scheduleChanges')} />
                    </SettingsRow>
                </Section>
                
                 <Section title="Account">
                    <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                        <SettingsRow label="Edit Profile">
                           <Text style={styles.arrow}>{'>'}</Text>
                        </SettingsRow>
                    </TouchableOpacity>
                     <View style={styles.divider}/>
                     <TouchableOpacity onPress={() => alert('Navigate to Change Password screen')}>
                        <SettingsRow label="Change Password">
                            <Text style={styles.arrow}>{'>'}</Text>
                        </SettingsRow>
                    </TouchableOpacity>
                </Section>

                <Section title="Company Info">
                    <Text style={styles.companyName}>{user?.company || 'Volcano Express'}</Text>
                    <Text style={styles.companyContact}>Support: 0788 123 456</Text>
                    <Text style={styles.companyContact}>Email: contact@volcano.rw</Text>
                </Section>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center' },
    backButton: { fontSize: 24, fontWeight: 'bold', marginRight: 16, color: '#0033A0' },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    content: { padding: 20 },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 14, fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', marginBottom: 8 },
    sectionCard: { backgroundColor: 'white', borderRadius: 12 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    rowTextContainer: { flex: 1, marginRight: 16 },
    rowLabel: { fontSize: 16, color: '#1F2937' },
    rowDescription: { fontSize: 12, color: '#6B7280', marginTop: 4 },
    divider: { height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 16 },
    arrow: { fontSize: 20, color: '#D1D5DB' },
    companyName: { fontSize: 16, fontWeight: 'bold' },
    companyContact: { color: '#6B7280', marginTop: 4 },
});