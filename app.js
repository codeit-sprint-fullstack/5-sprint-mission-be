import * as dotenv from "dotenv";
dotenv.config();
import express from "express";

import articlesRouter from "./routes/article_router.js";
import productsRouter from "./routes/product_router.js";

const app = express();
app.use(express.json());

app.use("/articles", articlesRouter);
app.use("/products", productsRouter);

app.get("/", (req, res) => {
  res.send("서버가 정상적으로 동작중입니다!");
});

app.listen(process.env.PORT || 5005, () =>
  console.log("Server Started", process.env.PORT)
);

//article, product router 분리 전에 짠 코드---------------
// articlesRouter.get("/", async (req, res) => {
//   const { page = 1, pageSize = 10, search = "", sort = "recent" } = req.query;
//   const skip = (Number(page) - 1) * Number(pageSize);
//   const take = Number(pageSize);
//   const orderBy = sort === "recent" ? { createdAt: "desc" } : undefined;

//   try {
//     const articles = await prisma.article.findMany({
//       where: {
//         OR: [
//           { title: { contains: String(search) } },
//           { content: { contains: String(search) } },
//         ],
//       },
//       orderBy,
//       skip,
//       take,
//       select: { id: true, title: true, content: true, createdAt: true },
//     });
//     res.status(200).send(articles);
//   } catch (error) {
//     res.status(500).json({ error: "게시글 목록 조회 실패" });
//   }
// });

// articlesRouter.get("/:id", async (req, res) => {
//   const { id } = req.params;
//   const article = await prisma.article.findUnique({
//     where: { id },
//   });
//   res.send(article);
// });

// articlesRouter.post("/", async (req, res) => {
//   const article = await prisma.article.create({
//     data: req.body,
//   });
//   res.status(201).send(article);
// });

// articlesRouter.patch("/:id", async (req, res) => {
//   const { id } = req.params;
//   const article = await prisma.article.update({
//     where: { id },
//     data: req.body,
//   });
//   res.send(article);
// });

// articlesRouter.delete("/:id", async (req, res) => {
//   const { id } = req.params;
//   const article = await prisma.article.delete({
//     where: { id },
//   });
//   res.sendStatus(204);
// });

// //[게시판]특정 articleId에 달린 모든 댓글 검색 (커서 기반 페이지네이션)
// articlesRouter.get("/:id/comments", async (req, res) => {
//   const { id: articleId } = req.params;
//   const { cursor, take = 10 } = req.query;

//   try {
//     const comments = await prisma.article_Comment.findMany({
//       where: { articleId },
//       orderBy: { createdAt: "asc" },
//       take: Number(take),
//       skip: cursor ? 1 : 0,
//       cursor: cursor ? { id: Number(cursor) } : undefined,
//       select: { id: true, content: true, createdAt: true },
//     });

//     res.status(200).json(comments);
//   } catch (error) {
//     res.status(500).json({ error: "게시글 댓글 목록 조회 실패 " });
//   }
// });

// //게시판글 특정 게시글의 특정 댓글 검색
// articlesRouter.get("/:articleId/comments/:commentId", async (req, res) => {
//   const { commentId } = req.params;
//   try {
//     const comment = await prisma.article_Comment.findUnique({
//       where: { commentId },
//     });
//     if (!comment) {
//       return res.status(404).json({ error: "댓글을 찾을 수 없음" });
//     }

//     res.status(200).send(comment);
//   } catch (error) {
//     res.status(500).json({ error: "댓글 검색 실패" });
//   }
// });

// //특정 게시글에 댓글 생성
// articlesRouter.post("/:articleId/comments", async (req, res) => {
//   const { articleId } = req.params;
//   const { content } = req.body;
//   try {
//     const newComment = await prisma.article_Comment.create({
//       data: {
//         content,
//         articleId,
//       },
//     });
//     res.status(201).send(newComment);
//   } catch (error) {
//     res.status(500).json({ error: "댓글 생성 실패" });
//   }
// });

// //특정 댓글 수정
// articlesRouter.patch("/:articleId/comments/:commentId", async (req, res) => {
//   const { commentId } = req.params;
//   const { content } = req.body;
//   try {
//     const updatedComment = await prisma.article_Comment.update({
//       where: { id: commentId },
//       data: { content },
//     });
//     res.status(200).send(updatedComment);
//   } catch (error) {
//     res.status(500).json({ error: "댓글 수정 실패" });
//   }
// });

// articlesRouter.delete("/:articleId/comments/:commentId", async (req, res) => {
//   const { commentId } = req.params;
//   try {
//     await prisma.article_Comment.delete({
//       where: { id: commentId },
//     });
//     res.status(204).end();
//   } catch (error) {
//     res.status(500).json({ error: "댓글 삭제 실패" });
//   }
// });

