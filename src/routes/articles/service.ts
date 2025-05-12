import { Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../../prismaClient";
import {
  ArticleBaseRequest,
  ArticleCreateRequest,
  ArticleListRequest,
  ArticleResponse,
  CustomError,
} from "../../types/article";

// 전체 게시글 목록 조회
const getArticleList = async (
  req: ArticleListRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    //페이지네이션
    const page = Number(req.query.page) || 1; //(기본값: 1)
    const limit = Number(req.query.limit) || 100; //(기본값: 100);
    const skip = (page - 1) * limit; //페이지네이션을 위한 skip값 계산

    const sort = req.query.sort || "recent";
    const sortOption: Prisma.Enumerable<Prisma.ArticleOrderByWithRelationInput> =
      sort === "favorite"
        ? [
            { likeCount: Prisma.SortOrder.desc },
            { createdAt: Prisma.SortOrder.desc },
          ]
        : {
            createdAt:
              sort === "recent" ? Prisma.SortOrder.desc : Prisma.SortOrder.asc,
          };

    const keyword = req.query.keyword || "";

    const searchCriteria: Prisma.ArticleWhereInput = {
      AND: [
        {
          OR: [
            {
              title: { contains: keyword, mode: Prisma.QueryMode.insensitive },
            },
            {
              content: {
                contains: keyword,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        },
        { deletedAt: null },
      ],
    };

    const userId = req.user?.id;

    let likedArticleIds: string[] = [];
    if (userId) {
      // 삭제되지 않은 좋아요 정보만 조회
      const userLikes = await prisma.likeArticle.findMany({
        where: {
          userId: userId,
          deletedAt: null,
        },
        select: {
          articleId: true,
        },
      });

      likedArticleIds = userLikes.map((item) => item.articleId);
    }

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
        likeCount: true,
        createdAt: true,
        updatedAt: true,
        User: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    const formattedArticles: ArticleResponse[] = articles.map(
      (article: any) => {
        const isLiked = userId ? likedArticleIds.includes(article.id) : false;

        return {
          id: article.id,
          title: article.title,
          content: article.content,
          image: article.image,
          likeCount: article.likeCount,
          isLiked: isLiked,
          ownerId: article.User.id,
          ownerNickname: article.User.nickname,
          createdAt: article.createdAt.toISOString(),
          updatedAt: article.updatedAt.toISOString(),
        };
      }
    );

    const totalArticles = await prisma.article.count({
      where: searchCriteria,
    });
    const totalPages = Math.ceil(totalArticles / limit);

    res.status(200).send({
      ArticleList: formattedArticles,
      totalArticles,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

// 게시글 상세 조회
const getArticle = async (
  req: ArticleBaseRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;
    const userId = req.user?.id;

    const article = await prisma.article.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        User: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    if (!article) {
      res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
      return;
    }

    // 로그인한 사용자인 경우 좋아요 여부 확인
    let isLiked = false;
    if (userId) {
      // 삭제되지 않은 좋아요 정보만 조회
      const likeExists = await prisma.likeArticle.findFirst({
        where: {
          userId: userId,
          articleId: id,
          deletedAt: null,
        },
      });

      isLiked = !!likeExists;
    }

    // 사용자가 로그인한 경우 좋아요 정보 추가 + 소유자 정보 추가
    const articleWithLike = {
      ...article,
      isLiked: isLiked,
      ownerId: article.User.id,
      ownerNickname: article.User.nickname,
      User: undefined,
    };

    res.status(200).send(articleWithLike);
  } catch (error) {
    next(error);
  }
};

// 게시글 등록
const createArticle = async (
  req: ArticleCreateRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      const error: CustomError = new Error("인증이 필요합니다.");
      error.name = "UnauthorizedError";
      throw error;
    }

    const { title, content } = req.body;
    const { id: userId } = req.user;

    // 이미지 경로 처리
    const image =
      req.body.images && req.body.images.length > 0 ? req.body.images[0] : null;

    const newArticle = await prisma.article.create({
      data: {
        userId,
        title,
        content,
        image,
      },
      include: {
        User: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    // 응답에 소유자 정보 추가
    const responseArticle = {
      ...newArticle,
      ownerId: newArticle.User.id,
      ownerNickname: newArticle.User.nickname,
      User: undefined,
    };

    res.status(201).send(responseArticle);
  } catch (error) {
    next(error);
  }
};

// id로 선택한 게시글 수정
const patchArticle = async (
  req: ArticleCreateRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 인증 확인 - req.user 객체가 없는 경우 에러 발생
    if (!req.user || !req.user.id) {
      const error: CustomError = new Error("인증이 필요합니다.");
      error.name = "UnauthorizedError";
      throw error;
    }

    const id = req.params.id;
    const { title, content } = req.body;
    const { id: userId } = req.user;

    // 이미지 경로 처리
    const image =
      req.body.images && req.body.images.length > 0
        ? req.body.images[0] // 첫 번째 이미지 경로만 사용
        : null;

    // 게시글 존재 여부 확인
    const existingArticle = await prisma.article.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingArticle) {
      res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
      return;
    }

    // 게시글 소유자 확인
    if (existingArticle.userId !== userId) {
      const error: CustomError = new Error("게시글을 수정할 권한이 없습니다.");
      error.name = "ForbiddenError";
      throw error;
    }

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        image, // 이미지 경로 업데이트
      },
      include: {
        User: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    // 응답에 소유자 정보 추가
    const responseArticle = {
      ...updatedArticle,
      ownerId: updatedArticle.User.id,
      ownerNickname: updatedArticle.User.nickname,
      User: undefined, // 원본 User 객체 제거
    };

    res.status(200).send(responseArticle); //수정된 게시글
  } catch (error) {
    next(error);
  }
};

// 게시글 삭제
const deleteArticle = async (
  req: ArticleBaseRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 인증 확인 - req.user 객체가 없는 경우 에러 발생
    if (!req.user || !req.user.id) {
      const error: CustomError = new Error("인증이 필요합니다.");
      error.name = "UnauthorizedError";
      throw error;
    }

    const id = req.params.id;
    const { id: userId } = req.user; // 로그인한 사용자 ID 가져오기

    // 게시글 존재 여부 확인
    const existingArticle = await prisma.article.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingArticle) {
      res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
      return;
    }

    // 게시글 소유자 확인
    if (existingArticle.userId !== userId) {
      const error: CustomError = new Error("게시글을 삭제할 권한이 없습니다.");
      error.name = "ForbiddenError";
      throw error;
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

    if (!deletedArticle) {
      const error: CustomError = new Error("게시글을 삭제할 수 없습니다.");
      error.name = "NotFoundError";
      throw error;
    }

    res.status(202).send({
      isSuccess: true,
      message: "삭제 처리가 완료되었습니다.",
    });
  } catch (error) {
    next(error);
  }
};

// 게시글 좋아요 추가
const createLike = async (
  req: ArticleBaseRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 인증 확인 - req.user 객체가 없는 경우 에러 발생
    if (!req.user || !req.user.id) {
      const error: CustomError = new Error("인증이 필요합니다.");
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
        const error: CustomError = new Error("게시글을 찾을 수 없습니다.");
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
        const error: CustomError = new Error("이미 좋아요한 게시글입니다.");
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
          likeCount: { increment: 1 },
        },
        include: {
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
        article: {
          ...updatedArticle,
          isLiked: true, // 좋아요를 생성했으므로 isLiked를 true로 설정
          ownerId: updatedArticle.User.id,
          ownerNickname: updatedArticle.User.nickname,
          User: undefined,
        },
      };
    });

    res.status(201).send({
      isSuccess: true,
      data: result.article,
    });
  } catch (error) {
    next(error);
  }
};

// 게시글 좋아요 삭제
const deleteLike = async (
  req: ArticleBaseRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 인증 확인 - req.user 객체가 없는 경우 에러 발생
    if (!req.user || !req.user.id) {
      const error: CustomError = new Error("인증이 필요합니다.");
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
        const error: CustomError = new Error("게시글을 찾을 수 없습니다.");
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
        const error: CustomError = new Error("좋아요 정보를 찾을 수 없습니다.");
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
          likeCount: { decrement: 1 },
        },
        include: {
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
        article: {
          ...updatedArticle,
          isLiked: false, // 좋아요를 취소했으므로 isLiked를 false로 설정
          ownerId: updatedArticle.User.id,
          ownerNickname: updatedArticle.User.nickname,
          User: undefined,
        },
      };
    });

    res.status(200).send({
      message: "좋아요가 취소되었습니다.",
      data: result.article,
    });
  } catch (error) {
    next(error);
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
