
import React, { createContext, useContext, useState, ReactNode } from 'react';

// A more detailed User type for the mobile app
export interface User {
  name: string;
  email: string;
  role: 'passenger' | 'company' | 'admin' | 'agent' | 'driver';
  avatarUrl: string;
  // Role-specific properties
  loyaltyPoints?: number;
  walletBalance?: number; // for passenger
  company?: string;      // for driver/company
  assignedBus?: string; // for driver
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    setUser(null);
    // In a real app, you'd also clear any stored tokens here
  };

  return React.createElement(AuthContext.Provider, { value: { user, setUser, logout } }, children);
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
