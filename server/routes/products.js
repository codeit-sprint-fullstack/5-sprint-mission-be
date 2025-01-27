import express from "express";
import Product from "../models/product.js";

const router = express.Router();

//상품 목록 조회
router.get("/", async (req, res) => {
  try {
    //search 검색 키워드
    const { page = 1, pageSize = 10, search = "" } = req.query;
    // name이나 description 필드에서 검색 수행, 없으면 빈객체
    // $or 연산자 : MongoDB에서 여러 조건 중 하나라도 만족하는 문서 찾기 위한 연산자
    // RegExp : search로 키워드 받고, 'i'=대소문자 구분하지 않고 검색
    const query = search
      ? {
          $or: [
            { name: new RegExp(search, "i") },
            { description: new RegExp(search, "i") },
          ],
        }
      : {};

    const product = await Product.find(query)
      //sort: 데이터 정렬 1:오름차순 , -1:내림차순
      .sort({ createdAt: -1 })
      //.skip(N): 처음 N개의 문서를 건너뛰고 데이터 조회
      // 처음페이지 1을 건너뛰고 2부터 조회되게 설정
      .skip((page - 1) * pageSize)
      //.limit(N): 조회할 문서의 최대 개수 제한
      .limit(Number(pageSize));
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send(console.log("CAN NOT FOUND ERROR"));
  }
});

//상품 등록
router.post("/", async (req, res) => {
  try {
    const { name, description, price, tags } = req.body;
    const product = new Product({ name, description, price, tags });
    await product.save();
    res.status(201).send(product);
  } catch (err) {
    res.status(500).send(console.log("CAN NOT FOUND ERROR"));
  }
});

//상품 상세 조회
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("CAN NOT FOUND PRODUCT");
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send("CAN NOT FOUND ERROR");
  }
});

//상품 수정
router.patch("/:id", async (req, res) => {
  try {
    const upData = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, upData, {
      new: true,
    });
    if (!product) return res.status(404).send("CAN NOT FOUND PRODUCT");
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send("CAN NOT FOUND ERROR");
  }
});

//상품 삭제
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).send("CAN NOT FOUND PRODUCT");
    res.status(204).send("PRODUCT DELETED SUCCESS");
  } catch (err) {
    res.status(500).send("CAN NOT FOUND ERROR");
  }
});

export default router;
