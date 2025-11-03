// This is the root of the React Native App.
// It sets up the core navigation and theme providers.

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { AuthProvider } from './hooks/useAuth';
import AppNavigator from './navigation/AppNavigator';

// In a real React Native app, you'd have your navigation and providers here.
export default function App() {
  // In a real app, a hook like `useCachedResources` would load fonts/assets.
  // We'll assume resources are ready for this context.

  return (
    <SafeAreaProvider>
      <AuthProvider>
        {/*
          The NavigationContainer is the root of the navigation stack.
          AppNavigator contains all the app's screens and navigation logic (Tabs and Stacks).
        */}
        <AppNavigator />
        <StatusBar barStyle="dark-content" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
