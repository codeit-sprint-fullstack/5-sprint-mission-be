import { PrismaClient } from "@prisma/client";
import { createError } from "../../../utils/errorHandler.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import { assert } from "superstruct";
import { idValidation } from "../../../structs.js";

const prisma = new PrismaClient();

// 상품 삭제 API
const deleteProduct = asyncHandler(async (req, res) => {
  assert(req.params.id, idValidation); // error: id 형식 오류(400)
  const id = req.params.id;

  // delete
  const result = await prisma.product.delete({
    where: { id },
  });

  // error: 상품 없음(404)
  if (!result) return createError("상품이 존재하지 않습니다.", 404);

  res
    .status(200) // 메시지 반환하려고 204 대신 200씀
    .send({ message: "상품이 성공적으로 삭제되었습니다.", data: result });
});

export default deleteProduct;
