import prisma from "../../prismaClient.js";

// 전체 상품 목록 조회
const getProductList = async (req, res, next) => {
  try {
    //페이지네이션
    const page = Number(req.query.page) || 1; //(기본값: 1)
    const limit = Number(req.query.limit) || 10; //(기본값: 10);
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
              ProductTag: {
                some: { tag: { contains: keyword, mode: "insensitive" } },
              }, //some: 배열 안에 조건 만족하는 최소 하나의 요소가 있는지
            },
          ],
        },
        { deletedAt: null }, //삭제 기록이 없는 데이터만 가져오기
      ],
    };

    //product collection에서 키워드 검색 - 정렬 - skip값 만큼 항목을 건너뛰어 limit개수 만큼 데이터 불러오기(deletedAt 컬럼 제외)
    const products = await prisma.product.findMany({
      where: searchCriteria,
      orderBy: sortOption,
      skip,
      take: limit,
      select: {
        id: true,
        userId: true,
        name: true,
        description: true,
        price: true,
        images: true,
        ProductTag: true, //연결된 외부 테이블 데이터도 include말고 select로 가져옴
        User: {
          select: {
            id: true,
            nickname: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    // 사용자가 로그인한 경우 좋아요 정보 추가
    let productsWithLike = products;
    if (req.user && req.user.id) {
      const { id: userId } = req.user;

      // 사용자가 좋아요한 상품 ID 목록 가져오기
      const likedProducts = await prisma.likeProduct.findMany({
        where: {
          userId,
          productId: { in: products.map((product) => product.id) },
          deletedAt: null,
        },
        select: {
          productId: true,
        },
      });

      const likedProductIds = new Set(
        likedProducts.map((like) => like.productId)
      );

      // 각 상품에 isLiked 필드와 소유자 정보 추가
      productsWithLike = products.map((product) => ({
        ...product,
        isLiked: likedProductIds.has(product.id),
        ownerId: product.User.id,
        ownerNickname: product.User.nickname,
        User: undefined, // 원본 User 객체 제거, 키 이름 바꾸기
      }));
    } else {
      // 로그인하지 않은 사용자는 모든 상품에 isLiked: false 설정
      productsWithLike = products.map((product) => ({
        ...product,
        isLiked: false,
        ownerId: product.User.id,
        ownerNickname: product.User.nickname,
        User: undefined, // 원본 User 객체 제거
      }));
    }

    //총 상품 수, 페이지 수 계산
    //검색 키워드에 맞는 전체 데이터 개수 불러오기
    const totalProducts = await prisma.product.count({
      where: searchCriteria,
    });
    const totalPages = Math.ceil(totalProducts / limit);

    //요청 성공 시 응답 객체
    const response = {
      ProductList: productsWithLike, //필터링된 상품 목록 (좋아요 정보 포함)
      totalProducts,
      totalPages,
    };

    res.status(200).send(response);
  } catch (e) {
    next(e);
  }
};

// 상품 상세 조회
const getProduct = async (req, res, next) => {
  try {
    const id = req.params.id;

    //id 일치하는 상품 찾기
    const product = await prisma.product.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        ProductTag: true,
        User: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    if (!product) {
      const error = new Error("상품을 찾을 수 없습니다.");
      error.name = "NotFoundError";
      throw error;
    }

    // 사용자가 로그인한 경우 좋아요 정보 추가 + 소유자 정보 추가
    let productWithLike = {
      ...product,
      isLiked: false,
      ownerId: product.User.id,
      ownerNickname: product.User.nickname,
      User: undefined, // 원본 User 객체 제거
    };

    if (req.user && req.user.id) {
      const { id: userId } = req.user;

      // 사용자가 이 상품을 좋아요했는지 확인
      const likeInfo = await prisma.likeProduct.findFirst({
        where: {
          userId,
          productId: id,
          deletedAt: null,
        },
      });

      productWithLike.isLiked = !!likeInfo;
    }

    res.status(200).send(productWithLike);
  } catch (e) {
    next(e);
  }
};

// 상품 등록
const createProduct = async (req, res, next) => {
  try {
    // 인증 확인 - req.user 객체가 없는 경우 에러 발생
    if (!req.user || !req.user.id) {
      const error = new Error("인증이 필요합니다.");
      error.name = "UnauthorizedError";
      throw error;
    }

    const { name, description, price, images, tags } = req.body;
    const { id: userId } = req.user; // 로그인한 사용자 ID 가져오기

    const newProduct = await prisma.product.create({
      data: {
        userId, // 현재 로그인한 사용자(상품 등록하는 소유자의 id) 저장
        name,
        description,
        price: Number(price), // 문자열로 들어올 수 있으므로 숫자로 변환
        images, // 미들웨어에서 처리된 이미지 경로 배열
        //기존에 있던 tag라면 거기에 상품id연결해주고, 새로운 tag라면 새 id와 함께 생성+상품id연결
        ProductTag: {
          connectOrCreate: tags
            ? tags.map((tag) => ({
                where: { tag },
                create: { tag },
              }))
            : [],
        },
      },
      include: {
        ProductTag: true, //같이 생성된 tags 데이터도 res.send해줌
        User: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    // 응답에 소유자 정보 추가
    const responseProduct = {
      ...newProduct,
      ownerId: newProduct.User.id,
      ownerNickname: newProduct.User.nickname,
      User: undefined, // 원본 User 객체 제거
    };

    res.status(201).send(responseProduct);
  } catch (e) {
    next(e);
  }
};

// id로 선택한 상품 수정
const patchProduct = async (req, res, next) => {
  try {
    // 인증 확인 - req.user 객체가 없는 경우 에러 발생
    if (!req.user || !req.user.id) {
      const error = new Error("인증이 필요합니다.");
      error.name = "UnauthorizedError";
      throw error;
    }

    const id = req.params.id;
    const { name, description, price, images, tags } = req.body;
    const { id: userId } = req.user; // 로그인한 사용자 ID 가져오기

    // 상품 존재 여부 확인
    const existingProduct = await prisma.product.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        ProductTag: true,
      },
    });

    if (!existingProduct) {
      const error = new Error("상품을 찾을 수 없습니다.");
      error.name = "NotFoundError";
      throw error;
    }

    // 상품 소유자 확인
    if (existingProduct.userId !== userId) {
      const error = new Error("상품을 수정할 권한이 없습니다.");
      error.name = "ForbiddenError";
      throw error;
    }

    //업데이트 데이터 정의
    const updateData = {
      name,
      description,
      price: Number(price),
      images,
    };

    if (tags) {
      updateData.ProductTag = {
        //기존에 있던 태그는 테이블 연결 해제하고 새로운 태그 연결해주기
        disconnect: existingProduct.ProductTag.map((tag) => ({ id: tag.id })),
        connectOrCreate: tags.map((tag) => ({
          where: { tag },
          create: { tag },
        })),
      };
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        ProductTag: true,
        User: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    // 응답에 소유자 정보 추가
    const responseProduct = {
      ...updatedProduct,
      ownerId: updatedProduct.User.id,
      ownerNickname: updatedProduct.User.nickname,
      User: undefined, // 원본 User 객체 제거
    };

    res.status(200).send(responseProduct);
  } catch (e) {
    next(e);
  }
};

// 상품 삭제
const deleteProduct = async (req, res, next) => {
  try {
    // 인증 확인 - req.user 객체가 없는 경우 에러 발생
    if (!req.user || !req.user.id) {
      const error = new Error("인증이 필요합니다.");
      error.name = "UnauthorizedError";
      throw error;
    }

    const id = req.params.id;
    const { id: userId } = req.user; // 로그인한 사용자 ID 가져오기

    // 상품 존재 여부 확인
    const existingProduct = await prisma.product.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingProduct) {
      const error = new Error("상품을 찾을 수 없습니다.");
      error.name = "NotFoundError";
      throw error;
    }

    // 상품 소유자 확인
    if (existingProduct.userId !== userId) {
      const error = new Error("상품을 삭제할 권한이 없습니다.");
      error.name = "ForbiddenError";
      throw error;
    }

    const deletedProduct = await prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        ProductTag: true,
        deletedAt: true,
      },
    });

    res.status(202).send({
      message: "삭제 처리가 완료되었습니다.",
      data: deletedProduct,
    });
  } catch (e) {
    next(e);
  }
};

