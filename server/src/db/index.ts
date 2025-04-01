import { Pool } from 'pg';

// 환경 변수 검증
const dbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Smreoahwk33@',
  port: 5432,
};

console.log('데이터베이스 연결 설정:', {
  ...dbConfig,
  password: '****' // 보안을 위해 비밀번호는 숨김
});

const pool = new Pool(dbConfig);

// 연결 테스트
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('데이터베이스 연결 오류:', err);
    return;
  }
  console.log('데이터베이스 연결 성공:', res.rows[0]);
});

export { pool }; 