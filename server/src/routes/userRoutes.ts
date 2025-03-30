import express from 'express';
import { Request, Response } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/userController';
import { auth } from '../middleware/auth';

const router = express.Router();

// 인증이 필요하지 않은 라우트
router.post('/register', async (req: Request, res: Response) => {
  await register(req, res);
});

router.post('/login', async (req: Request, res: Response) => {
  await login(req, res);
});

// 인증이 필요한 라우트
router.get('/profile/:id', auth, async (req: Request, res: Response) => {
  await getProfile(req, res);
});

router.patch('/profile/:id', auth, async (req: Request, res: Response) => {
  await updateProfile(req, res);
});

export default router; 