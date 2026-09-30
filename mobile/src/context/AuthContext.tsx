import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  businessName?: string;
  currency: string;
  phone?: string;
  gstNumber?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  reloadProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('@sugan_token');
      const storedUser = await AsyncStorage.getItem('@sugan_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.warn('Failed to load credentials from storage', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await api.login({ email, password });
      const { user: loggedInUser, token: authToken } = res.data;

      await AsyncStorage.setItem('@sugan_token', authToken);
      await AsyncStorage.setItem('@sugan_user', JSON.stringify(loggedInUser));

      setToken(authToken);
      setUser(loggedInUser);
      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed. Please check credentials.';
      return { success: false, error: message };
    }
  };

  const register = async (data: any) => {
    try {
      const res = await api.register(data);
      const { user: registeredUser, token: authToken } = res.data;

      await AsyncStorage.setItem('@sugan_token', authToken);
      await AsyncStorage.setItem('@sugan_user', JSON.stringify(registeredUser));

      setToken(authToken);
      setUser(registeredUser);
      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed.';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@sugan_token');
      await AsyncStorage.removeItem('@sugan_user');
      setToken(null);
      setUser(null);
    } catch (e) {
      console.error('Logout error', e);
    }
  };

  const reloadProfile = async () => {
    try {
      const res = await api.getProfile();
      setUser(res.data.user);
      await AsyncStorage.setItem('@sugan_user', JSON.stringify(res.data.user));
    } catch (e) {
      console.warn('Failed to refresh profile', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, reloadProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
