import { pool } from "../config/db.js";

const Comment = {
  /**
   * 댓글 목록을 조회합니다.
   * @param {Object} params - 조회 파라미터
   * @param {number} params.articleId - 게시글 ID (선택)
   * @param {number} params.productId - 상품 ID (선택)
   * @param {number} params.cursor - 커서 ID
   * @param {number} params.limit - 가져올 댓글 수
   * @returns {Promise<Array>} 댓글 목록
   */
  async find({ articleId, productId, cursor, limit = 10 }) {
    let query = `
      SELECT * FROM comments 
      WHERE 1=1
    `;
    const values = [];

    if (articleId) {
      query += ` AND article_id = $${values.length + 1}`;
      values.push(articleId);
    }

    if (productId) {
      query += ` AND product_id = $${values.length + 1}`;
      values.push(productId);
    }

    if (cursor) {
      query += ` AND id < $${values.length + 1}`;
      values.push(cursor);
    }

    query += ` ORDER BY created_at DESC LIMIT $${values.length + 1}`;
    values.push(limit);

    const result = await pool.query(query, values);
    return result.rows;
  },

  /**
   * 새로운 댓글을 생성합니다.
   * @param {Object} commentData - 댓글 데이터
   * @returns {Promise<Object>} 생성된 댓글 정보
   */
  async create(commentData) {
    const { content, articleId, productId } = commentData;
    const result = await pool.query(
      `INSERT INTO comments 
       (content, article_id, product_id) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [content, articleId || null, productId || null]
    );
    return result.rows[0];
  },

  /**
   * 댓글을 수정합니다.
   * @param {number} id - 댓글 ID
   * @param {Object} commentData - 수정할 댓글 데이터
   * @returns {Promise<Object>} 수정된 댓글 정보
   */
  async findByIdAndUpdate(id, commentData) {
    const { content } = commentData;
    const result = await pool.query(
      `UPDATE comments 
       SET content = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 RETURNING *`,
      [content, id]
    );
    return result.rows[0];
  },

  /**
   * 댓글을 삭제합니다.
   * @param {number} id - 댓글 ID
   * @returns {Promise<Object>} 삭제된 댓글 정보
   */
  async findByIdAndDelete(id) {
    const result = await pool.query(
      "DELETE FROM comments WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  },
};

export default Comment;
