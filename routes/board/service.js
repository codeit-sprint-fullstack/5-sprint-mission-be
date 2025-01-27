import { PrismaClient } from "@prisma/client";
// todo: 메시지 객체로 정리

const prisma = new PrismaClient();

// 게시물 등록 API
const postNewArticle = async (req, res) => {
  try {
    const { title, content, images = "" } = req.body;

    // error1: 필수 입력 값(title, content) 누락(400)
    // todo...

    // error 2: 입력 값 유효성 검증(400)
    // todo...

    // create
    const result = await prisma.article.create({
      data: {
        title,
        content,
        images,
      },
    });
    res.status(201).send({ message: "게시글이 등록되었습니다.", data: result });
  } catch (error) {
    // error3: 서버 에러(500)
    console.log(error);
    res.status(500).send("서버 에러입니다.");
  }
};

// 게시물 상세 조회 API
const getArticleById = async (req, res) => {
  try {
    const id = req.params.id;
    // error1: id 형식 맞지 않음(400)
    // todo...

    // findUnique
    const result = await prisma.article.findUnique({
      where: { id },
    });

    // error2: 게시물 없음(404)
    // todo...

    res.status(200).send({ message: "게시물 조회 결과입니다.", data: result });
  } catch (error) {
    // error3: 서버 에러(500)
    console.log(error);
    res.status(500).send("서버 에러입니다.");
  }
};

// 게시물 수정 API - 특정 게시물 조회 후 수정
const patchArticle = async (req, res) => {
  try {
    const id = req.params.id;
    // error1: id 형식 오류(400)
    // todo...

    // findMany
    const currentArticle = await prisma.article.findUnique({ where: id });
    // error2: 게시물 없음(404)
    // todo...

    const { title, content, images } = req.body;
    // error3: 입력 값 유효성 검증(400)
    // todo...
    const updatedArticle = {
      ...currentArticle,
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(images !== undefined && { images }),
    };

    // update
    const result = await prisma.article.update({
      where: { id },
      data: updatedArticle,
    });

    res
      .status(201)
      .send({ message: "게시물 정보가 수정되었습니다.", data: result });
  } catch (error) {
    // error4: 서버 에러(500)
    console.log(error);
    res.status(500).send("서버 에러입니다.");
  }
};

// 게시물 삭제 API
const deleteArticle = async (req, res) => {
  try {
    const id = req.params.id;
    // error1: id 형식 맞지 않음(400)
    // todo...

    // delete
    const result = await prisma.article.delete({
      where: { id },
    });

    // error2: 게시물 없음(404)
    // todo...

    res
      .status(200) // 메시지 반환하려고 204 대신 200씀
      .send({ message: "게시물이 성공적으로 삭제되었습니다.", data: result });
  } catch (error) {
    // error3: 서버 에러(500)
    console.log(error);
    res.status(500).send("서버 에러입니다.");
  }
};

const getArticlesList = async (req, res) => {
  try {
    const { sort, offset, limit, keyword } = req.query;
    // error1: query 형식 맞지 않음(400)
    // todo ...

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
            { title: { contain: keyword, mode: "insensitive" } },
            { content: { contain: keyword, mode: "insensitive" } },
          ],
        }
      : {};

    // findMany
    const result = await prisma.article.findMany({
      where,
      orderBy,
      skip: parseInt(offset),
      take: parseInt(limit),
    });

    // error2: 목록 없음(404)
    // todo ...

    res.send({ message: "게시물 목록 조회 결과입니다.", data: result });
  } catch (error) {
    // error3: 서버 에러(500)
    console.log(error);
    res.status(500).send("서버 에러입니다.");
  }
};

const service = {
  postNewArticle,
  getArticleById,
  patchArticle,
  deleteArticle,
  getArticlesList,
};

export default service;
