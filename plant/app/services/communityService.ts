import { Post, Comment } from '../types';
import { apiRequest } from './api';

export const createPost = async (post: Omit<Post, 'id' | 'created_at'>): Promise<Post> => {
  try {
    console.log('게시물 생성 요청:', post);
    const response = await apiRequest<Post>('/posts', {
      method: 'POST',
      data: post
    });
    console.log('게시물 생성 응답:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('게시물 생성 실패:', error);
    if (error.response) {
      console.error('응답 상태:', error.response.status);
      console.error('응답 데이터:', error.response.data);
    }
    throw error;
  }
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

/**
 * 특정 사용자가 작성한 게시물 목록을 가져옵니다.
 * @param email 사용자 이메일
 * @returns 사용자가 작성한 게시물 배열
 */
export const getUserPosts = async (email: string): Promise<Post[]> => {
  try {
    console.log(`사용자 게시물 조회 요청: ${email}`);
    
    // API 경로를 수정 - 백엔드 구현에 따라 다양한 경로를 시도합니다
    // 1. 첫 번째 시도: /posts/user 경로
    let url = `/posts/user?author_email=${encodeURIComponent(email)}`;
    console.log(`첫 번째 시도 URL: ${url}`);
    
    try {
      const response = await apiRequest<Post[]>(url, { method: 'GET' });
      console.log(`첫 번째 시도 응답 상태: ${response.status}`);
      console.log(`첫 번째 시도 응답 데이터:`, response.data);
      
      if (response.data && response.data.length > 0) {
        return response.data;
      }
    } catch (error: any) {
      console.log('첫 번째 시도 실패, 두 번째 시도로 진행');
    }

    // 2. 두 번째 시도: /posts?author_email= 경로 (쿼리 파라미터 방식)
    url = `/posts?author_email=${encodeURIComponent(email)}`;
    console.log(`두 번째 시도 URL: ${url}`);
    
    try {
      const response = await apiRequest<Post[]>(url, { method: 'GET' });
      console.log(`두 번째 시도 응답 상태: ${response.status}`);
      console.log(`두 번째 시도 응답 데이터:`, response.data);
      
      return response.data || [];
    } catch (error: any) {
      console.log('두 번째 시도 실패, 마지막 시도로 진행');
    }
    
    // 3. 세 번째 시도: /posts 전체 목록 가져온 후 클라이언트에서 필터링
    url = `/posts`;
    console.log(`마지막 시도 URL: ${url}`);
    
    const response = await apiRequest<Post[]>(url, { method: 'GET' });
    console.log(`마지막 시도 응답 상태: ${response.status}`);
    
    // 전체 게시물 중 해당 사용자가 작성한 게시물만 필터링
    const filteredPosts = response.data ? 
      response.data.filter(post => post.author_email === email) : [];
      
    console.log(`필터링된 게시물:`, filteredPosts);
    
    return filteredPosts;
  } catch (error: any) {
    console.error(`사용자 게시물 조회 실패 (${email}):`, error);
    if (error.response) {
      console.error('응답 상태:', error.response.status);
      console.error('응답 데이터:', error.response.data);
    }
    // 오류가 발생해도 빈 배열을 반환하여 앱이 중단되지 않도록 함
    console.log('빈 게시물 목록 반환');
    return [];
  }
}; 