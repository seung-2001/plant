import express from 'express';
import { Request, Response } from 'express';
import { createPost, getPosts, getPost, updatePost, deletePost } from '../controllers/postController';
import { auth } from '../middleware/auth';

const router = express.Router();

// 인증이 필요하지 않은 라우트
router.get('/', async (req: Request, res: Response) => {
  await getPosts(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
  await getPost(req, res);
});

// 인증이 필요한 라우트
router.post('/', auth, async (req: Request, res: Response) => {
  await createPost(req, res);
});

router.patch('/:id', auth, async (req: Request, res: Response) => {
  await updatePost(req, res);
});

router.delete('/:id', auth, async (req: Request, res: Response) => {
  await deletePost(req, res);
});

export default router; 