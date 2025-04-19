import React, { createContext, useContext, useState } from 'react';
import { API_BASE_URL, API_ENDPOINTS, apiRequest } from '../config/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface UserData {
  id: number;
  email: string;
  name: string;
}

interface AuthResponse {
  id: number;
  email: string;
  name: string;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('회원가입 시도:', { email, name });
      const response = await apiRequest(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`, {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });

      console.log('회원가입 응답:', response);

      // 기본 사용자 데이터 생성
      const defaultUserData: UserData = {
        id: 0,
        email: email,
        name: name
      };

      // 응답이 유효한지 확인
      if (!response) {
        console.log('응답이 없음, 기본 데이터 사용');
        setIsAuthenticated(true);
        setUser(defaultUserData);
        return;
      }

      // 응답이 객체인지 확인
      if (typeof response !== 'object') {
        console.error('응답이 객체가 아님:', response);
        setIsAuthenticated(true);
        setUser(defaultUserData);
        return;
      }

      // 응답 데이터에서 필요한 필드 추출
      const userData: UserData = {
        id: response.id ? Number(response.id) : defaultUserData.id,
        email: response.email || defaultUserData.email,
        name: response.name || defaultUserData.name
      };

      console.log('최종 사용자 데이터:', userData);
      setIsAuthenticated(true);
      setUser(userData);
    } catch (error: any) {
      console.error('회원가입 실패:', error);
      throw new Error(error.message || '회원가입 중 오류가 발생했습니다.');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('로그인 시도:', { email });
      const response = await apiRequest(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      console.log('로그인 응답:', JSON.stringify(response, null, 2));

      if (!response || typeof response !== 'object') {
        throw new Error('서버 응답이 올바르지 않습니다.');
      }

      const authResponse = response as AuthResponse;
      
      if (!authResponse.id || !authResponse.email || !authResponse.name) {
        console.error('잘못된 사용자 데이터:', authResponse);
        throw new Error('사용자 데이터가 올바르지 않습니다.');
      }

      const userData: UserData = {
        id: Number(authResponse.id),
        email: String(authResponse.email),
        name: String(authResponse.name)
      };

      console.log('처리된 사용자 데이터:', userData);
      setIsAuthenticated(true);
      setUser(userData);
      console.log('로그인 성공:', userData);
    } catch (error: any) {
      console.error('로그인 실패:', error);
      throw new Error(error.message || '로그인에 실패했습니다.');
    }
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signUp, signIn, signOut }}>
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