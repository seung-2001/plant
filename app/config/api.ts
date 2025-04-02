import AsyncStorage from '@react-native-async-storage/async-storage';

// API 기본 설정
export const API_URL = 'http://192.168.200.100:3000/api'; // 우리 서버 URL

// API 엔드포인트
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
};

// API 요청 헤더
export const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// API 요청 설정
export const API_CONFIG = {
  timeout: 10000, // 10초
  retries: 3, // 3번 재시도
  retryDelay: 1000, // 1초 간격으로 재시도
};

interface ApiRequestOptions {
  method: string;
  body?: string;
  headers?: Record<string, string>;
}

export async function apiRequest(endpoint: string, options: ApiRequestOptions) {
  try {
    const token = await AsyncStorage.getItem('userToken');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API 요청 실패');
    }

    return data;
  } catch (error) {
    console.error('API 요청 중 오류 발생:', error);
    throw error;
  }
}

// 토큰 저장
export async function saveToken(token: string) {
  try {
    await AsyncStorage.setItem('userToken', token);
  } catch (error) {
    console.error('토큰 저장 중 오류 발생:', error);
  }
}

// 토큰 삭제
export async function removeToken() {
  try {
    await AsyncStorage.removeItem('userToken');
  } catch (error) {
    console.error('토큰 삭제 중 오류 발생:', error);
  }
}

// Expo Router를 위한 빈 컴포넌트 export
export default function ApiConfig() {
  return null;
} 