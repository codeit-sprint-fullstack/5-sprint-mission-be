import { PrismaClient } from "@prisma/client";
// todo: 메시지 객체로 정리

const prisma = new PrismaClient();

// 상품 상세 조회 API - 상품 클릭하면 해당 상품 상세 조회
const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    // error1: id 형식 맞지 않음(400)
    // todo...

    // findUnique
    const result = await prisma.product.findUnique({
      where: { id },
    });

    // error2: 상품 없음(404)
    // todo...

    res.status(200).send({ message: "상품 조회 결과입니다.", data: result });
  } catch (error) {
    // error3: 서버 에러(500)
    console.log(error);
    res.status(500).send("서버 에러입니다.");
  }
};

// 상품 수정 API - 특정 상품 조회 후 수정
const patchProduct = async (req, res) => {
  try {
    const id = req.params.id;
    // error1: id 형식 오류(400)
    // todo...

    // findMany
    const currentProduct = await prisma.product.findUnique({ where: id });
    // error2: 상품 없음(404)
    // todo...

    const { name, description, price, tags, images } = req.body;
    // error3: 입력 값 유효성 검증(400)
    // todo...
    const updatedProduct = {
      ...currentProduct,
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(tags !== undefined && { tags }),
      ...(images !== undefined && { images }),
    };

    // update
    const result = await prisma.product.update({
      where: { id },
      data: updatedProduct,
    });

    res
      .status(201)
      .send({ message: "상품 정보가 수정되었습니다.", data: result });
  } catch (error) {
    // error4: 서버 에러(500)
    console.log(error);
    res.status(500).send("서버 에러입니다.");
  }
};

// 상품 삭제 API
const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    // error1: id 형식 맞지 않음(400)
    // todo...

    // delete
    const result = await prisma.product.delete({
      where: { id },
    });

    // error2: 상품 없음(404)
    // todo...

    res
      .status(200) // 메시지 반환하려고 204 대신 200씀
      .send({ message: "상품이 성공적으로 삭제되었습니다.", data: result });
  } catch (error) {
    // error3: 서버 에러(500)
    console.log(error);
    res.status(500).send("서버 에러입니다.");
  }
};

const getProductsList = async (req, res) => {
  try {
    const { sort, offset, limit, keyword } = req.query;
    // error1: query 형식 맞지 않음(400)
    // todo ...

    // 정렬 조건
    let orderBy;
    switch (sort) {
      case "recent":
        orderBy = { createdAt: "desc" };
        break;
      case "favorite":
        orderBy = { favorite: "desc" };
        break;
    }

    // 검색 조건
    const where = keyword
      ? {
          OR: [
            { name: { contain: keyword, mode: "insensitive" } },
            { description: { contain: keyword, mode: "insensitive" } },
          ],
        }
      : {};

    // findMany
    const result = await prisma.product.findMany({
      where,
      orderBy,
      skip: parseInt(offset),
      take: parseInt(limit),
    });

    // error2: 목록 없음(404)
    // todo ...

    res.send({ message: "상품 목록 조회 결과입니다.", data: result });
  } catch (error) {
    // error3: 서버 에러(500)
    console.log(error);
    res.status(500).send("서버 에러입니다.");
  }
};

const service = {
  getProductById,
  patchProduct,
  deleteProduct,
  getProductsList,
};

export default service;
