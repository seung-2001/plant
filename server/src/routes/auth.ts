import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../config/db';

const router = express.Router();

// 회원가입
router.post('/register', async (req, res) => {
  try {
    console.log('회원가입 요청 받음:', {
      body: req.body,
      headers: req.headers,
      method: req.method
    });

    if (!req.body) {
      console.error('요청 본문이 없음');
      return res.status(400).json({ message: '요청 데이터가 없습니다.' });
    }

    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      console.error('필수 데이터 누락:', { email, name });
      return res.status(400).json({ message: '이메일, 비밀번호, 이름을 모두 입력해주세요.' });
    }

    // 이메일 중복 확인
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log('이메일 중복 발견:', email);
      return res.status(400).json({ message: '이미 등록된 이메일입니다.' });
    }

    // 비밀번호 해시화
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 사용자 생성
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name]
    );

    console.log('사용자 생성 성공:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('회원가입 처리 중 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 사용자 조회
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const user = result.rows[0];

    // 비밀번호 확인
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error('로그인 처리 중 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

export default router; 