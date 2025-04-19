import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin, register, getCurrentUser } from '../app/services/api';
import { useRouter } from 'expo-router';

interface User {
  id: number;
  email: string;
  user_name: string;
  avatar?: string;
  is_verified: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  registerUser: (email: string, password: string, name: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'auth_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        const userData = await getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { access_token } = await apiLogin(email, password);
      await AsyncStorage.setItem('token', access_token);
      setToken(access_token);
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const registerUser = async (email: string, password: string, name: string) => {
    try {
      console.log('회원가입 시도:', { email, name });
      await register(email, password, name);
      console.log('회원가입 성공, 로그인 시도');
      await signIn(email, password);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('회원가입 시도:', { email, name });
      await register(email, password, name);
      console.log('회원가입 성공');
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('로그아웃 시작');
      await AsyncStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setLoading(false);
      console.log('로그아웃 완료, 로그인 페이지로 이동');
      router.replace('/login');
    } catch (error) {
      console.error('로그아웃 에러:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, registerUser, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider; 