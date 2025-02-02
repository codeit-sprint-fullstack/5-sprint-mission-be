// PostgreSQL 데이터베이스 연결을 위한 설정 파일입니다.

// 1. 필요한 모듈 불러오기
import pg from "pg";
import dotenv from "dotenv";

const { Pool } = pg;
dotenv.config();

// 2. 데이터베이스 연결 설정
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // 환경변수에서 DB 연결 문자열 가져오기
});

// 3. 데이터베이스 연결 및 테이블 생성 함수
export const connectDB = async () => {
  try {
    // 데이터베이스 연결
    await pool.connect();
    console.log("PostgreSQL 연결 성공");

    // products 테이블 생성 쿼리
    const createProductsTable = `
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        tags TEXT[],
        likes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createArticlesTable = `
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createCommentsTable = `
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CHECK (
          (article_id IS NOT NULL AND product_id IS NULL) OR
          (article_id IS NULL AND product_id IS NOT NULL)
        )
      );
    `;

    await pool.query(createProductsTable);
    await pool.query(createArticlesTable);
    await pool.query(createCommentsTable);

    console.log("테이블 생성 완료");
  } catch (error) {
    console.error("PostgreSQL 연결/설정 실패", error);
    process.exit(1);
  }
};

export { pool };