const createLike = async (req, res, next) => {
  try {
    // 인증 확인 - req.user 객체가 없는 경우 에러 발생
    if (!req.user || !req.user.id) {
      const error = new Error("인증이 필요합니다.");
      error.name = "UnauthorizedError";
      throw error;
    }

    const { id } = req.params;
    const { id: userId } = req.user; // 로그인한 사용자 ID 가져오기

    // 트랜잭션 사용
    const result = await prisma.$transaction(async (tx) => {
      // 상품 존재 여부 확인
      const product = await tx.product.findUnique({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!product) {
        const error = new Error("상품을 찾을 수 없습니다.");
        error.name = "NotFoundError";
        throw error;
      }

      // 이미 좋아요 했는지 확인
      const existingLike = await tx.likeProduct.findFirst({
        where: {
          userId,
          productId: id,
          deletedAt: null,
        },
      });

      if (existingLike) {
        const error = new Error("이미 좋아요한 상품입니다.");
        error.name = "ValidationError";
        throw error;
      }

      // 좋아요 생성
      const like = await tx.likeProduct.create({
        data: {
          userId,
          productId: id,
        },
      });

      // 상품의 좋아요 수 증가
      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          favoritesCount: { increment: 1 },
        },
        include: {
          ProductTag: true,
          User: {
            select: {
              id: true,
              nickname: true,
            },
          },
        },
      });

      return {
        like,
        product: {
          ...updatedProduct,
          ownerId: updatedProduct.User.id,
          ownerNickname: updatedProduct.User.nickname,
          User: undefined,
        },
      };
    });

    res.status(201).send({
      isSuccess: true,
      data: result.product,
    });
  } catch (e) {
    next(e);
  }
};

