const { pool } = require("../config/db");

const Article = {
  /**
   * 게시글 목록을 조회합니다.
   * @param {number} offset - 건너뛸 게시글 수
   * @param {number} limit - 가져올 게시글 수
   * @param {string} search - 검색어 (제목, 내용)
   * @returns {Promise<Array>} 게시글 목록
   */
  async find(offset = 0, limit = 10, search = "") {
    let query = `
      SELECT * FROM articles 
      WHERE 1=1
    `;
    const values = [];

    if (search) {
      query += ` AND (title ILIKE $1 OR content ILIKE $1)`;
      values.push(`%${search}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${
      values.length + 2
    }`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  },

  /**
   * 특정 게시글을 조회합니다.
   * @param {number} id - 게시글 ID
   * @returns {Promise<Object>} 게시글 정보
   */
  async findById(id) {
    const result = await pool.query("SELECT * FROM articles WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  },

  /**
   * 새로운 게시글을 생성합니다.
   * @param {Object} articleData - 게시글 데이터
   * @returns {Promise<Object>} 생성된 게시글 정보
   */
  async create(articleData) {
    const { title, content } = articleData;
    const result = await pool.query(
      "INSERT INTO articles (title, content) VALUES ($1, $2) RETURNING *",
      [title, content]
    );
    return result.rows[0];
  },

  /**
   * 게시글을 수정합니다.
   * @param {number} id - 게시글 ID
   * @param {Object} articleData - 수정할 게시글 데이터
   * @returns {Promise<Object>} 수정된 게시글 정보
   */
  async findByIdAndUpdate(id, articleData) {
    const { title, content } = articleData;
    const result = await pool.query(
      `UPDATE articles 
       SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 RETURNING *`,
      [title, content, id]
    );
    return result.rows[0];
  },

  /**
   * 게시글을 삭제합니다.
   * @param {number} id - 게시글 ID
   * @returns {Promise<Object>} 삭제된 게시글 정보
   */
  async findByIdAndDelete(id) {
    const result = await pool.query(
      "DELETE FROM articles WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  },
};

module.exports = Article;
