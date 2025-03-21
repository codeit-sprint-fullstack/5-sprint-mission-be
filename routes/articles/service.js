import prisma from "../../prismaClient.js";

// TODO: product 동작 확인 후에 게시글 생성/수정/삭제 시에도 인증된 유저만 가능하도록 수정 + 좋아요 추가
// 전체 게시글 목록 조회
const getArticleList = async (req, res, next) => {
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

    //title, content 키워드 검색 조건
    const searchCriteria = {
      AND: [
        {
          OR: [
            { title: { contains: keyword, mode: "insensitive" } },
            { content: { contains: keyword, mode: "insensitive" } }, //insensitive: 대소문자 구문x 검색
          ],
        },
        { deletedAt: null }, //삭제 기록이 없는 데이터만 가져오기
      ],
    };

    //articles collection에서 키워드 검색 - 정렬 - skip값 만큼 항목을 건너뛰어 limit개수 만큼 데이터 불러오기(deletedAt 컬럼 제외)
    const articles = await prisma.article.findMany({
      where: searchCriteria,
      orderBy: sortOption,
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        favoritesCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    //총 게시글 수, 페이지 수 계산
    //검색 키워드에 맞는 전체 데이터 개수 불러오기
    const totalArticles = await prisma.article.count({
      where: searchCriteria,
    });
    const totalPages = Math.ceil(totalArticles / limit);

    //요청 성공 시 응답 객체
    const response = {
      status: 200,
      ArticleList: articles, //필터링된 게시글 목록
      totalArticles,
      totalPages,
      page,
      limit,
      sort,
      keyword,
    };

    res.status(200).send(response);
  } catch (e) {
    next(e);
  }
};

// 게시글 상세 조회
const getArticle = async (req, res, next) => {
  try {
    const id = req.params.id;

    //id 일치하는 게시글 찾기
    const article = await prisma.article.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!article) {
      return res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
    }

    res.status(200).send(article);
  } catch (e) {
    next(e);
  }
};

// 게시글 등록
const createArticle = async (req, res, next) => {
  try {
    const { title, content, image } = req.body;

    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        image,
      },
    });

    res.status(201).send(newArticle);
  } catch (e) {
    next(e);
  }
};

// id로 선택한 게시글 수정
const patchArticle = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { title, content, image } = req.body;

    // 게시글 존재 여부 확인
    const existingArticle = await prisma.article.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingArticle) {
      return res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
    }

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        image,
      },
    });

    res.status(200).send(updatedArticle); //수정된 게시글
  } catch (e) {
    next(e);
  }
};

// 게시글 삭제
const deleteArticle = async (req, res, next) => {
  try {
    const id = req.params.id;

    // 게시글 존재 여부 확인
    const existingArticle = await prisma.article.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingArticle) {
      return res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
    }

    //deletedAt 업데이트
    const deletedArticle = await prisma.article.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
      select: {
        id: true,
        title: true,
        deletedAt: true,
      },
    });

    res.status(202).send({
      message: "삭제 처리가 완료되었습니다.",
      data: deletedArticle,
    });
  } catch (e) {
    next(e);
  }
};

// 게시글 좋아요 추가
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
      // 게시글 존재 여부 확인
      const article = await tx.article.findUnique({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!article) {
        const error = new Error("게시글을 찾을 수 없습니다.");
        error.name = "NotFoundError";
        throw error;
      }

      // 이미 좋아요 했는지 확인
      const existingLike = await tx.likeArticle.findFirst({
        where: {
          userId,
          articleId: id,
          deletedAt: null,
        },
      });

      if (existingLike) {
        const error = new Error("이미 좋아요한 게시글입니다.");
        error.name = "ValidationError";
        throw error;
      }

      // 좋아요 생성
      const like = await tx.likeArticle.create({
        data: {
          userId,
          articleId: id,
        },
      });

      // 게시글의 좋아요 수 증가
      const updatedArticle = await tx.article.update({
        where: { id },
        data: {
          favoritesCount: { increment: 1 },
        },
      });

      return {
        like,
        article: updatedArticle,
      };
    });

    res.status(201).send({
      isSuccess: true,
      data: result.article,
    });
  } catch (e) {
    next(e);
  }
};

// 게시글 좋아요 삭제
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
      // 게시글 존재 여부 확인
      const article = await tx.article.findUnique({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!article) {
        const error = new Error("게시글을 찾을 수 없습니다.");
        error.name = "NotFoundError";
        throw error;
      }

      // 좋아요 존재 여부 확인
      const existingLike = await tx.likeArticle.findFirst({
        where: {
          userId,
          articleId: id,
          deletedAt: null,
        },
      });

      if (!existingLike) {
        const error = new Error("좋아요 정보를 찾을 수 없습니다.");
        error.name = "NotFoundError";
        throw error;
      }

      // 좋아요 소프트 삭제 (deletedAt 설정)
      const deletedLike = await tx.likeArticle.update({
        where: { id: existingLike.id },
        data: {
          deletedAt: new Date(),
        },
      });

      // 게시글의 좋아요 수 감소
      const updatedArticle = await tx.article.update({
        where: { id },
        data: {
          favoritesCount: { decrement: 1 },
        },
      });

      return {
        deletedLike,
        article: updatedArticle,
      };
    });

    res.status(200).send({
      message: "좋아요가 취소되었습니다.",
      data: result.article,
    });
  } catch (e) {
    next(e);
  }
};

const service = {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle,
  createLike,
  deleteLike,
};

export default service;
