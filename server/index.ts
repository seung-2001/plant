import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 환경 변수 로드
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL 연결 설정
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// API 라우트
app.post('/api/users/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, password, name]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query(
      'SELECT id, email, name FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

app.get('/api/users/profile', async (req, res) => {
  try {
    const userId = req.headers.authorization?.split(' ')[1];
    if (!userId) {
      return res.status(401).json({ error: '인증이 필요합니다.' });
    }
    const result = await pool.query(
      'SELECT id, email, name, profile_image, volunteer_hours FROM users WHERE id = $1',
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 게시물 관련 API
app.get('/api/posts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.name as author_name 
      FROM posts p 
      JOIN users u ON p.author = u.id 
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('게시물 목록 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const { content, author } = req.body;
    const result = await pool.query(
      'INSERT INTO posts (content, author) VALUES ($1, $2) RETURNING *',
      [content, author]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('게시물 작성 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 봉사활동 관련 API
app.get('/api/volunteers', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.*, u.name as organizer_name 
      FROM volunteers v 
      JOIN users u ON v.organizer = u.id 
      ORDER BY v.date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('봉사활동 목록 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

app.post('/api/volunteers', async (req, res) => {
  try {
    const { title, description, date, time, location, requirements, max_participants, organizer } = req.body;
    const result = await pool.query(
      `INSERT INTO volunteers (
        title, description, date, time, location, 
        requirements, max_participants, organizer
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`,
      [title, description, date, time, location, requirements, max_participants, organizer]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('봉사활동 등록 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
}); 