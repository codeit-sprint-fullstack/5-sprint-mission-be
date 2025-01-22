import mongoose from "mongoose";
import Product from "../../models/Product.js";
// todo: 메시지 객체로 정리

// 상품 상세 조회 API - 상품 클릭하면 해당 상품 상세 조회
const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json("유효하지 않은 ID 형식입니다.");
    const result = await Product.findById(id);
    if (!result) return res.status(404).send("상품이 존재하지 않습니다.");
    res.status(200).send({ message: "상품 조회 결과입니다.", data: result });
  } catch (err) {
    console.log(err);
    res.status(500).send("서버 에러입니다.");
  }
};

// 상품 수정 API - 특정 상품 조회 후 수정
const patchProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json("유효하지 않은 ID 형식입니다.");

    const updatedProduct = req.body;

    if (
      !updatedProduct.name &&
      !updatedProduct.description & !updatedProduct.price &&
      !updatedProduct.tags
    )
      return res.status(400).send("하나 이상의 필드 값을 작성해주세요.");

    const product = await Product.findById(id);
    if (!product) return res.status(404).send("상품이 존재하지 않습니다.");

    for (let key in updatedProduct) {
      product[key] = updatedProduct[key];
    }

    product.updatedAt = new Date();

    await product.save(); // todo: 타입 검증을 하지 않아서 에러 뜰 거 같음

    res
      .status(201)
      .send({ message: "상품 정보가 수정되었습니다.", data: product });
  } catch (err) {
    console.log(err);
    res.status(500).send("서버 에러입니다.");
  }
};

// 상품 삭제 API
const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json("유효하지 않은 ID 형식입니다.");

    const result = await Product.findByIdAndDelete(id);
    if (!result) return res.status(404).send("상품이 존재하지 않습니다.");
    res
      .status(200) // 메시지 반환하려고 204 대신 200씀
      .send({ message: "상품이 성공적으로 삭제되었습니다.", data: result });
  } catch (err) {
    console.log(err);
    res.status(500).send("서버 에러입니다.");
  }
};

// 상품 목록 조회 API
const getItemsList = (items, sort, offset, limit, keyword) => {
  let paginatedItems = [...items];
  // todo: offset, limit의 맞지 않는 형식에 대해 오류처리도 해야할까(현재는 parseInt를 통해 NaN이 되고 slice에서 0으로 바뀌어서 오류 안뜸)
  const filter = {
    sort: sort || "recent",
    offset: offset !== undefined ? parseInt(offset) : 0,
    limit: limit !== undefined ? parseInt(limit) : 5,
    keyword,
  };
  //sort - 최신순 정렬
  if (filter.sort === "recent")
    paginatedItems.sort((a, b) => b.createdAt - a.createdAt);

  // keyword 처리
  if (keyword !== undefined) {
    paginatedItems = paginatedItems.filter(
      (item) =>
        item.name.includes(keyword) || item.description.includes(keyword)
    );
  }
  // offset, limit
  paginatedItems = paginatedItems.slice(
    filter.offset,
    filter.offset + filter.limit
  );
  // id, name, price, createdAt만 리턴 todo: 페이지네이션 위해 전체 products 값도 리턴해야 함
  const result = paginatedItems.map((item) => {
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      createdAt: item.createdAt,
    };
  });
  return result;
};

const getProductsList = async (req, res) => {
  try {
    const { sort, offset, limit, keyword } = req.query;
    const products = await Product.find().lean(); // Document객체 -> 일반 js 객체로 변환

    if (!products)
      return res.status(404).send({ message: "상품이 존재하지 않습니다." });

    // todo: 정해진 sort 값 아니면 에러 보내기

    const result = getItemsList(products, sort, offset, limit, keyword);
    res.status(200).send({ message: "상품 목록 리스트입니다.", data: result });
  } catch (err) {
    console.log(err);
    res.status(500).send("서버 에러입니다.");
  }
};

const service = {
  getProductById,
  patchProduct,
  deleteProduct,
  getProductsList,
};

export default service;
