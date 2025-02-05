import { pool } from "../config/db.js";

const Product = {
  async find(offset = 0, limit = 10) {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [limit, offset]
    );
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  },

  async create(productData) {
    const { name, description, price, tags } = productData;
    const intPrice = Math.round(Number(price));

    const result = await pool.query(
      "INSERT INTO products (name, description, price, tags) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, intPrice, tags]
    );
    return result.rows[0];
  },

  async findByIdAndUpdate(id, productData) {
    const { name, description, price, tags } = productData;
    const intPrice = Math.round(Number(price));

    const result = await pool.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, tags = $4, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $5 RETURNING *`,
      [name, description, intPrice, tags, id]
    );
    return result.rows[0];
  },

  async findByIdAndDelete(id) {
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  },

  async incrementLikes(id) {
    const result = await pool.query(
      "UPDATE products SET likes = likes + 1 WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  },

  /**
   * 상품의 좋아요를 토글합니다.
   * likes가 0보다 크면 좋아요를 취소하고, 0이면 좋아요를 추가합니다.
   * @param {number} id - 상품 ID
   * @returns {Promise<Object>} 업데이트된 상품 정보
   */
  async toggleLike(id) {
    const result = await pool.query(
      `UPDATE products 
       SET likes = CASE 
         WHEN likes > 0 THEN likes - 1 -- 좋아요가 있으면 취소
         ELSE likes + 1 -- 좋아요가 없으면 추가
       END 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );
    return result.rows[0];
  },
};

export default Product;
