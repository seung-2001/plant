import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 테스트 계정 정보
const TEST_ACCOUNTS = [
  {
    email: 'test@test.com',
    password: 'test1234',
    user: {
      id: '1',
      name: '테스트 사용자',
      email: 'test@test.com',
    },
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: 실제 인증 상태 확인 로직 구현
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      // TODO: 실제 인증 상태 확인 로직 구현
      setIsLoading(false);
    } catch (error) {
      console.error('Auth state check failed:', error);
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // 테스트 계정 확인
      const account = TEST_ACCOUNTS.find(
        (acc) => acc.email === email && acc.password === password
      );

      if (account) {
        setUser(account.user);
      } else {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
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