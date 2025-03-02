import prisma from "../../prisma";
import { RequestHandler } from "express";
import requestHandler from "../../../utils/requestHandler";

// 인기 게시글 TOP 3 조회 : 메인 페이지에 적용
export const getArticleTop3: RequestHandler = requestHandler(
  async (req, res) => {
    const top3Articles = await prisma.article.findMany({
      take: 3,
      orderBy: [
        { likes: "desc" }, // 인기순 (좋아요 내림차순)
        { updatedAt: "desc" }, // 최신순 (업데이트 시간 내림차순)
      ],
      cacheStrategy: { ttl: 60, swr: 30 },
    });

    if (!top3Articles) {
      res.status(204).send([]);
      return;
    }

    res.status(200).send(top3Articles);
  }
);

// 게시글 목록 조회 : 메인 페이지에 적용
export const getArticleList: RequestHandler = requestHandler(
  async (req, res) => {
    const limit = Number(req.query.limit) || 8;
    const { keyword, sortBy, cursorId } = req.query;

    // 검색 조건 설정
    let where: any = {}; // 초기 empty 객체로 정의
    if (keyword && keyword !== "") {
      // 검색어가 있고, 빈 값이 아닐 경우 검색
      where = {
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { content: { contains: keyword, mode: "insensitive" } },
        ],
      };
    }

    // 정렬 기준 설정
    let orderBy = {};
    switch (sortBy) {
      case "favorite":
        orderBy = { likes: "desc" }; // 좋아요순
        break;
      case "latest":
        orderBy = { createdAt: "desc" }; // 최신순
        break;
      default:
        orderBy = { createdAt: "asc" }; // 오래된 순
    }

    const articleList = await prisma.article.findMany({
      take: limit,
      cursor: cursorId ? { id: String(cursorId) } : undefined, // cursor는 반드시 유니크한 id 필드를 사용
      skip: cursorId ? 1 : 0, // cursorId가 있을 경우 1건 건너뛰고 조회
      where,
      orderBy,
      cacheStrategy: { ttl: 60, swr: 30 },
    });

    if (!articleList) {
      res.status(404).send({ message: "게시글이 존재하지 않습니다." });
      return;
    }

    const hasNextPage = articleList.length === limit;
    const lastIndex = articleList.length - 1;
    const nextCursor = hasNextPage ? articleList[lastIndex].id : undefined;

    res.status(200).send({
      articleList,
      hasNextPage,
      nextCursor,
    });
  }
);

// 특정 게시글 조회 (댓글까지 조회) : 게시글 상세 페이지에 적용
export const getArticle: RequestHandler = requestHandler(async (req, res) => {
  const { id } = req.params;

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      comments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!article) {
    res.status(404).send({ message: "게시글이 존재하지 않습니다." });
    return;
  }

  res.status(200).send(article);
});

// 게시글 작성
export const createArticle: RequestHandler = requestHandler(
  async (req, res) => {
    const newArticle = await prisma.article.create({
      data: req.body,
    });

    if (!newArticle) {
      res.status(400).send({ message: "게시글 작성에 실패했습니다." });
      return;
    }

    res.status(201).send(newArticle);
  }
);

// 게시글 수정
export const updateArticle: RequestHandler = requestHandler(
  async (req, res) => {
    const { id } = req.params;

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: req.body,
    });

    if (!updatedArticle) {
      res.status(400).send({ message: "게시글 수정에 실패했습니다." });
      return;
    }

    res.status(203).send(updatedArticle);
  }
);

// 게시글 삭제
export const deleteArticle: RequestHandler = requestHandler(
  async (req, res) => {
    const { id } = req.params;

    await prisma.article.delete({
      where: { id },
    });

    res.status(204).send({ message: "게시글이 삭제되었습니다." });
  }
);
