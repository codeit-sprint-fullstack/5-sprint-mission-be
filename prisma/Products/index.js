import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// 상품
export const getProducts = async (req, res) => {
  const { page = 1, pageSize = 10, search = "", sort = "recent" } = req.query;
  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);
  const orderBy = sort === "recent" ? { createdAt: "desc" } : undefined;
  // console.log(909);
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: String(search) } },
          { description: { contains: String(search) } },
        ],
      },
      orderBy,
      skip,
      take,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        createdAt: true,
        tags: true,
      },
    });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).json({ error: "상품 목록 조회 실패" });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ error: "상품을 찾을 수 없습니다" });
    }
  } catch (error) {
    res.status(500).send({ error: "상품 조회 실패" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, images, price, tags } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        images,
        price,
        tags,
      },
    });
    res.status(201).send(product);
  } catch (error) {
    res.status(500).json({ error: "상품 생성 실패ㅜㅜ" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.update({
      where: { id },
      data: req.body,
    });
    res.send({ product, message: "수정 성공~ " });
  } catch (error) {
    res.status(500).json({ error: "상품 수정 실패" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({
      where: { id },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "상품 삭제 실패" });
  }
};

//[중고마켓] 특정 상품에 대한 댓글 생성
export const createComment = async (req, res) => {
  const { productId } = req.params;
  const { content } = req.body;
  try {
    const newComment = await prisma.product_Comment.create({
      data: {
        content,
        productId: productId,
      },
    });
    res.status(201).send(newComment);
  } catch (error) {
    res.status(500).json({ error: "댓글 생성 실패" });
  }
};

// 특정글에 대한 댓글 목록 검색
export const getCommentsByProductId = async (req, res) => {
  const { productId } = req.params;
  console.log(`Requesting comments for productId: ${productId}`);
  const { cursor, take = 10 } = req.query;
  try {
    const comments = await prisma.product_Comment.findMany({
      where: {
        productId: productId,
        orderBy: { createdAt: "asc" },
        take: Number(take),
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: Number(cursor) } : undefined,
        select: { id: true, content: true, createdAt: true },
      },
    });
    if (!comments) {
      return res.status(404).json({ error: "댓글을 찾을 수 없음" });
    }
    res.send(comments);
  } catch (error) {
    res.status(500).json({ error: "댓글 검색 실패" });
  }
};

// 특정글에 대한 특정 댓글 조회
export const getCommentById = async (req, res) => {
  const { productId, commentId } = req.params;
  console.log(
    `Requesting comment productId: ${productId}, commentId: ${commentId}`
  );
  try {
    const comments = await prisma.product_Comment.findMany({
      where: {
        productId: productId,
      },
    });
    console.log(comments);
    const comment = comments.find((c) => c.id === commentId);
    console.log(`${commentId}`);
    if (!comment) {
      return res.status(404).json({ error: "댓글을 찾을 수 없음" });
    }

    res.send(comment);
  } catch (error) {
    res.status(500).json({ error: "댓글 조회 실패" });
  }
};

// 특정글에 대한 특정 댓글 수정
export const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  try {
    const comment = await prisma.product_Comment.findUnique({
      where: {
        id: commentId,
      },
    });
    console.log(comment);

    const updatedComment = await prisma.product_Comment.update({
      where: {
        id: commentId,
      },
      data: { content },
    });
    res.status(200).send(updatedComment);
  } catch (error) {
    res.status(500).json({ error: "댓글 수정 실패" });
  }
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const comment = await prisma.product_Comment.findUnique({
      where: {
        id: commentId,
      },
    });
    console.log(comment);
    await prisma.product_Comment.delete({
      where: {
        id: commentId,
      },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "댓글 삭제 실패" });
  }
};

export const productFunctions = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

export const commentFunctions = {
  createComment,
  getCommentsByProductId,
  getCommentById,
  updateComment,
  deleteComment,
};
