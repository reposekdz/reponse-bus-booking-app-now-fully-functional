// Placeholder for LiveTrackingScreen.tsx.
// This screen demonstrates a mobile-first feature.
// It would use react-native-maps for the map and Geolocation API for user location.

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import MapView, { Marker, Polyline } from 'react-native-maps';

// Mock placeholder since we can't import the real MapView
const MapView = (props: any) => <View {...props} style={[styles.map, props.style]}>{props.children}</View>;
const Marker = (props: any) => <View {...props}><Text>{props.title}</Text>{props.children}</View>;
const Polyline = (props: any) => <View {...props} />;


export default function LiveTrackingScreen({ route }) {
  // const { trip } = route.params; // Trip data would be passed via navigation

  const [busPosition, setBusPosition] = useState({ latitude: -1.9441, longitude: 30.0619 }); // Start in Kigali
  const [eta, setEta] = useState('3h 15m');

  // Simulate the bus moving along a route
  useEffect(() => {
    const interval = setInterval(() => {
      setBusPosition(prev => ({
        latitude: prev.latitude - 0.005, // Moving slightly north
        longitude: prev.longitude - 0.01, // Moving slightly west (towards Rubavu)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const routeCoordinates = [
    { latitude: -1.9441, longitude: 30.0619 }, // Kigali
    { latitude: -1.97, longitude: 29.8 },
    { latitude: -1.7, longitude: 29.35 }, // Rubavu
  ];

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>Live Bus Tracking</Text>
            <Text style={styles.subtitle}>Kigali to Rubavu - Volcano Express</Text>
        </View>
        <MapView
            style={styles.map}
            initialRegion={{
            latitude: -1.8,
            longitude: 29.7,
            latitudeDelta: 0.9,
            longitudeDelta: 0.9,
            }}
        >
            <Polyline coordinates={routeCoordinates} strokeColor="#0033A0" strokeWidth={4} />
            <Marker coordinate={{ latitude: -1.7, longitude: 29.35 }} title="Destination: Rubavu" />
            <Marker coordinate={busPosition} title="Your Bus">
                {/* Custom bus icon would go here */}
                <View style={styles.busMarker}><Text>🚌</Text></View>
            </Marker>
        </MapView>
        <View style={styles.infoPanel}>
            <Text style={styles.infoLabel}>Estimated Time of Arrival</Text>
            <Text style={styles.infoValue}>{eta}</Text>
            <Text style={styles.status}>Status: In Transit</Text>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
      padding: 20,
      backgroundColor: 'white',
  },
  title: {
      fontSize: 24,
      fontWeight: 'bold',
  },
  subtitle: {
      fontSize: 14,
      color: '#6B7280',
  },
  map: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  busMarker: {
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 15,
    borderColor: '#0033A0',
    borderWidth: 2,
  },
  infoPanel: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0033A0',
    marginVertical: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  }
});