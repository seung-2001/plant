import React, { createContext, useContext, useState } from 'react';
import { API_BASE_URL, API_ENDPOINTS, apiRequest, login, register, User } from '../services/api';

export interface UserData {
  id: number;
  email: string;
  name?: string;
  avatar?: string;
  created_at: string;
}

export type AuthContextType = {
  isAuthenticated: boolean;
  user: UserData | null;
  registerUser: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = 'http://192.168.202.59:5000';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const registerUser = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const response = await register(email, password, name);

      const userData: UserData = {
        id: response.id || 0,
        email: email,
        name: name,
        created_at: new Date().toISOString()
      };

      setIsAuthenticated(true);
      setUser(userData);
    } catch (error: any) {
      console.error('회원가입 실패:', error);
      throw new Error(error.response?.data?.error || error.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await login(email, password);
      
      const userData: UserData = {
        id: Number(response.user?.id) || 0,
        email: email,
        name: email.split('@')[0],
        created_at: new Date().toISOString()
      };
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error('로그인 에러:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{
        isAuthenticated,
        user,
        registerUser,
        signIn,
        signOut,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 