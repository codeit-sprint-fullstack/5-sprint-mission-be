import Product from "../../models/Product.js";

//전체 상품 목록 조회
const getProductList = async (req, res) => {
  try {
    //페이지네이션
    const page = parseInt(req.query.page) || 1; //(기본값: 1)
    const limit = parseInt(req.query.limit) || 100; //(기본값: 100);
    const skip = (page - 1) * limit; //페이지네이션을 위한 skip값 계산

    //정렬
    const sort = req.query.sort || "recent"; //(기본값: 최신순)
    let sortOption;
    if (sort === "favorite") {
      sortOption = { favoritesCount: -1 }; //좋아요순
    } else {
      sortOption = { createdAt: sort === "recent" ? -1 : 1 }; //최신순 (-1이 "desc"랑 같은 역할)
    }

    //키워드 검색
    const keyword = req.query.keyword || ""; //(기본값: 빈 문자열)

    //products collection에서 키워드 검색 - 정렬 - skip값 만큼 항목을 건너뛰어 limit개수 만큼 데이터 불러오기
    const products = await Product.find({
      $or: [
        { name: { $regex: keyword } },
        { description: { $regex: keyword } },
        { tags: { $elemMatch: { $regex: keyword } } }, //$eleMatch: 배열의 각 요소에 조건 적용
      ], //name, description, tags에 포함된 단어로 키워드 검색($regex로 부분 문자열 검색 가능하도록)
    })
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    //총 상품 수, 페이지 수 계산
    const totalProducts = await Product.countDocuments({
      $or: [
        { name: { $regex: keyword } },
        { description: { $regex: keyword } },
        { tags: { $elemMatch: { $regex: keyword } } },
      ],
    }); //collection서 (키워드에 맞는) 전체 데이터 개수 불러오기
    const totalPages = Math.ceil(totalProducts / limit);

    //요청 성공 시 응답 포맷 설정
    const response = {
      status: 200,
      ProductList: products.map((product) => ({
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images,
        tags: product.tags,
        favoritesCount: product.favoritesCount,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      })),
      totalProducts,
      totalPages,
      page,
      limit,
      sort,
      keyword,
    };

    res.status(200).send(response);
  } catch (e) {
    res.status(500).send({ message: "서버 에러입니다." });
  }
};

//상품 상세 조회
const getProduct = async (req, res) => {
  try {
    const id = req.params.id;
    //몽고디비 id 조건이 길이 24로 고정이라 길이 확인
    if (id.length !== 24 || !id) {
      return res.status(404).send({ message: "id가 잘못 됐습니다." });
    }

    const product = await Product.findById(id); //id 일치하는 상품 찾기
    if (!product) {
      return res.status(404).send({ message: "상품을 찾을 수 없습니다." });
    }

    res.status(200).send(product);
  } catch (e) {
    res.status(500).send({ message: "서버 에러입니다." });
  }
};

//상품 등록
const createProduct = async (req, res) => {
  try {
    const { name, description, price, images, tags } = req.body;

    //상품 등록
    const newProduct = await Product.create({
      name,
      description,
      price,
      images,
      tags,
    });

    //저장 전, 자동으로 required 검증, validate 수행
    await newProduct.save();
    res.status(201).send(newProduct);
  } catch (e) {
    //FIXME: request.http에서 다 json으로 전송해서 자료형 에러도 제대로 처리되는지 아직 확인 못함. 프론트할때 확인해볼것.
    //유효성 검증(필수값, 자료형, 이미지 배열 길이) 에러
    if (e.name === "ValidationError")
      res.status(400).send({ message: `유효성 검사 오류 - ${e.message}` });

    //기타 서버 에러
    res.status(500).send({ message: "서버 에러입니다." });
  }
};

//id로 선택한 상품 수정
const patchProduct = async (req, res) => {
  try {
    const id = req.params.id;
    //몽고디비 id 조건이 길이 24로 고정이라 길이 확인
    if (id.length !== 24 || !id) {
      return res.status(404).send({ message: "id가 잘못 됐습니다." });
    }

    const product = await Product.findById(id); //id 일치하는 상품 찾기
    if (!product) {
      return res.status(404).send({ message: "상품을 찾을 수 없습니다." });
    }

    //body에서 일치하는 key의 값만 수정해서 저장.
    Object.keys(req.body).forEach((key) => {
      product[key] = req.body[key];
    });

    await product.save(); //변경된 데이터 저장
    res.status(200).send(product); //수정된 상품 반환
  } catch (e) {
    //FIXME: 여기도 자료형 에러 확인~
    //유효성 검증(자료형, 이미지 배열 길이) 에러
    if (e.name === "ValidationError") {
      return res
        .status(400)
        .send({ message: `유효성 검사 오류 - ${e.message}` });
    }

    //기타 서버 에러
    res.status(500).send({ message: "서버 에러입니다." });
  }
};

//상품 삭제
const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    //몽고디비 id 조건이 길이 24로 고정이라 길이 확인
    if (id.length !== 24 || !id) {
      return res.status(404).send({ message: "id가 잘못 됐습니다." });
    }

    const product = await Product.findByIdAndDelete(id); //id 일치하는 상품 찾기
    if (!product) {
      return res.status(404).send({ message: "상품을 찾을 수 없습니다." });
    }

    res.status(202).send({ message: "삭제가 완료되었습니다." });
  } catch (e) {
    res.status(500).send("서버 에러입니다.");
  }
};

const service = {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
};

export default service;
