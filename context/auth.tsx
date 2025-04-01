import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_ENDPOINTS, getHeaders } from '../app/config/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'auth_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        // TODO: 토큰 유효성 검증 API 호출
        // 임시로 토큰이 있으면 로그인 상태로 처리
        setUser({
          id: '1',
          name: '사용자',
          email: 'user@example.com'
        });
      }
    } catch (error) {
      console.error('Auth state check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('API 요청 시작:', `${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5초 타임아웃

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password, name }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('API 응답 상태:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API 에러 응답:', errorData);
        throw new Error(errorData.message || '회원가입에 실패했습니다.');
      }

      const data = await response.json();
      console.log('API 성공 응답:', data);  // 서버에서 직접 { id, email, name }을 반환

      // 서버 응답 데이터를 User 타입에 맞게 변환
      const userData: User = {
        id: String(data.id),  // id를 문자열로 변환
        email: data.email,    // 서버에서 직접 반환된 email
        name: data.name       // 서버에서 직접 반환된 name
      };

      console.log('변환된 사용자 데이터:', userData);
      
      // 회원가입 성공 후 자동 로그인
      await signIn(email, password);
    } catch (error: any) {
      console.error('회원가입 API 호출 실패:', error);
      if (error.name === 'AbortError') {
        throw new Error('서버 응답 시간이 초과되었습니다. 네트워크 연결을 확인해주세요.');
      }
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '로그인에 실패했습니다.');
      }

      const data = await response.json();
      console.log('로그인 응답:', data);

      // 서버 응답에서 사용자 데이터 추출
      const userData: User = {
        id: String(data.id),
        email: data.email,
        name: data.name
      };

      // 임시 토큰 생성 (나중에 서버에서 제공하는 실제 토큰으로 교체 필요)
      const tempToken = `temp_token_${Date.now()}`;
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, tempToken);
      
      setUser(userData);
      console.log('로그인 성공:', userData);
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      setUser(null);
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
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