import Product from "../../models/product.js";

//1. 상품 등록 API를 만들어 주세요.
//name, description, price, tags를 입력하여 상품을 등록합니다.
const postProduct = async (req, res) => {
  try {
    console.log("상품 등록 시작");
    const { name, description, price, tags } = req.body;
    const newProduct = new Product({ name, description, price, tags });
    if (!name || !description || !price || !tags) {
      res.status(400).send({
        message: "name, description, price, tags 모두 입력해야 합니다.",
      });
    }
    await newProduct.save(); //몽고디비에 저장
    res.send(newProduct);
    console.log("상품 등록 완료");
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
    console.log("getProductList: 전체 상품 목록 조회 시작");

    // 클라이언트에서 전달받은 page와 limit 파라미터 처리
    const page = parseInt(req.query.page) || 1; // 기본값 1
    const limit = parseInt(req.query.limit) || 10; // 기본값 10

    // 페이지 번호와 limit 값에 따른 skip 계산
    const skip = (page - 1) * limit;

    // 정렬 기준 처리: 'createdAt' 필드를 기준으로 내림차순 정렬
    const sort = req.query.sort || "createdAt"; // 기본값은 'createdAt'
    const order = req.query.order === "desc" ? -1 : 1; // 'desc'이면 내림차순, 아니면 오름차순

    // MongoDB에서 페이징 처리된 상품 목록 조회
    const products = await Product.find()
      .sort({ [sort]: order }) // 정렬 기준 추가
      .skip(skip) // skip: 이전 페이지의 데이터 건수만큼 건너뛰기
      .limit(limit); // limit: 페이지당 표시할 데이터 개수

    // 상품이 없으면 404 상태 코드 반환
    if (products.length === 0) {
      return res.status(404).send({ message: "상품을 찾을 수 없습니다." });
    }

    // 전체 상품 개수 조회
    const totalItems = await Product.countDocuments(); // 전체 상품 개수

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(totalItems / limit); // 전체 데이터 개수 / 페이지당 개수 = 전체 페이지 수

    console.log("getProductList 조회 확인용2");

    // 응답 데이터 반환
    res.status(200).json({
      products, // 상품 목록
      totalItems, // 전체 상품 개수
      totalPages, // 전체 페이지 수
      currentPage: page, // 현재 페이지
    });

    console.log("getProductList: 전체 상품 목록 조회 완료");
  } catch (err) {
    console.log(err); // 에러 로그 출력
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
