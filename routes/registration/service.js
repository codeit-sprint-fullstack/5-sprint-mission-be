import { PrismaClient } from "@prisma/client";
// todo: 메시지 객체로 정리

const prisma = new PrismaClient();

// 상품 등록 API
const postNewProduct = async (req, res) => {
  try {
    const { name, description, price, tags, images } = req.body;

    // error1: 필수 입력 값(name, description, price, tags) 누락(400)
    // todo...

    // error 2: 입력 값 유효성 검증(400)
    // todo...

    // create
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
  } catch (error) {
    // error3: 서버 에러(500)
    console.log(error);
    res.status(500).send("서버 에러입니다.");
  }
};

const service = {
  postNewProduct,
};

export default service;
