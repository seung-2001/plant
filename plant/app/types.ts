export interface Post {
  id: number;
  title: string;
  content: string;
  author_email: string;
  created_at: string;
  updated_at?: string;
}

export interface Comment {
  id: number;
  post_id: number;
  content: string;
  author_email: string;
  created_at: string;
  updated_at?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
  updated_at?: string;
} 