const deleteLike = async (req, res, next) => {
  try {
    // 인증 확인 - req.user 객체가 없는 경우 에러 발생
    if (!req.user || !req.user.id) {
      const error = new Error("인증이 필요합니다.");
      error.name = "UnauthorizedError";
      throw error;
    }

    const { id } = req.params;
    const { id: userId } = req.user; // 로그인한 사용자 ID 가져오기

    // 트랜잭션 사용
    const result = await prisma.$transaction(async (tx) => {
      // 상품 존재 여부 확인
      const product = await tx.product.findUnique({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!product) {
        const error = new Error("상품을 찾을 수 없습니다.");
        error.name = "NotFoundError";
        throw error;
      }

      // 좋아요 존재 여부 확인
      const existingLike = await tx.likeProduct.findFirst({
        where: {
          userId,
          productId: id,
          deletedAt: null,
        },
      });

      if (!existingLike) {
        const error = new Error("좋아요 정보를 찾을 수 없습니다.");
        error.name = "NotFoundError";
        throw error;
      }

      // 좋아요 소프트 삭제 (deletedAt 설정)
      const deletedLike = await tx.likeProduct.update({
        where: { id: existingLike.id },
        data: {
          deletedAt: new Date(),
        },
      });

      // 상품의 좋아요 수 감소
      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          favoritesCount: { decrement: 1 },
        },
        include: {
          ProductTag: true,
          User: {
            select: {
              id: true,
              nickname: true,
            },
          },
        },
      });

      return {
        deletedLike,
        product: {
          ...updatedProduct,
          ownerId: updatedProduct.User.id,
          ownerNickname: updatedProduct.User.nickname,
          User: undefined,
        },
      };
    });

    res.status(200).send({
      message: "좋아요가 취소되었습니다.",
      data: result.product,
    });
  } catch (e) {
    next(e);
  }
};

const service = {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
  createLike,
  deleteLike,
};

export default service;
