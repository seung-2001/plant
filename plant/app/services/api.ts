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

export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.200.143:5000';
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
  timeout: 10000,
  withCredentials: true,
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  }
});

// 요청 인터셉터
api.interceptors.request.use(
  async (config) => {
    console.log('Request:', config.method?.toUpperCase(), config.url);
    console.log('Request data:', config.data);
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Content-Type이 설정되지 않은 경우 기본값 설정
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    if (!config.headers['Accept']) {
      config.headers['Accept'] = 'application/json';
    }
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
        email: email
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
    const userResponse = await apiRequest<User>('/user', {
      method: 'GET'
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
  const postResponse = await apiRequest<Post>('/posts', {
    method: 'POST',
    data: post
  });
  return postResponse.data;
};

export const getPosts = async () => {
  const postsResponse = await apiRequest<Post[]>('/posts', {
    method: 'GET'
  });
  return postsResponse.data || [];
};

export const getPost = async (id: number) => {
  const postResponse = await apiRequest<Post>(`/posts/${id}`, {
    method: 'GET'
  });
  return postResponse.data;
};

export const updatePost = async (id: number, post: Partial<Post>) => {
  const updateResponse = await apiRequest<Post>(`/posts/${id}`, {
    method: 'PUT',
    data: post
  });
  return updateResponse.data;
};

export const deletePost = async (id: number) => {
  const deleteResponse = await apiRequest<void>(`/posts/${id}`, {
    method: 'DELETE'
  });
  return deleteResponse.data;
};

export const getComments = async (postId: number) => {
  const commentsResponse = await apiRequest<Comment[]>(`/posts/${postId}/comments`, {
    method: 'GET'
  });
  return commentsResponse.data || [];
};

export const createComment = async (postId: number, content: string) => {
  const commentResponse = await apiRequest<Comment>(`/posts/${postId}/comment`, {
    method: 'POST',
    data: { content }
  });
  return commentResponse.data;
};

export const updateComment = async (postId: number, commentId: number, content: string) => {
  const updateResponse = await apiRequest<Comment>(`/posts/${postId}/comment/${commentId}`, {
    method: 'PUT',
    data: { content }
  });
  return updateResponse.data;
};

export const deleteComment = async (postId: number, commentId: number) => {
  const deleteResponse = await apiRequest<void>(`/posts/${postId}/comment/${commentId}`, {
    method: 'DELETE'
  });
  return deleteResponse.data;
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
  id: string;
  user_name: string;
  content: string;
  images: string[];
  like_count: number;
  comment_count: number;
  created_at: string;
  avatar?: string;
}

export interface Comment {
  id: number;
  post_id: number;
  user_name: string;
  content: string;
  created_at: string;
  avatar?: string;
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
