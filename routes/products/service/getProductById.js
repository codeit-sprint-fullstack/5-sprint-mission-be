import { PrismaClient } from "@prisma/client";
import asyncHandler from "../../../utils/asyncHandler.js";
import * as s from "superstruct";
import { assert } from "superstruct";
import { idValidation } from "../../../structs.js";
import { createError } from "../../../utils/errorHandler.js";

const prisma = new PrismaClient();

// 상품 상세 조회 API - 상품 클릭하면 해당 상품 상세 조회
const getProductById = asyncHandler(async (req, res) => {
  assert(s.is(req.params.id, idValidation), "Invalid ID format"); // error: id 형식 오류(400)
  const id = req.params.id;

  // findUnique
  const result = await prisma.product.findUnique({
    where: { id },
  });

  // error: 상품 없음(404)
  if (!result) return createError("상품이 존재하지 않습니다.", 404);

  res.status(200).send({ message: "상품 조회 결과입니다.", data: result });
});

export default getProductById;
