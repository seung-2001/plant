import dotenv from 'dotenv';
import path from 'path';

// 환경 변수 설정 (가장 먼저 실행)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import pool from './config/db';

const app = express();

// DB 연결 설정 출력
console.log('DB 연결 설정:', {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: '****',
  port: process.env.DB_PORT,
});

// CORS 설정 (가장 먼저 적용)
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:19006', 'http://localhost:19000', 'http://192.168.200.100:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// 요청 본문 파싱 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 요청 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  next();
});

// 데이터베이스 연결 확인
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('데이터베이스 연결 실패:', err);
    return;
  }
  console.log('데이터베이스 연결 성공:', res.rows[0]);
});

// 라우트 설정
app.use('/api/auth', authRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Plant App API 서버가 실행 중입니다.' });
});

// 서버 시작
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 