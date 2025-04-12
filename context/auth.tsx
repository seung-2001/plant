import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS, API_URL } from '../app/config/api';
import { apiRequest } from '../app/config/api';
import { useRouter } from 'expo-router';

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
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'auth_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        // 저장된 사용자 정보 가져오기
        const userEmail = await AsyncStorage.getItem('user_email');
        if (userEmail) {
          setUser({
            id: userEmail,
            name: userEmail.split('@')[0],
            email: userEmail
          });
        }
      }
    } catch (error) {
      console.error('Auth state check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('회원가입 시도:', { email });
      console.log('API 엔드포인트:', API_ENDPOINTS.AUTH.REGISTER);
      
      const requestBody = { email, password, name };
      console.log('요청 본문:', requestBody);
      
      const response = await apiRequest(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        body: requestBody,
      }).catch(error => {
        console.error('회원가입 API 호출 실패:', error);
        if (error.message.includes('서버에 연결할 수 없습니다')) {
          throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
        }
        throw error;
      });
      
      console.log('회원가입 성공:', response);
      return response;
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('서버 연결에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      console.log('로그인 시도:', email);
      const response = await apiRequest('/login', {
        method: 'POST',
        body: { email, password },
      });
      
      if (response.access_token) {
        console.log('로그인 성공');
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.access_token);
        await AsyncStorage.setItem('user_email', email);  // 이메일 저장
        setUser({ id: email, email, name: email.split('@')[0] });
      } else {
        console.log('로그인 실패: 토큰 없음');
        throw new Error('로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      throw error instanceof Error ? error : new Error('로그인 중 오류가 발생했습니다.');
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem('user_email');  // 이메일 제거
      setUser(null);
      router.replace('/login');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider; 