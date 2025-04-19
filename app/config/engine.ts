import { API_URL, apiRequest } from './api';
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
const engine = {
  // 사용자 관련
  auth: {
    signUp: async (email: string, password: string, name: string) => {
      return apiRequest({
        method: 'POST',
        url: '/add_user',
        data: { email, password, name }
      });
    },

    signIn: async (email: string, password: string) => {
      return apiRequest({
        method: 'POST',
        url: '/login',
        data: { email, password }
      });
    },

    getProfile: async () => {
      return apiRequest({
        method: 'GET',
        url: '/get_users'
      });
    },

    updateProfile: async (data: Partial<User>) => {
      return apiRequest({
        method: 'PUT',
        url: '/users/profile',
        data
      });
    },
  },

  // 게시물 관련
  posts: {
    getPosts: async (page = 1, limit = 10) => {
      return apiRequest({
        method: 'GET',
        url: `/posts?page=${page}&limit=${limit}`
      });
    },

    getPost: async (id: string) => {
      return apiRequest({
        method: 'GET',
        url: `/posts/${id}`
      });
    },

    createPost: async (content: string) => {
      return apiRequest({
        method: 'POST',
        url: '/posts',
        data: { content }
      });
    },

    updatePost: async (id: string, content: string) => {
      return apiRequest({
        method: 'PUT',
        url: `/posts/${id}`,
        data: { content }
      });
    },

    deletePost: async (id: string) => {
      return apiRequest({
        method: 'DELETE',
        url: `/posts/${id}`
      });
    },

    likePost: async (id: string) => {
      return apiRequest({
        method: 'POST',
        url: `/posts/${id}/like`
      });
    },

    unlikePost: async (id: string) => {
      return apiRequest({
        method: 'POST',
        url: `/posts/${id}/unlike`
      });
    },

    addComment: async (id: string, content: string) => {
      return apiRequest({
        method: 'POST',
        url: `/posts/${id}/comments`,
        data: { content }
      });
    },
  },

  // 봉사활동 관련
  volunteers: {
    getVolunteers: async (params?: any) => {
      return apiRequest({
        method: 'GET',
        url: `/volunteers?${queryString.stringify(params)}`
      });
    },
    getVolunteer: async (id: string) => {
      return apiRequest({
        method: 'GET',
        url: `/volunteers/${id}`
      });
    },
    createVolunteer: async (data: any) => {
      return apiRequest({
        method: 'POST',
        url: '/volunteers',
        data
      });
    },
    updateVolunteer: async (id: string, data: any) => {
      return apiRequest({
        method: 'PUT',
        url: `/volunteers/${id}`,
        data
      });
    },
    deleteVolunteer: async (id: string) => {
      return apiRequest({
        method: 'DELETE',
        url: `/volunteers/${id}`
      });
    },
    joinVolunteer: async (id: string) => {
      return apiRequest({
        method: 'POST',
        url: `/volunteers/${id}/join`
      });
    },
    leaveVolunteer: async (id: string) => {
      return apiRequest({
        method: 'POST',
        url: `/volunteers/${id}/leave`
      });
    },
  },

  // 사용자 활동 관련
  activities: {
    getUserActivities: async () => {
      return apiRequest({
        method: 'GET',
        url: '/user/activities'
      });
    },

    getUserPosts: async () => {
      return apiRequest({
        method: 'GET',
        url: '/user/posts'
      });
    },

    getUserVolunteers: async () => {
      return apiRequest({
        method: 'GET',
        url: '/user/volunteers'
      });
    },
  },
};

export default engine; 