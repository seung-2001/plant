import { Response } from 'express';
import { Post, IPost } from '../models/Post';
import { AuthRequest } from '../middleware/auth';

// 게시물 생성
export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    const post = new Post({
      content,
      author: req.user?._id,
    });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: '게시물 생성에 실패했습니다.' });
  }
};

// 게시물 목록 조회
export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const posts = await Post.find().populate('author', 'name');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: '게시물 목록을 가져오는데 실패했습니다.' });
  }
};

// 게시물 상세 조회
export const getPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name');
    if (!post) {
      res.status(404).json({ error: '게시물을 찾을 수 없습니다.' });
      return;
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: '게시물 정보를 가져오는데 실패했습니다.' });
  }
};

// 게시물 수정
export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      res.status(404).json({ error: '게시물을 찾을 수 없습니다.' });
      return;
    }
    
    if (post.author.toString() !== req.user?._id.toString()) {
      res.status(403).json({ error: '게시물을 수정할 권한이 없습니다.' });
      return;
    }
    
    post.content = content;
    await post.save();
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: '게시물 수정에 실패했습니다.' });
  }
};

// 게시물 삭제
export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      res.status(404).json({ error: '게시물을 찾을 수 없습니다.' });
      return;
    }
    
    if (post.author.toString() !== req.user?._id.toString()) {
      res.status(403).json({ error: '게시물을 삭제할 권한이 없습니다.' });
      return;
    }
    
    await post.deleteOne();
    res.json({ message: '게시물이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: '게시물 삭제에 실패했습니다.' });
  }
}; 