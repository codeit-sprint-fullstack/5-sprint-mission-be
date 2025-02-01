import express from "express";
import prisma from "../config/prismaClient.js";

const router = express.Router();

// 자유게시판 댓글
router.post("/articles/:id", async (req, res) => {
  try {
    const { id: articleId } = req.params;
    const { content, userId } = req.body;
    const comment = await prisma.comment.create({
      data: { content, userId, articleId },
    });
    res.status(201).send(comment);
  } catch (error) {
    res.status(500).send(console.log("CAN NOT FOUND ERROR"));
  }
});

// 상품 댓글
router.post("/products/:id", async (req, res) => {
  try {
    const { id: productsId } = req.params;
    const { content, userId } = req.body;
    const comment = await prisma.comment.create({
      data: { content, userId, productsId },
    });
    res.status(201).send(comment);
  } catch (error) {
    res.status(500).send(console.log("CAN NOT FOUND ERROR"));
  }
});

// 댓글 수정
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
    });
    if (!updatedComment) return res.status(404).send("CAN NOT FOUND COMMENT");
    res.status(200).send(updatedComment);
  } catch (error) {
    res.status(500).send(console.log("CAN NOT FOUND ERROR"));
  }
});

//댓글 삭제
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await prisma.comment.delete({
      where: { id },
    });
    if (!comment) return res.status(404).send("CAN NOT FOUND COMMENT");
    res.status(204).send("COMMENT DELETED SUCCESS");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

// 자유게시판 댓글 목록 조회
router.get("/articles/:id", async (req, res) => {
  try {
    const { id: articleId } = req.params;
    const { cursor, take = 10 } = req.query;
    const comment = await prisma.comment.findMany({
      take: parseInt(take),
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: { articleId },
      orderBy: { createdAt: "desc" },
      select: { id: true, content: true, createdAt: true },
    });
    if (!comment) return res.status(404).send("CAN NOT FOUND COMMENT");
    res.status(201).send(comment);
  } catch (error) {
    res.status(500).send(console.log("CAN NOT FOUND ERROR"));
  }
});

// 상품 댓글 목록 조회
router.get("/products/:id", async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { cursor, take = 10 } = req.query;
    const comment = await prisma.comment.findMany({
      take: parseInt(take),
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: { productId },
      orderBy: { createdAt: "desc" },
      select: { id: true, content: true, createdAt: true },
    });
    if (!comment) return res.status(404).send("CAN NOT FOUND COMMENT");
    res.status(201).send(comment);
  } catch (error) {
    res.status(500).send(console.log("CAN NOT FOUND ERROR"));
  }
});

export default router;