// //------------------------------------------------------------------------//
// //[중고마켓] (마이그레이션) offset 기반 페이지네이션
// //상품 목록 조회
// const productsRouter = express.Router();
// productsRouter.get("/", async (req, res) => {
//   const { page = 1, pageSize = 10, search = "", sort = "recent" } = req.query;
//   const skip = (Number(page) - 1) * Number(pageSize);
//   const take = Number(pageSize);
//   const orderBy = sort === "recent" ? { createdAt: "desc" } : undefined;

//   try {
//     const products = await prisma.product.findMany({
//       where: {
//         OR: [
//           { name: { contains: String(search) } },
//           { description: { contains: String(search) } },
//         ],
//       },
//       orderBy,
//       skip,
//       take,
//       select: {
//         id: true,
//         name: true,
//         description: true,
//         price: true,
//         createdAt: true,
//         tags: true,
//       },
//     });
//     res.status(200).send(products);
//   } catch (error) {
//     res.status(500).json({ error: "상품 목록 조회 실패" });
//   }
// });

// //특정 productId(상품)검색
// productsRouter.get("/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const product = await prisma.product.findUnique({
//       where: { id },
//     });
//     if (product) {
//       res.send(product);
//     } else {
//       res.status(404).send({ error: "상품을 찾을 수 없습니다" });
//     }
//   } catch (error) {
//     res.status(500).send({ error: "상품 조회 실패" });
//   }
// });

// //상품 등록
// productsRouter.post("/", async (req, res) => {
//   try {
//     const { name, description, images, price, tags } = req.body;
//     const product = await prisma.product.create({
//       data: {
//         name,
//         description,
//         images,
//         price,
//         tags,
//       },
//     });
//     res.status(201).send(product);
//   } catch (error) {
//     res.status(500).json({ error: "상품 생성 실패ㅜㅜ" });
//   }
// });

// //상품 수정
// productsRouter.patch("/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const product = await prisma.product.update({
//       where: { id },
//       data: req.body,
//     });
//     res.send({ product, message: "수정 성공~ " });
//   } catch (error) {
//     res.status(500).json({ error: "상품 수정 실패" });
//   }
// });

// //상품 삭제
// productsRouter.delete("/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     await prisma.product.delete({
//       where: { id },
//     });
//     res.status(204).end();
//   } catch (error) {
//     res.status(500).json({ error: "상품 삭제 실패" });
//   }
// });

// //중고마켓 댓글
// //상품에 댓글 생성
// productsRouter.post("/:id/comments", async (req, res) => {
//   const { id } = req.params;
//   const { content } = req.body;
//   try {
//     const newComment = await prisma.product_Comment.create({
//       data: {
//         content,
//         productId: id,
//       },
//     });
//     res.status(201).send(newComment);
//   } catch (error) {
//     res.status(500).json({ error: "댓글 생성 실패" });
//   }
// });

// //상품의 댓글 목록 검색
// productsRouter.get("/:id/comments", async (req, res) => {
//   const { id: productId } = req.params;
//   try {
//     const comment = await prisma.product_Comment.findMany({
//       where: {
//         productId: productId,
//       },
//     });
//     if (!comment) {
//       return res.status(404).json({ error: "댓글을 찾을 수 없음" });
//     }
//     res.send(comment);
//   } catch (error) {
//     res.status(500).json({ error: "댓글 검색 실패" });
//   }
// });

// //특정 댓글 조회
// productsRouter.get("/:id/comments/:commentId", async (req, res) => {
//   const { id: productId, commentId } = req.params;
//   try {
//     const comment = await prisma.product_Comment.findUnique({
//       where: {
//         id: commentId,
//       },
//     });

//     if (!comment || comment.productId !== productId) {
//       return res.status(404).json({ error: "댓글을 찾을 수 없음" });
//     }

//     res.send(comment);
//   } catch (error) {
//     res.status(500).json({ error: "댓글 조회 실패" });
//   }
// });

// //특정 댓글 수정
// productsRouter.patch("/:id/comments/:commentId", async (req, res) => {
//   const { commentId } = req.params;
//   const { content } = req.body;
//   try {
//     const updatedComment = await prisma.product_Comment.update({
//       where: { id: commentId },
//       data: { content },
//     });
//     res.status(200).send(updatedComment);
//   } catch (error) {
//     res.status(500).json({ error: "댓글 수정 실패" });
//   }
// });

// productsRouter.delete("/:productId/comments/:commentId", async (req, res) => {
//   const { commentId } = req.params;
//   try {
//     await prisma.product_Comment.delete({
//       where: { id: commentId },
//     });
//     res.status(204).end();
//   } catch (error) {
//     res.status(500).json({ error: "댓글 삭제 실패" });
//   }
// });
