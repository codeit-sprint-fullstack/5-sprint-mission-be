import prisma from "../../prismaClient.js";

// 전체 상품 목록 조회
const getProductList = async (req, res, next) => {
  try {
    //페이지네이션
    const page = Number(req.query.page) || 1; //(기본값: 1)
    const pageSize = Number(req.query.pageSize) || 10; //(기본값: 10);
    const skip = (page - 1) * pageSize; //페이지네이션을 위한 skip값 계산

    //정렬
    const orderBy = req.query.orderBy || "recent"; //(기본값: 최신순)
    const sortOption =
      orderBy === "favorite"
        ? [
            {
              LikeProduct: {
                _count: "desc",
              },
            },
            { createdAt: "desc" }, // 좋아요 수가 같을 경우 최신순으로
          ]
        : { createdAt: orderBy === "recent" ? "desc" : "asc" };

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

    // 현재 로그인한 사용자 ID
    const userId = req.user?.id;

    // 로그인한 사용자인 경우, 해당 사용자가 좋아요한 상품 ID 목록을 먼저 조회
    let likedProductIds = [];
    if (userId) {
      // 삭제되지 않은 좋아요 정보만 조회
      const userLikes = await prisma.likeProduct.findMany({
        where: {
          userId: userId,
          deletedAt: null,
        },
        select: {
          productId: true,
        },
      });

      likedProductIds = userLikes.map((item) => item.productId);
    }

    //product collection에서 키워드 검색 - 정렬 - skip값 만큼 항목을 건너뛰어 limit개수 만큼 데이터 불러오기(deletedAt 컬럼 제외)
    const products = await prisma.product.findMany({
      where: searchCriteria,
      orderBy: sortOption,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        images: true,
        favoritesCount: true,
        createdAt: true,
        updatedAt: true,
        ProductTag: {
          select: {
            tag: true,
          },
        },
        User: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
      skip,
      take: pageSize,
    });

    // 응답 데이터 형식 변환
    const formattedProducts = products.map((product) => {
      const isLiked = userId ? likedProductIds.includes(product.id) : false;
      console.log(`Product ${product.id} isLiked:`, isLiked);

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images,
        tags: product.ProductTag.map((pt) => pt.tag),
        likeCount: product.favoritesCount,
        isLiked: isLiked,
        ownerId: product.User.id,
        ownerNickname: product.User.nickname,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      };
    });

    //총 상품 수, 페이지 수 계산
    //검색 키워드에 맞는 전체 데이터 개수 불러오기
    const totalProducts = await prisma.product.count({
      where: searchCriteria,
    });
    const totalPages = Math.ceil(totalProducts / pageSize);

    //요청 성공 시 응답 객체
    const response = {
      ProductList: formattedProducts,
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
    const userId = req.user?.id; // 로그인한 사용자 ID (없을 수도 있음)

    // 상품 존재 여부 확인
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

    // 로그인한 사용자인 경우 좋아요 여부 확인
    let isLiked = false;
    if (userId) {
      // 삭제되지 않은 좋아요 정보만 조회
      const likeExists = await prisma.likeProduct.findFirst({
        where: {
          userId: userId,
          productId: id,
          deletedAt: null,
        },
      });

      isLiked = !!likeExists; // likeExists가 존재하면 true, 없으면 false
    }

    // 사용자가 로그인한 경우 좋아요 정보 추가 + 소유자 정보 추가
    const productWithLike = {
      ...product,
      likeCount: product.favoritesCount, // 상품 테이블의 favoritesCount 사용
      isLiked: isLiked, // 사용자의 좋아요 여부
      ownerId: product.User.id,
      ownerNickname: product.User.nickname,
      User: undefined, // 원본 User 객체 제거
    };

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

    const { name, description, price, images = [], tags = [] } = req.body;
    const { id: userId } = req.user; // 로그인한 사용자 ID 가져오기

    // 이미지 경로가 문자열인 경우 배열로 변환
    const imageArray = Array.isArray(images)
      ? images
      : [images].filter(Boolean);

    const newProduct = await prisma.product.create({
      data: {
        userId, // 현재 로그인한 사용자(상품 등록하는 소유자의 id) 저장
        name,
        description,
        price: Number(price), // 문자열로 들어올 수 있으므로 숫자로 변환
        images: imageArray, // 이미지 배열 사용
        //기존에 있던 tag라면 거기에 상품id연결해주고, 새로운 tag라면 새 id와 함께 생성+상품id연결
        ProductTag: {
          connectOrCreate:
            tags && tags.length > 0
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
    const { name, description, price, images = [], tags = [] } = req.body;
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
      images: images || [], // 이미지가 없으면 빈 배열로 설정
    };

    if (tags) {
      updateData.ProductTag = {
        //기존에 있던 태그는 테이블 연결 해제하고 새로운 태그 연결해주기
        disconnect: existingProduct.ProductTag.map((tag) => ({ id: tag.id })),
        connectOrCreate:
          tags.length > 0
            ? tags.map((tag) => ({
                where: { tag },
                create: { tag },
              }))
            : [],
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
        deletedAt: true,
      },
    });

    if (!deletedProduct) {
      const error = new Error("상품을 삭제할 수 없습니다.");
      error.name = "NotFoundError";
      throw error;
    }

    res.status(202).send({
      isSuccess: true,
      message: "삭제 처리가 완료되었습니다.",
    });
  } catch (e) {
    next(e);
  }
};

// 상품 좋아요
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
          isLiked: true, // 좋아요를 생성했으므로 isLiked를 true로 설정
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
          isLiked: false, // 좋아요를 취소했으므로 isLiked를 false로 설정
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
