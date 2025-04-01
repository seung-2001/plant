// API 기본 설정
export const API_BASE_URL = 'http://192.168.200.100:3000/api';

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

// API 요청 함수
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    console.log('[API 요청]', {
      url,
      method: options.method,
      headers: {
        ...getHeaders(),
        ...options.headers,
      }
    });

    if (options.body) {
      console.log('[API 요청 body]', options.body);
    }

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
      mode: 'cors'
    });

    clearTimeout(timeoutId);

    console.log('[API 응답]', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    let data;
    try {
      const text = await response.text();
      console.log('[API 응답 텍스트]', text);
      
      if (text && text.trim()) {
        try {
          data = JSON.parse(text);
          console.log('[API 응답 데이터]', data);
          
          // 응답 데이터 구조 확인
          if (data && typeof data === 'object') {
            console.log('[API 응답 데이터 구조]', {
              keys: Object.keys(data),
              hasId: 'id' in data,
              hasEmail: 'email' in data,
              hasName: 'name' in data,
              idType: typeof data.id,
              emailType: typeof data.email,
              nameType: typeof data.name
            });
          }
        } catch (parseError) {
          console.error('[API 응답 파싱 실패]', parseError);
          data = {};
        }
      } else {
        console.log('[API 응답 없음]');
        data = {};
      }
    } catch (error) {
      console.error('[API 응답 읽기 실패]', error);
      data = {};
    }

    if (!response.ok) {
      throw new Error(`API 오류: ${response.status} ${response.statusText}`);
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('[API 요청 실패]', error);
    throw error;
  }
};
  

// Expo Router를 위한 빈 컴포넌트 export
export default function ApiConfig() {
  return null;
} 