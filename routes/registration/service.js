import Product from "../../models/Product.js";
// todo: 메시지 객체로 정리

// 상품 등록 API
const postNewProduct = async (req, res) => {
  try {
    console.log(req.body);
    const { name, description, price, tags } = req.body;
    if (!name || !description || !price || !tags)
      return res.status(400).send("필수 입력 값이 누락되었습니다.");
    const newProduct = await Product.create({
      name,
      description,
      price,
      tags,
    });
    res
      .status(201)
      .send({ message: "상품이 등록되었습니다.", data: newProduct });
  } catch (err) {
    console.log(err);
    res.status(500).send("서버 에러입니다.");
  }
};

const service = {
  postNewProduct,
};

export default service;
