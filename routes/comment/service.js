import { PrismaClient } from "@prisma/client";
import Err from "./err.js";
import { assert } from "superstruct";
import { validation } from "./structs.js";

const prisma = new PrismaClient();

const uploadComment = async (req, res) => {
  assert(req.body, validation); // 유효성 검사
  console.log("댓글 등록");
  try {
    const data = await prisma.comment.create({
      data: req.body,
    });
    res.json(data); // 헤더를 자동으로 Content-Type: application/json 설정해줌
  } catch (err) {
    Err(err, res);
  }
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  console.log("댓글 삭제");
  try {
    const data = await prisma.comment.delete({
      where: { id },
    });
    res.sendStatus(204);
  } catch (err) {
    Err(err, res);
  }
};

const service = {
  uploadComment,
  deleteComment,
};

export default service;
