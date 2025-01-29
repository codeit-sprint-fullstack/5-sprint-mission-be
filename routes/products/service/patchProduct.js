import { PrismaClient } from "@prisma/client";
import asyncHandler from "../../../utils/asyncHandler.js";
import { idValidation, productValidation } from "../../../structs.js";
import { assert } from "superstruct";
import { createError } from "../../../utils/errorHandler.js";

const prisma = new PrismaClient();

// 상품 수정 API - 특정 상품 조회 후 수정
const patchProduct = async (req, res) => {
  assert(req.params.id, idValidation); // error: id 형식 오류(400)
  const id = req.params.id;

  const currentProduct = await prisma.product.findUnique({ where: id });
  // error: 상품 없음(404)
  if (!currentProduct) return createError("상품이 존재하지 않습니다.", 404);

  const { name, description, price, tags, images } = req.body;
  const updatedProduct = {
    ...currentProduct,
    ...(name !== undefined && { name }),
    ...(description !== undefined && { description }),
    ...(price !== undefined && { price }),
    ...(tags !== undefined && { tags }),
    ...(images !== undefined && { images }),
  };

  // error: 유효성 검사(400)
  assert(productValidation, updatedProduct);

  // update
  const result = await prisma.product.update({
    where: { id },
    data: updatedProduct,
  });

  res
    .status(201)
    .send({ message: "상품 정보가 수정되었습니다.", data: result });
};

export default asyncHandler(patchProduct);
