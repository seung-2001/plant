import { API_URL, apiRequest } from './api';

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
  // 사용자 관련
  auth: {
    signUp: async (email: string, password: string, name: string) => {
      return apiRequest('/users/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });
    },

    signIn: async (email: string, password: string) => {
      return apiRequest('/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },

    getProfile: async () => {
      return apiRequest('/users/profile', {
        method: 'GET',
      });
    },

    updateProfile: async (data: Partial<User>) => {
      return apiRequest('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
  },

  // 게시물 관련
  posts: {
    getPosts: async (page = 1, limit = 10) => {
      return apiRequest(`/posts?page=${page}&limit=${limit}`, {
        method: 'GET',
      });
    },

    getPost: async (id: string) => {
      return apiRequest(`/posts/${id}`, {
        method: 'GET',
      });
    },

    createPost: async (content: string) => {
      return apiRequest('/posts', {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
    },

    updatePost: async (id: string, content: string) => {
      return apiRequest(`/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ content }),
      });
    },

    deletePost: async (id: string) => {
      return apiRequest(`/posts/${id}`, {
        method: 'DELETE',
      });
    },

    likePost: async (id: string) => {
      return apiRequest(`/posts/${id}/like`, {
        method: 'POST',
      });
    },

    unlikePost: async (id: string) => {
      return apiRequest(`/posts/${id}/unlike`, {
        method: 'POST',
      });
    },

    addComment: async (id: string, content: string) => {
      return apiRequest(`/posts/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
    },
  },

  // 봉사활동 관련
  volunteers: {
    getVolunteers: async (page = 1, limit = 10, status?: string) => {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
      });
      return apiRequest(`/volunteers?${query}`, {
        method: 'GET',
      });
    },

    getVolunteer: async (id: string) => {
      return apiRequest(`/volunteers/${id}`, {
        method: 'GET',
      });
    },

    createVolunteer: async (data: Omit<Volunteer, '_id' | 'createdAt' | 'updatedAt' | 'currentParticipants' | 'participants'>) => {
      return apiRequest('/volunteers', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    updateVolunteer: async (id: string, data: Partial<Volunteer>) => {
      return apiRequest(`/volunteers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
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

  // 사용자 활동 관련
  activities: {
    getUserActivities: async () => {
      return apiRequest('/users/activities', {
        method: 'GET',
      });
    },

    getUserPosts: async () => {
      return apiRequest('/users/posts', {
        method: 'GET',
      });
    },

    getUserVolunteers: async () => {
      return apiRequest('/users/volunteers', {
        method: 'GET',
      });
    },
  },
}; 