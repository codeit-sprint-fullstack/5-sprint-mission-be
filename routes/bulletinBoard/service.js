import { PrismaClient } from "@prisma/client";
import Err from "./err.js";
import { assert } from "superstruct";
import { validation } from "./structs.js";

const prisma = new PrismaClient();

const uploadBulletinBoard = async (req, res) => {
  assert(req.body, validation); // 유효성 검사
  console.log("게시글 등록");
  try {
    const { id } = req.query;
    const data = await prisma.bulletinBoard.create({
      data: {
        ...req.body,
        userId: id,
      },
    });
    res.json(data);
  } catch (err) {
    Err(err, res);
  }
};

const deleteBulletinBoard = async (req, res) => {
  const { id } = req.params;
  console.log("게시글 삭제");
  try {
    const data = await prisma.bulletinBoard.delete({
      where: { id },
    });
    res.sendStatus(204);
  } catch (err) {
    Err(err, res);
  }
};

const service = {
  uploadBulletinBoard,
  deleteBulletinBoard,
};

export default service;
