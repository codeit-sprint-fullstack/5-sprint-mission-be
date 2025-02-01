import Product from "../../models/product.js";
import Err from "./err.js";

const uploadProduct = async (req, res) => {
  console.log("post 호출");
  try {
    const product = new Product(req.body);
    await product.save(); // 비동기여서 await 사용
    res.json(product); // 헤더를 자동으로 Content-Type: application/json 설정해줌
  } catch (err) {
    Err(err, res);
  }
};

const service = {
  uploadProduct,
};

export default service;
