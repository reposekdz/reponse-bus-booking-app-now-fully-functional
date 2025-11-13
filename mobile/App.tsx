
import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './hooks/useAuth';
import useCachedResources from './hooks/useCachedResources';
import { LanguageProvider } from '../contexts/LanguageContext';

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null; // Or a splash screen
  }

  return (
    <AuthProvider>
      <LanguageProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </LanguageProvider>
    </AuthProvider>
  );
}