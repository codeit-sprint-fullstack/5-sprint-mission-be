import { pool } from "./db.js";

export const seedDatabase = async () => {
  try {
    // 상품 시드 데이터
    const productsSeed = `
      INSERT INTO products (name, description, price, tags) 
      VALUES 
        ('테스트 상품 1', '테스트 상품 1 설명', 10000, ARRAY['전자기기', '신제품']),
        ('테스트 상품 2', '테스트 상품 2 설명', 20000, ARRAY['의류', '할인'])
      ON CONFLICT DO NOTHING;
    `;

    // 게시글 시드 데이터
    const articlesSeed = `
      INSERT INTO articles (title, content) 
      VALUES 
        ('테스트 게시글 1', '테스트 게시글 1 내용입니다.'),
        ('테스트 게시글 2', '테스트 게시글 2 내용입니다.')
      ON CONFLICT DO NOTHING;
    `;

    // 댓글 시드 데이터
    const commentsSeed = `
      INSERT INTO comments (content, article_id, product_id) 
      VALUES 
        ('테스트 게시글 1의 댓글입니다.', 1, NULL),
        ('테스트 상품 1의 댓글입니다.', NULL, 1)
      ON CONFLICT DO NOTHING;
    `;

    await pool.query(productsSeed);
    await pool.query(articlesSeed);
    await pool.query(commentsSeed);

    console.log("데이터베이스 시딩 완료");
  } catch (error) {
    console.error("데이터베이스 시딩 실패:", error);
  }
};
