import prisma from "../../prismaClient.js";

// 전체 상품 목록 조회
const getProductList = async (req, res) => {
  try {
    //페이지네이션
    const page = Number(req.query.page) || 1; //(기본값: 1)
    const limit = Number(req.query.limit) || 100; //(기본값: 100);
    const skip = (page - 1) * limit; //페이지네이션을 위한 skip값 계산

    //정렬
    const sort = req.query.sort || "recent"; //(기본값: 최신순)
    const sortOption =
      sort === "favorite"
        ? { favoritesCount: "desc" } //좋아요순
        : { createdAt: sort === "recent" ? "desc" : "asc" };

    //키워드 검색
    const keyword = req.query.keyword || ""; //(기본값: 빈 문자열)

    //name, description, tags 키워드 검색 조건
    const searchCriteria = {
      AND: [
        {
          OR: [
            { name: { contains: keyword, mode: "insensitive" } },
            { description: { contains: keyword, mode: "insensitive" } }, //insensitive: 대소문자 구문x 검색
            {
              productsTags: {
                some: { tag: { contains: keyword, mode: "insensitive" } },
              }, //some: 배열 안에 조건 만족하는 최소 하나의 요소가 있는지
            },
          ],
        },
        { deletedAt: null }, //삭제 기록이 없는 데이터만 가져오기
      ],
    };

    //products collection에서 키워드 검색 - 정렬 - skip값 만큼 항목을 건너뛰어 limit개수 만큼 데이터 불러오기(deletedAt 컬럼 제외)
    const products = await prisma.products.findMany({
      where: searchCriteria,
      orderBy: sortOption,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        images: true,
        favoritesCount: true,
        productsTags: true, //연결된 외부 테이블 데이터도 include말고 select로 가져옴
        createdAt: true,
        updatedAt: true,
      },
    });

    //총 상품 수, 페이지 수 계산
    //검색 키워드에 맞는 전체 데이터 개수 불러오기
    const totalProducts = await prisma.products.count({
      where: searchCriteria,
    });
    const totalPages = Math.ceil(totalProducts / limit);

    //요청 성공 시 응답 객체
    const response = {
      status: 200,
      ProductList: products, //필터링된 상품 목록
      totalProducts,
      totalPages,
      page,
      limit,
      sort,
      keyword,
    };

    res.status(200).send(response);
  } catch (e) {
    // console.log("err:", e);
    res.status(500).send({ message: "서버 에러입니다." });
  }
};

// 상품 상세 조회
const getProduct = async (req, res) => {
  try {
    const id = req.params.id;

    //id 일치하는 상품 찾기
    const product = await prisma.products.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        productsTags: true,
      },
    });

    if (!product) {
      return res.status(404).send({ message: "상품을 찾을 수 없습니다." });
    }

    res.status(200).send(product);
  } catch (e) {
    res.status(500).send({ message: "서버 에러입니다." });
  }
};

// 상품 등록
const createProduct = async (req, res) => {
  try {
    const { name, description, price, images, tags } = req.body;

    const newProduct = await prisma.products.create({
      data: {
        name,
        description,
        price,
        images,
        //XXX: N:N으로 연결된 테이블에 데이터 한 번에 같이 추가하기
        //기존에 있던 tag라면 거기에 상품id연결해주고, 새로운 tag라면 새 id와 함께 생성+상품id연결
        productsTags: {
          connectOrCreate: tags.map((tag) => ({
            where: { tag },
            create: { tag },
          })),
        },
      },
      include: {
        productsTags: true, //같이 생성된 tags 데이터도 res.send해줌
      },
    });

    res.status(201).send(newProduct);
  } catch (e) {
    // console.log("e", e);
    //기타 서버 에러
    res.status(500).send({ message: "서버 에러입니다." });
  }
};

// id로 선택한 상품 수정
const patchProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, price, images, tags } = req.body;

    // 상품 존재 여부 확인
    const existingProduct = await prisma.products.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        productsTags: true,
      },
    });

    if (!existingProduct) {
      return res.status(404).send({ message: "상품을 찾을 수 없습니다." });
    }

    //업데이트 데이터 정의
    const updateData = {
      name,
      description,
      price,
      images,
    };

    if (tags) {
      updateData.productsTags = {
        //기존에 있던 태그는 테이블 연결 해제하고 새로운 태그 연결해주기
        disconnect: existingProduct.productsTags.map((tag) => ({ id: tag.id })),
        connectOrCreate: tags.map((tag) => ({
          where: { tag },
          create: { tag },
        })),
      };
    }

    const updatedProduct = await prisma.products.update({
      where: { id },
      data: updateData,
      include: { productsTags: true },
    });

    res.status(200).send(updatedProduct); //수정된 상품
  } catch (e) {
    //기타 서버 에러
    // console.log("err: ", e);
    res.status(500).send({ message: "서버 에러입니다." });
  }
};

// 상품 삭제
const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    // 상품 존재 여부 확인
    const existingProduct = await prisma.products.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        productsTags: true,
      },
    });

    if (!existingProduct) {
      return res.status(404).send({ message: "상품을 찾을 수 없습니다." });
    }

    //업데이트 데이터 정의
    const updateData = {
      deletedAt: new Date(),
    };

    //연결된 태그가 있다면 연결 끊어주기
    if (existingProduct.productsTags.length >= 1) {
      updateData.productsTags = {
        disconnect: existingProduct.productsTags.map((tag) => ({ id: tag.id })),
      };
    }

    const deletedProduct = await prisma.products.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        productsTags: true, //연결된 외부 테이블 데이터도 include말고 select로 가져옴
        deletedAt: true,
      },
    });

    res.status(202).send({
      message: "삭제 처리가 완료되었습니다.",
      data: deletedProduct,
    });
  } catch (e) {
    // console.log("err: ", e);
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
