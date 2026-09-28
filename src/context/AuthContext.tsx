import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { setAuthToken, setUnauthorizedHandler } from '../services/api';

interface AuthContextData {
  token: string | null;
  userName: string | null;
  isLoading: boolean;
  saveToken: (token: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const TOKEN_KEY = 'ford_radar_jwt';
const NAME_KEY = 'ford_radar_user_name';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    (async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        const storedName = await SecureStore.getItemAsync(NAME_KEY);
        if (storedToken) {
          setToken(storedToken);
          setAuthToken(storedToken);
        }
        if (storedName) setUserName(storedName);
      } catch {
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const saveToken = async (newToken: string, name?: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    if (name) {
      await SecureStore.setItemAsync(NAME_KEY, name);
      setUserName(name);
    }
    setAuthToken(newToken);
    setToken(newToken);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(NAME_KEY);
    setAuthToken(null);
    setToken(null);
    setUserName(null);
  };

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, userName, isLoading, saveToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
