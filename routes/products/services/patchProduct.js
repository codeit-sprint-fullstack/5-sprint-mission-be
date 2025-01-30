import { PrismaClient } from "@prisma/client";
import asyncHandler from "../../../middlewares/asyncHandler.js";
import { updateProductValidation } from "../../../validation/productValidation.js";
import { productIdParamValidation } from "../../../validation/paramValidation.js";
import { assert } from "superstruct";
import { createError } from "../../../middlewares/errorHandler.js";

const prisma = new PrismaClient();

// 상품 수정 API - 특정 상품 조회 후 수정
const patchProduct = asyncHandler(async (req, res) => {
  console.log("patchProduct API 요청을 시작합니다.");

  // error: id 형식 오류(400)
  assert(req.params.id, productIdParamValidation);
  const id = req.params.id;

  const currentProduct = await prisma.product.findUnique({ where: { id } });
  // error: 상품 없음(404)
  if (!currentProduct) throw createError("상품이 존재하지 않습니다.", 404);

  // error: 유효성 검사(400)
  assert(req.body, updateProductValidation);

  // update
  const result = await prisma.product.update({
    where: { id },
    data: req.body,
  });

  res
    .status(201)
    .send({ message: "상품 정보가 수정되었습니다.", data: result });
});

export default patchProduct;
