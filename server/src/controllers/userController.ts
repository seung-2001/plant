import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { AuthRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 회원가입
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // 이메일 중복 체크
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: '이미 사용 중인 이메일입니다.' });
    }

    // 비밀번호 해시화
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 새 사용자 생성
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('회원가입 에러:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 로그인
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 사용자 찾기
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 비밀번호 확인
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: '로그인 성공',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('로그인 에러:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 프로필 조회
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    res.json(user);
  } catch (error) {
    console.error('프로필 조회 에러:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 프로필 수정
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, profileImage } = req.body;
    const user = await User.findById(req.user?._id);
    
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    if (name) user.name = name;
    if (profileImage) user.profileImage = profileImage;

    await user.save();
    res.json({ message: '프로필이 업데이트되었습니다.', user });
  } catch (error) {
    console.error('프로필 업데이트 에러:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}; 