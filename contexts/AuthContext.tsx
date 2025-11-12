
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import * as api from '../services/apiService';

interface AuthContextType {
  user: any | null;
  token: string | null;
  // FIX: Add setUser to the context type to allow components to update the user state.
  setUser: React.Dispatch<React.SetStateAction<any | null>>;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (token) {
        api.setAuthToken(token);
        try {
            const currentUser = await api.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.error("Session expired or token invalid", error);
            logout();
        }
    }
    setIsLoading(false);
  }, [token]);


  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials) => {
    const { token: newToken, data: userData } = await api.login(credentials);
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    api.setAuthToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    api.setAuthToken(null);
  };

  return (
    // FIX: Expose setUser in the provider's value.
    <AuthContext.Provider value={{ user, setUser, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}