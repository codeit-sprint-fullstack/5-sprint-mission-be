import express from "express";
import prisma from "../config/prismaClient.js";

const router = express.Router();

// 자유게시판 조회
router.get("/", async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search = "" } = req.query;

    const articles = await prisma.article.findMany({
      skip: Number((page - 1) * pageSize),
      take: +pageSize,
      orderBy: { createdAt: "desc" },
      where: {
        OR: [
          //insensitive: 대소문자 구분 X
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, content: true, createdAt: true },
    });
    res.status(200).send(articles);
  } catch (err) {
    res.status(500).send(console.log("CAN NOT FOUND ERROR"));
  }
});

//자유게시판 등록
router.post("/", async (req, res) => {
  try {
    const { title, content, image } = req.body;
    const articles = await prisma.article.create({
      data: { title, content, image },
    });

    res.status(201).send(articles);
  } catch (err) {
    res.status(500).send(console.log("CAN NOT FOUND ERROR"));
  }
});

//자유게시판 상세 조회
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const articles = await prisma.article.findUnique({
      where: {
        id,
      },
      select: { id: true, title: true, content: true, createAt: true },
    });
    if (!articles) return res.status(404).send("CAN NOT FOUND ARTICLES");
    res.status(200).send(articles);
  } catch (err) {
    res.status(500).send("CAN NOT FOUND ERROR");
  }
});

//자유게시판 수정
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image } = req.body;
    const articles = await prisma.article.update({
      where: {
        id,
      },
      data: {
        title,
        content,
        image,
      },
    });
    if (!articles) return res.status(404).send("CAN NOT FOUND ARTICLES");
    res.status(200).send(articles);
  } catch (err) {
    res.status(500).send("CAN NOT FOUND ERROR");
  }
});

//자유게시판 삭제
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const articles = await prisma.article.delete({
      where: {
        id,
      },
    });
    if (!articles) return res.status(404).send("CAN NOT FOUND ARTICLES");
    res.status(204).send("ARTICLES DELETED SUCCESS");
  } catch (err) {
    res.status(500).send("CAN NOT FOUND ERROR");
  }
});

export default router;
