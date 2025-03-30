import express from 'express';
import { Response } from 'express';
import { Volunteer } from '../models/Volunteer';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

// 봉사활동 목록 조회
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const volunteers = await Volunteer.find();
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ error: '봉사활동 목록을 가져오는데 실패했습니다.' });
  }
});

// 봉사활동 상세 조회
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      res.status(404).json({ error: '봉사활동을 찾을 수 없습니다.' });
      return;
    }
    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ error: '봉사활동 정보를 가져오는데 실패했습니다.' });
  }
});

// 봉사활동 신청
router.post('/:id/apply', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      res.status(404).json({ error: '봉사활동을 찾을 수 없습니다.' });
      return;
    }
    
    // TODO: 사용자 인증 및 신청 처리 로직 구현
    
    res.json({ message: '봉사활동 신청이 완료되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: '봉사활동 신청에 실패했습니다.' });
  }
});

export default router; 