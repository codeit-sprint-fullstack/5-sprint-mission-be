import { PrismaClient } from "@prisma/client";
import Err from "./err.js";

const prisma = new PrismaClient();

const getProduct = async (req, res) => {
  console.log("product get 호출");
  try {
    // const limit = parseInt(req.query.limit) || 10; // 기본값을 10으로 설정
    const data = await prisma.product.findMany();
    res.json({ data });
  } catch (err) {
    Err(err, req, res);
  }
};

const service = {
  getProduct,
};

export default service;
