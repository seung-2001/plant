-- 사용자 테이블
CREATE TABLE IF NOT EXISTS app_user (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE
);

-- 게시판 테이블
CREATE TABLE IF NOT EXISTS board_post (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    author_email VARCHAR(255) REFERENCES app_user(email),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 댓글 테이블
CREATE TABLE IF NOT EXISTS board_comment (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES board_post(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author_email VARCHAR(255) REFERENCES app_user(email),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 봉사활동 정보 테이블
CREATE TABLE IF NOT EXISTS volunteer_info (
    id SERIAL PRIMARY KEY,
    progrmRegistNo VARCHAR(255) UNIQUE NOT NULL,
    prgramSj VARCHAR(255) NOT NULL,
    actBeginDe DATE,
    actEndDe DATE,
    actPlace VARCHAR(255)
); 