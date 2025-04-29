import { Post, Comment } from '../types';
import { apiRequest } from './api';

export const createPost = async (post: Omit<Post, 'id' | 'created_at'>): Promise<Post> => {
  const response = await apiRequest<Post>('/posts', {
    method: 'POST',
    data: post
  });
  return response.data;
};

export const getPosts = async (): Promise<Post[]> => {
  const response = await apiRequest<Post[]>('/posts', {
    method: 'GET'
  });
  return response.data;
};

export const getPost = async (id: number): Promise<{ post: Post; comments: Comment[] }> => {
  const response = await apiRequest<{ post: Post; comments: Comment[] }>(`/posts/${id}`);
  return response.data;
};

export const updatePost = async (id: number, post: Partial<Post>): Promise<Post> => {
  const response = await apiRequest<Post>(`/posts/${id}`, {
    method: 'PUT',
    data: post
  });
  return response.data;
};

export const deletePost = async (id: number): Promise<void> => {
  await apiRequest<void>(`/posts/${id}`, {
    method: 'DELETE'
  });
};

export const createComment = async (postId: number, content: string): Promise<Comment> => {
  const response = await apiRequest<Comment>(`/posts/${postId}/comments`, {
    method: 'POST',
    data: { content }
  });
  return response.data;
};

export const getComments = async (postId: number): Promise<Comment[]> => {
  const response = await apiRequest<Comment[]>(`/posts/${postId}/comments`, {
    method: 'GET'
  });
  return response.data;
};

export const updateComment = async (postId: number, commentId: number, content: string): Promise<Comment> => {
  const response = await apiRequest<Comment>(`/posts/${postId}/comments/${commentId}`, {
    method: 'PUT',
    data: { content }
  });
  return response.data;
};

export const deleteComment = async (postId: number, commentId: number): Promise<void> => {
  await apiRequest<void>(`/posts/${postId}/comments/${commentId}`, {
    method: 'DELETE'
  });
}; 