import prisma from "../../prisma";
import { RequestHandler } from "express";
import requestHandler from "../../../utils/requestHandler";

// 댓글 작성
export const createArticleComment: RequestHandler = requestHandler(
  async (req, res) => {
    const articleId = req.params.id;
    const { content } = req.body;

    const comment = await prisma.articleComment.create({
      data: {
        content,
        articleId,
      },
    });

    res.send(comment);
  }
);

// 댓글 수정
export const updateArticleComment: RequestHandler = requestHandler(
  async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    console.log("id: ", id, "content: ", content);

    const updatedComment = await prisma.articleComment.update({
      where: { id },
      data: { content },
    });

    res.send(updatedComment);
  }
);

// 댓글 삭제
export const deleteArticleComment: RequestHandler = requestHandler(
  async (req, res) => {
    const { id } = req.params;

    await prisma.articleComment.delete({
      where: { id },
    });

    res.send({ message: "댓글이 삭제되었습니다." });
  }
);
