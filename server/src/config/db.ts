import { Pool } from 'pg';

// DB 연결 설정
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

// DB 연결 이벤트 핸들러 추가
pool.on('connect', () => {
  console.log('PostgreSQL DB에 연결되었습니다.');
});

pool.on('error', (err) => {
  console.error('PostgreSQL DB 오류:', err);
});

export default pool; 