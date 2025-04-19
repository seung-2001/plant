import AsyncStorage from '@react-native-async-storage/async-storage';

// API 기본 설정
export const API_URL = 'http://127.0.0.1:5000';
export const API_BASE_URL = API_URL;

// API 엔드포인트
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/add_user',
    PROFILE: '/get_users',  // 임시로 사용자 목록 조회 엔드포인트 사용
  },
  POSTS: {
    LIST: '/posts',
    DETAIL: (id: string) => `/posts/${id}`,
    CREATE: '/posts',
    UPDATE: '/posts/:id',
    DELETE: '/posts/:id',
  },
  VOLUNTEERS: {
    LIST: '/volunteers',
    DETAIL: (id: string) => `/volunteers/${id}`,
    CREATE: '/volunteers',
    UPDATE: '/volunteers/:id',
    DELETE: '/volunteers/:id',
    JOIN: '/volunteers/:id/join',
    LEAVE: '/volunteers/:id/leave',
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
  timeout: 10000, // 10초로 줄임
  retries: 3,
  retryDelay: 1000,
};

export interface ApiRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: any;
  params?: Record<string, string>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export async function apiRequest(options: ApiRequestOptions) {
  const { method, url, data, params, headers = {}, signal } = options;
  
  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    signal,
  };

  if (data) {
    requestOptions.body = JSON.stringify(data);
  }

  const queryString = params ? new URLSearchParams(params).toString() : '';
  const fullUrl = queryString ? `${API_URL}${url}?${queryString}` : `${API_URL}${url}`;

  try {
    const response = await fetch(fullUrl, requestOptions);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || 'API 요청 실패');
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('요청 시간이 초과되었습니다');
    }
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