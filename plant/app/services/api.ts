import axios, { AxiosError, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  access_token?: string;
}

interface LoginResponse {
  access_token: string;
  user_id?: string;
}

interface RegisterResponse {
  message: string;
}

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  headers?: Record<string, string>;
}

export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.202.59:5000';
export const API_BASE_URL = API_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    PROFILE: '/user/profile',
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

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
});

// 요청 인터셉터
api.interceptors.request.use(
  async (config) => {
    console.log('Request:', config.method?.toUpperCase(), config.url);
    console.log('Request data:', config.data);
    const token = await AsyncStorage.getItem('token');
    console.log('Token:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // 모든 요청에 대해 Content-Type과 Accept 헤더 설정
    config.headers['Content-Type'] = 'application/json';
    config.headers['Accept'] = 'application/json';
    console.log('Request headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.data);
    return response;
  },
  async (error) => {
    console.error('Response error:', error);
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const apiRequest = async <T>(url: string, options: ApiRequestOptions = {}): Promise<AxiosResponse<T>> => {
  try {
    console.log('API 요청 시작:', {
      url: `${API_URL}${url}`,
      method: options.method || 'GET',
      data: options.data,
    });
    
    const axiosResponse = await api({
      url,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      }
    });
    
    console.log('API 응답 성공:', {
      status: axiosResponse.status,
      data: axiosResponse.data,
    });
    
    return axiosResponse;
  } catch (error: any) {
    console.error('API 요청 실패:', {
      url: `${API_URL}${url}`,
      method: options.method || 'GET',
      error: {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
      },
    });
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const loginResponse = await apiRequest<LoginResponse>('/login', {
      method: 'POST',
      data: { email, password },
    });
    
    if (loginResponse.data?.access_token) {
      await AsyncStorage.setItem('token', loginResponse.data.access_token);
      return {
        access_token: loginResponse.data.access_token,
        user: {
          id: loginResponse.data.user_id || 0,
          email: email
        }
      };
    }
    
    throw new Error('로그인에 실패했습니다.');
  } catch (error: any) {
    console.error('로그인 에러:', error);
    throw error;
  }
};

export const register = async (email: string, password: string, name?: string) => {
  try {
    const registerResponse = await apiRequest<RegisterResponse>('/register', {
      method: 'POST',
      data: { email, password, ...(name && { name }) },
    });
    
    if (registerResponse.data?.message === "회원가입이 완료되었습니다.") {
      return {
        id: 0,
        email: email,
        name: name || email.split('@')[0]
      };
    }
    
    throw new Error('회원가입에 실패했습니다.');
  } catch (error: any) {
    console.error('회원가입 에러:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const userResponse = await apiRequest<User>('/user/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return userResponse.data;
  } catch (error: any) {
    console.error('사용자 정보 조회 실패:', error);
    throw error;
  }
};

export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const createPost = async (post: Omit<Post, 'id' | 'created_at'>) => {
  try {
    const response = await apiRequest<Post>('/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: {
        title: post.title,
        content: post.content
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('게시물 생성 실패:', error);
    throw error;
  }
};

export const getPosts = async () => {
  try {
    const postsResponse = await apiRequest<Post[]>('/posts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return postsResponse.data || [];
  } catch (error: any) {
    console.error('게시물 목록 조회 실패:', error);
    throw error;
  }
};

export const getPost = async (id: number) => {
  try {
    const postResponse = await apiRequest<Post>(`/posts/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return postResponse.data;
  } catch (error: any) {
    console.error('게시물 조회 실패:', error);
    throw error;
  }
};

export const updatePost = async (id: number, post: Partial<Post>) => {
  try {
    const response = await apiRequest<Post>(`/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: post
    });
    return response.data;
  } catch (error: any) {
    console.error('게시물 수정 실패:', error);
    throw error;
  }
};

export const deletePost = async (id: number) => {
  try {
    const response = await apiRequest<void>(`/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('게시물 삭제 실패:', error);
    throw error;
  }
};

export const getComments = async (postId: number) => {
  try {
    const response = await apiRequest<Comment[]>(`/posts/${postId}/comment`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response.data || [];
  } catch (error: any) {
    console.error('댓글 목록 조회 실패:', error);
    throw error;
  }
};

export const createComment = async (postId: number, content: string) => {
  try {
    const response = await apiRequest<Comment>(`/posts/${postId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: {
        content: content
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('댓글 작성 실패:', error);
    throw error;
  }
};

export const updateComment = async (postId: number, commentId: number, content: string) => {
  try {
    const response = await apiRequest<Comment>(`/posts/${postId}/comment/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: { content }
    });
    return response.data;
  } catch (error: any) {
    console.error('댓글 수정 실패:', error);
    throw error;
  }
};

export const deleteComment = async (postId: number, commentId: number) => {
  try {
    const response = await apiRequest<void>(`/posts/${postId}/comment/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('댓글 삭제 실패:', error);
    throw error;
  }
};

export const createVolunteer = async (title: string, description: string, date: string, location: string) => {
  const volunteerResponse = await apiRequest<Volunteer>('/volunteers', {
    method: 'POST',
    data: { title, description, date, location }
  });
  return volunteerResponse.data;
};

export const getVolunteers = async () => {
  const volunteersResponse = await apiRequest<Volunteer[]>('/volunteers', {
    method: 'GET'
  });
  return volunteersResponse.data || [];
};

export const joinVolunteer = async (volunteerId: number) => {
  const joinResponse = await apiRequest<void>(`/volunteers/${volunteerId}/join`, {
    method: 'POST'
  });
  return joinResponse.data;
};

export const getMyVolunteers = async () => {
  const myVolunteersResponse = await apiRequest<Volunteer[]>('/my-volunteers', {
    method: 'GET'
  });
  return myVolunteersResponse.data || [];
};

export interface Post {
  id: number;
  title: string;
  content: string;
  author_email: string;
  created_at: string;
}

export interface Comment {
  id: number;
  post_id: number;
  author_email: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

export interface Volunteer {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  created_at: string;
  participants_count: number;
}

export interface User {
  id: number;
  email: string;
  name?: string;
  avatar?: string;
  created_at: string;
} 
