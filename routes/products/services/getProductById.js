import { PrismaClient } from "@prisma/client";
import asyncHandler from "../../../middlewares/asyncHandler.js";
import { assert } from "superstruct";
import { productIdParamValidation } from "../../../validation/paramValidation.js";
import { createError } from "../../../middlewares/errorHandler.js";

const prisma = new PrismaClient();

// 상품 상세 조회 API - 상품 클릭하면 해당 상품 상세 조회
const getProductById = asyncHandler(async (req, res) => {
  // error: id 형식 오류(400)
  assert(req.params.id, productIdParamValidation);
  const id = req.params.id;

  // findUnique
  const result = await prisma.product.findUnique({
    where: { id },
  });

  // error: 상품 없음(404)
  if (!result) throw createError("상품이 존재하지 않습니다.", 404);

  res.status(200).send({ message: "상품 조회 결과입니다.", data: result });
});

export default getProductById;
