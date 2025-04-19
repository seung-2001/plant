import { API_URL, apiRequest } from '../services/api';
import queryString from 'query-string';

// 타입 정의
export interface User {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
  volunteerHours: number;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  content: string;
  author: string;
  likes: string[];
  comments: {
    content: string;
    author: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Volunteer {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  requirements: string[];
  maxParticipants: number;
  currentParticipants: number;
  organizer: string;
  participants: string[];
  status: 'open' | 'closed' | 'completed';
  createdAt: string;
  updatedAt: string;
}

// API 엔진
export const engine = {
  auth: {
    signUp: async (email: string, password: string, name: string) => {
      return apiRequest('/add_user', {
        method: 'POST',
        data: { email, password, name },
      });
    },
    login: async (email: string, password: string) => {
      return apiRequest('/login', {
        method: 'POST',
        data: { email, password },
      });
    },
    getProfile: async () => {
      return apiRequest('/get_users', {
        method: 'GET',
      });
    },
  },
  posts: {
    getPosts: async (params?: any) => {
      return apiRequest(`/posts?${queryString.stringify(params)}`, {
        method: 'GET',
      });
    },
    getPost: async (id: string) => {
      return apiRequest(`/posts/${id}`, {
        method: 'GET',
      });
    },
    createPost: async (data: any) => {
      return apiRequest('/posts', {
        method: 'POST',
        data,
      });
    },
    updatePost: async (id: string, data: any) => {
      return apiRequest(`/posts/${id}`, {
        method: 'PUT',
        data,
      });
    },
    deletePost: async (id: string) => {
      return apiRequest(`/posts/${id}`, {
        method: 'DELETE',
      });
    },
  },
  volunteers: {
    getVolunteers: async (params?: any) => {
      return apiRequest(`/volunteers?${queryString.stringify(params)}`, {
        method: 'GET',
      });
    },
    getVolunteer: async (id: string) => {
      return apiRequest(`/volunteers/${id}`, {
        method: 'GET',
      });
    },
    createVolunteer: async (data: any) => {
      return apiRequest('/volunteers', {
        method: 'POST',
        data,
      });
    },
    updateVolunteer: async (id: string, data: any) => {
      return apiRequest(`/volunteers/${id}`, {
        method: 'PUT',
        data,
      });
    },
    deleteVolunteer: async (id: string) => {
      return apiRequest(`/volunteers/${id}`, {
        method: 'DELETE',
      });
    },
    joinVolunteer: async (id: string) => {
      return apiRequest(`/volunteers/${id}/join`, {
        method: 'POST',
      });
    },
    leaveVolunteer: async (id: string) => {
      return apiRequest(`/volunteers/${id}/leave`, {
        method: 'POST',
      });
    },
  },
  user: {
    getUserActivities: async () => {
      return apiRequest('/user/activities', {
        method: 'GET',
      });
    },
    getUserPosts: async () => {
      return apiRequest('/user/posts', {
        method: 'GET',
      });
    },
    getUserVolunteers: async () => {
      return apiRequest('/user/volunteers', {
        method: 'GET',
      });
    },
  },
};

export default engine; 