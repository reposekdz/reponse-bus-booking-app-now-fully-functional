
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../contexts/LanguageContext';
import Icon from '../components/Icon';
import { useAuth } from '../hooks/useAuth';

// Mock Form Component
const SearchForm = ({ onSearch }) => {
    const { t } = useLanguage();
    const [from, setFrom] = React.useState('Kigali');
    const [to, setTo] = React.useState('Rubavu');
    return (
        <View style={styles.searchForm}>
            <TextInput placeholder={t('form_from')} style={styles.input} value={from} onChangeText={setFrom} />
            <TextInput placeholder={t('form_to')} style={styles.input} value={to} onChangeText={setTo} />
            <View style={styles.row}>
                <TouchableOpacity style={styles.dateInput}><Text>Today</Text></TouchableOpacity>
                <TouchableOpacity style={styles.passengersInput}><Text>1 {t('form_passengers')}</Text></TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.searchButton} onPress={() => onSearch(from, to)}>
                <Text style={styles.searchButtonText}>{t('form_search_button')}</Text>
            </TouchableOpacity>
        </View>
    );
};

const QuickAction = ({ label, icon, color, onPress }) => (
    <TouchableOpacity style={[styles.quickAction, { backgroundColor: color }]} onPress={onPress}>
        <Icon name={icon} size={24} color="white" />
        <Text style={styles.quickActionText}>{label}</Text>
    </TouchableOpacity>
);

const featuredRoutes = [
    { from: 'Kigali', to: 'Rubavu', image: 'https://images.unsplash.com/photo-1590632313655-e9c5220c4273?q=80&w=2070&auto=format&fit=crop' },
    { from: 'Kigali', to: 'Musanze', image: 'https://www.andbeyond.com/wp-content/uploads/sites/5/one-of-the-reasons-to-visit-rwanda-gorilla.jpg' },
];

export default function HomeScreen({ navigation }) {
  const { t } = useLanguage();
  const { user } = useAuth();

  const handleSearch = (from, to) => {
    navigation.navigate('SearchResults', { from, to });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* App-like Header */}
        <View style={styles.appHeader}>
            <View>
                <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Traveler'}</Text>
                <Text style={styles.subGreeting}>Where to today?</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                 <View style={styles.profilePicPlaceholder} >
                    <Text style={styles.profilePicText}>{user?.name?.charAt(0) || 'U'}</Text>
                 </View>
            </TouchableOpacity>
        </View>

        {/* Wallet Summary Card */}
        <View style={styles.walletSummary}>
             <View>
                 <Text style={styles.walletLabel}>Wallet Balance</Text>
                 <Text style={styles.walletBalance}>{new Intl.NumberFormat('fr-RW').format(user?.wallet_balance || 0)} RWF</Text>
             </View>
             <TouchableOpacity style={styles.topUpBtn} onPress={() => navigation.navigate('Wallet')}>
                 <Text style={styles.topUpText}>Top Up</Text>
             </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <SearchForm onSearch={handleSearch} />
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.content}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
                <QuickAction label="Book" icon="ticket" color="#0033A0" onPress={() => {}} />
                <QuickAction label="Send" icon="briefcase" color="#10B981" onPress={() => navigation.navigate('PackageDelivery')} />
                <QuickAction label="Charter" icon="bus" color="#F59E0B" onPress={() => navigation.navigate('BusCharter')} />
                <QuickAction label="Lost?" icon="search" color="#EF4444" onPress={() => navigation.navigate('LostAndFound')} />
            </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>{t('mobile_home_featured')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredRoutes.map((route) => (
              <TouchableOpacity key={`${route.from}-${route.to}`} style={styles.routeCard} onPress={() => handleSearch(route.from, route.to)}>
                <ImageBackground source={{ uri: route.image }} style={styles.routeImage} imageStyle={{ borderRadius: 12 }}>
                  <View style={styles.routeOverlay} />
                  <Text style={styles.routeText}>{route.from} to {route.to}</Text>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { paddingBottom: 80 },
  appHeader: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'white',
  },
  greeting: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  subGreeting: { fontSize: 14, color: '#6B7280' },
  profilePicPlaceholder: {
      width: 40, height: 40, borderRadius: 20, backgroundColor: '#E5E7EB',
      justifyContent: 'center', alignItems: 'center'
  },
  profilePicText: { fontSize: 18, fontWeight: 'bold', color: '#374151' },
  
  walletSummary: {
      margin: 20,
      padding: 20,
      backgroundColor: '#0033A0',
      borderRadius: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: '#0033A0',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
  },
  walletLabel: { color: '#BFDBFE', fontSize: 12, marginBottom: 4 },
  walletBalance: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  topUpBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  topUpText: { color: 'white', fontWeight: 'bold', fontSize: 12 },

  formContainer: {
    paddingHorizontal: 20,
    marginTop: -10,
  },
  searchForm: {
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 3,
  },
  input: {
      backgroundColor: '#F3F4F6',
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
  },
  row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
  },
  dateInput: {
      flex: 1,
      backgroundColor: '#F3F4F6',
      padding: 12,
      borderRadius: 8,
      marginRight: 8,
  },
  passengersInput: {
      flex: 1,
      backgroundColor: '#F3F4F6',
      padding: 12,
      borderRadius: 8,
      marginLeft: 8,
  },
  searchButton: {
      backgroundColor: '#FBBF24',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      shadowColor: '#FBBF24',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
  },
  searchButtonText: {
      color: '#0033A0',
      fontWeight: 'bold',
      fontSize: 16,
  },
  content: { marginTop: 24, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111827'
  },
  quickActionsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  quickAction: {
      width: '23%',
      aspectRatio: 1,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
  },
  quickActionText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '600',
      marginTop: 4,
  },
  routeCard: {
    width: 200,
    height: 120,
    marginRight: 16,
  },
  routeImage: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 12,
  },
  routeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
  },
  routeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
