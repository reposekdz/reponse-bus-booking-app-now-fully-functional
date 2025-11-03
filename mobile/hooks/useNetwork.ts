import { useState, useEffect } from 'react';
import { AppState } from 'react-native';

// This is a mock hook. A real implementation would use a library
// like @react-native-community/netinfo.
export default function useNetwork() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // In a real app, you would add event listeners to NetInfo here.
    // For this demo, we'll toggle the network status every 10 seconds
    // to simulate connectivity changes.
    console.log("Network simulation active: Toggling every 10s.");
    const interval = setInterval(() => {
      setIsOnline(prev => {
        console.log(`Simulating network change: ${!prev ? 'Online' : 'Offline'}`);
        return !prev;
      });
    }, 10000);

    // Also check AppState to reset to online when app comes to foreground
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (nextAppState === "active") {
        console.log("App is active, simulating Online status.");
        setIsOnline(true);
      }
    });

    return () => {
        clearInterval(interval);
        subscription.remove();
    };
  }, []);

  return { isOnline };
}
