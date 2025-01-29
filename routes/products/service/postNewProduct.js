import { PrismaClient } from "@prisma/client";
import asyncHandler from "../../../utils/asyncHandler.js";
import { assert } from "superstruct";
import { productValidation } from "../../../structs.js";

const prisma = new PrismaClient();

// 상품 등록 API
const postNewProduct = async (req, res) => {
  // error: 입력 값 유효성 검증(400)
  assert(req.body, productValidation);

  // create
  const { name, description, price, tags, images } = req.body;
  const result = await prisma.product.create({
    data: {
      name,
      description,
      price,
      tags,
      images,
    },
  });
  res.status(201).send({ message: "상품이 등록되었습니다.", data: result });
};

export default asyncHandler(postNewProduct);
