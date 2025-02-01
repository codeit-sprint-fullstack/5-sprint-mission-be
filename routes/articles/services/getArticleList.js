import { PrismaClient } from "@prisma/client";
import asyncHandler from "../../../middlewares/asyncHandler.js";
import { assert } from "superstruct";
import { articleListQueryValidation } from "../../../validation/queryValidation.js";

const prisma = new PrismaClient();

// 게시글 목록 조회 API

const getArticleList = asyncHandler(async (req, res) => {
  const parsedQuery = {
    ...req.query,
    offset: req.query.offset ? Number(req.query.offset) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
  };

  // error: query 형식 맞지 않음(400)
  assert(parsedQuery, articleListQueryValidation);
  const { sort = "recent", offset = 0, limit = 10, keyword = "" } = parsedQuery;

  // 정렬 조건
  let orderBy;
  switch (sort) {
    case "recent":
      orderBy = { createdAt: "desc" };
      break;
    case "favorite":
      orderBy = { favorite: "desc" };
      break;
  }

  // 검색 조건
  const where = keyword
    ? {
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { content: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  // findMany
  const result = await prisma.article.findMany({
    where,
    orderBy,
    skip: offset,
    take: limit,
  });

  res.send({
    message: "게시글 목록 조회 결과입니다.",
    data: result,
    count: result.length,
  });
});

export default getArticleList;
