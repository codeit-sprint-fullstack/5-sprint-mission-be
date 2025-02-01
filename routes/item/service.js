import Product from "../../models/product.js";
import Err from "./err.js";

const getProduct = async (req, res) => {
  console.log("get 호출");
  try {
    const limit = parseInt(req.query.limit) || 10; // 기본값을 10으로 설정
    const currentPage = parseInt(req.query.currentPage) || 1; // 기본값을 1로 설정
    const totalCount = await Product.countDocuments({}); // 전체 문서 수 계산 {}안에는 특정 조건 넣어서 찾을 수 있음
    const totalPages = Math.ceil(totalCount / limit); // 전체 페이지 수 계산
    const data = await Product.find({})
      .skip((currentPage - 1) * limit) // 전 페이지까지 건너뛰기
      .limit(limit); // 최대 limit 개수만큼 반환
    res.json({ data, totalCount, totalPages, currentPage });
  } catch (err) {
    Err(err, req, res);
  }
};

const service = {
  getProduct,
};

export default service;
