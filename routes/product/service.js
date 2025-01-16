import Product from "../../models/product.js";

//1. 상품 등록 API를 만들어 주세요.
//name, description, price, tags를 입력하여 상품을 등록합니다.
const postProduct = async (req, res) => {
  try {
    const { name, description, price, tags } = req.body;
    const newProduct = new Product({ name, description, price, tags });
    if (!name || !description || !price || !tags) {
      res.status(400).send({
        message: "name, description, price, tags 모두 입력해야 합니다.",
      });
    }
    await newProduct.save(); //몽고디비에 저장
    res.send(newProduct);
  } catch (err) {
    console.log(err); //에러 로그 출력
    res
      .status(500)
      .send({ message: "서버에서 에러가 발생했습니다.", error: err.message });
  }
};

//2. 상품 상세 조회 API를 만들어 주세요.
//id, name, description, price, tags, createdAt를 조회합니다.
// app.get("/product/:id", async (req, res)
const getProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ _id: id });
    if (!product) {
      return res.status(404).send({ message: "해당 상품을 찾을 수 없습니다." });
    }
    res.status(200).json({
      id: product._id, //몽고디비 자동생성 id
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      createdAt: product.createdAt,
    });
  } catch (error) {
    console.log(err); //에러 로그 출력
    res
      .status(500)
      .send({ message: "서버에서 에러가 발생했습니다.", error: err.message });
  }
};

//3. 상품 수정 API를 만들어 주세요.
const patchProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, price, tags } = req.body; // 수정할 데이터는 body에서 가져옴
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).send({ message: "해당 상품을 찾을 수 없습니다." });
    }
    // 수정할 값이 존재하면 수정
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (tags) product.tags = tags;

    await product.save();

    console.log("수정된 상품 확인용", product);
    res.status(200).send({
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  } catch (err) {
    console.log(error);
    res
      .status(500)
      .send({ message: "서버에서 에러가 발생했습니다.", error: err.message });
  }
};

//4. 상품 삭제 API를 만들어 주세요.
const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    if (!id) {
      res.status(404).send({ message: "상품이 특정되지 않았습니다." });
    }
    if (!product) {
      res.status(404).send({ message: "해당 상품을 찾을 수 없습니다." });
    }
    res.status(200).send({ message: "상품이 삭제되었습니다." });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "서버에서 에러가 발생했습니다.", error: err.message });
  }
};
//5. 상품 목록 조회 API를 만들어 주세요.
// [ ] id, name, price, createdAt를 조회합니다.
// [ ] offset 방식의 페이지네이션 기능을 포함해 주세요.
// [ ] 최신순(recent)으로 정렬할 수 있습니다.
// [ ] name, description에 포함된 단어로 검색할 수 있습니다.
const getProductList = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "createdAt", search = "" } = req.query;
    // page와 limit 파라미터를 사용하여 시작 인덱스를 계산
    const skip = (page - 1) * limit;
    // 검색 조건 (name과 description에 포함된 단어로 검색)
    const searchRegex = new RegExp(search, "i");

    // 쿼리 빌딩: 검색, 정렬, 페이지네이션
    const products = await Product.find({
      $or: [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
      ],
    })
      .sort({ [sort]: -1 }) // 최신순 정렬 (내림차순)
      .skip(skip) // 페이지네이션: 시작 인덱스
      .limit(parseInt(limit)); // 페이지당 항목 수
    // 상품이 없을 경우 처리
    if (products.length === 0) {
      return res.status(404).send({ message: "상품을 찾을 수 없습니다." });
    }
    // 전체 상품 개수를 계산하여 페이지네이션 처리
    const totalItems = await Product.countDocuments({
      $or: [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
      ],
    });
    // 응답 데이터
    res.status(200).json({
      products, // 상품 목록
      totalItems, // 전체 상품 개수
      totalPages: Math.ceil(totalItems / limit), // 전체 페이지 수
      currentPage: parseInt(page), // 현재 페이지
    });

    // const products = await Product.find();
    // res.status(200).send(products);
  } catch (err) {
    console.log(err); //에러 로그 출력
    res
      .status(500)
      .send({ message: "서버에서 에러가 발생했습니다.", error: err.message });
  }
};

const service = {
  postProduct,
  getProduct,
  patchProduct,
  deleteProduct,
  getProductList,
};

export default service;
