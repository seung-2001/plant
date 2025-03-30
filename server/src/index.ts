import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// 라우터 임포트
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import volunteerRoutes from './routes/volunteerRoutes';

// 환경 변수 로드
dotenv.config();

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('MongoDB 연결 성공'))
  .catch((err) => console.error('MongoDB 연결 실패:', err));

// 라우트 설정
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/volunteers', volunteerRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Plant App API 서버가 실행 중입니다.' });
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 