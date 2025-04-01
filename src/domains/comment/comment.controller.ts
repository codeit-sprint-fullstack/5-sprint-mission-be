import { Request, Response, NextFunction } from "express";
import * as commentService from "./comment.service";

/**
 * @swagger
 * /products/{productId}/comments:
 *   post:
 *     summary: 상품에 댓글 추가
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: 댓글 내용
 *     responses:
 *       201:
 *         description: 댓글 생성 성공
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 에러
 */
interface CustomRequest extends Request {
  user?: {
    userId?: string; // userId가 JWT 토큰에서 오는 필드명인 경우
    id?: string; // id가 JWT 토큰에서 오는 필드명인 경우
  };
}

export const addProductComment = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productId = req.params.id;
    const { content } = req.body;

    // 로그인한 사용자의 ID를 JWT 토큰에서 가져옴 (userId 또는 id 필드 사용)
    const userId = req.user?.userId || req.user?.id;

    if (!userId) {
      const error = new Error("인증이 필요합니다.");
      error.name = "UnauthorizedError";
      throw error;
    }

    if (!content) {
      const error = new Error("댓글 내용은 필수입니다.");
      error.name = "ValidationError";
      throw error;
    }

    // 댓글 생성
    const newComment = await commentService.createComment({
      productId,
      userId,
      content,
    });

    // 응답 형식 맞추기
    const response = {
      id: newComment.id,
      content: newComment.content,
      createdAt:
        newComment.createdAt instanceof Date
          ? newComment.createdAt.toISOString()
          : newComment.createdAt,
      updatedAt:
        newComment.updatedAt instanceof Date
          ? newComment.updatedAt.toISOString()
          : newComment.updatedAt,
      writer: {
        id: newComment.user.id,
        nickname: newComment.user.nickname,
        image: newComment.user.image || "",
      },
    };

    console.log(
      `✅ [POST /products/${productId}/comments] 댓글 생성 성공: ${newComment.id}`
    );

    res.status(201).json(response);
  } catch (err) {
    console.error(
      `❌ [POST /products/${req.params.productId}/comments] 댓글 생성 실패:`,
      err
    );
    next(err);
  }
};

/**
 * @swagger
 * /comments/{commentId}:
 *   patch:
 *     summary: 댓글 수정
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: 댓글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: 수정할 댓글 내용
 *     responses:
 *       200:
 *         description: 댓글 수정 성공
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 댓글을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
export const updateComment = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // 로그인한 사용자의 ID를 JWT 토큰에서 가져옴
    const userId = req.user?.userId || req.user?.id;

    if (!userId) {
      const error = new Error("인증이 필요합니다.");
      error.name = "UnauthorizedError";
      throw error;
    }

    if (!content) {
      const error = new Error("댓글 내용은 필수입니다.");
      error.name = "ValidationError";
      throw error;
    }

    // 댓글 존재 여부 확인
    const existingComment = await commentService.getCommentById(id);
    if (!existingComment) {
      const error = new Error("댓글을 찾을 수 없습니다.");
      error.name = "NotFoundError";
      throw error;
    }

    // 댓글 작성자와 요청자가 일치하는지 확인
    if (existingComment.userId !== userId) {
      const error = new Error("자신이 작성한 댓글만 수정할 수 있습니다.");
      error.name = "ForbiddenError";
      throw error;
    }

    const updatedComment = await commentService.updateComment(id, {
      content,
    });

    const response = {
      id: updatedComment.id,
      content: updatedComment.content,
      createdAt:
        updatedComment.createdAt instanceof Date
          ? updatedComment.createdAt.toISOString()
          : updatedComment.createdAt,
      updatedAt:
        updatedComment.updatedAt instanceof Date
          ? updatedComment.updatedAt.toISOString()
          : updatedComment.updatedAt,
      writer: {
        id: updatedComment.user.id,
        nickname: updatedComment.user.nickname,
        image: updatedComment.user.image || "",
      },
    };

    console.log(`✅ [PATCH /comments/${id}] 댓글 수정 성공`);

    res.status(200).json(response);
  } catch (err) {
    console.error(`❌ [PATCH /comments/${req.params.id}] 댓글 수정 실패:`, err);
    next(err);
  }
};

/**
 * @swagger
 * /comments/{commentId}:
 *   delete:
 *     summary: 댓글 삭제
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: 댓글 ID
 *     responses:
 *       200:
 *         description: 댓글 삭제 성공
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 댓글을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
export const deleteComment = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // 로그인한 사용자의 ID를 JWT 토큰에서 가져옴
    const userId = req.user?.userId || req.user?.id;

    if (!userId) {
      const error = new Error("인증이 필요합니다.");
      error.name = "UnauthorizedError";
      throw error;
    }

    // 댓글 존재 여부 확인
    const existingComment = await commentService.getCommentById(id);
    if (!existingComment) {
      const error = new Error("댓글을 찾을 수 없습니다.");
      error.name = "NotFoundError";
      throw error;
    }

    // 댓글 작성자와 요청자가 일치하는지 확인
    if (existingComment.userId !== userId) {
      const error = new Error("자신이 작성한 댓글만 삭제할 수 있습니다.");
      error.name = "ForbiddenError";
      throw error;
    }

    // 댓글 삭제
    await commentService.deleteComment(id);

    console.log(`✅ [DELETE /comments/${id}] 댓글 삭제 성공`);

    res.status(200).json({ message: "댓글이 삭제되었습니다." });
  } catch (err) {
    console.error(
      `❌ [DELETE /comments/${req.params.id}] 댓글 삭제 실패:`,
      err
    );
    next(err);
  }
};

/**
 * @swagger
 * /products/{productId}/comments:
 *   get:
 *     summary: 상품의 댓글 목록 조회
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지당 항목 수
 *     responses:
 *       200:
 *         description: 댓글 목록 조회 성공
 *       500:
 *         description: 서버 에러
 */
export const getProductCommentList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 수정: id 파라미터를 productId로 사용
    const productId = req.params.id;
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    console.log("컨트롤러 - 요청 파라미터:", {
      productId,
      page,
      pageSize,
      originalUrl: req.originalUrl,
      params: req.params,
    });

    // productId가 없으면 에러
    if (!productId) {
      res.status(400).json({ message: "상품 ID가 필요합니다." });
      return;
    }

    // 페이지 및 페이지 크기 유효성 검사
    if (page < 1 || pageSize < 1) {
      const error = new Error(
        "페이지 번호와 페이지 크기는 1 이상이어야 합니다."
      );
      error.name = "ValidationError";
      throw error;
    }

    const { list, totalCount } = await commentService.getCommentsByProductId({
      productId,
      page,
      pageSize,
    });

    // 응답 형식 맞추기 - 날짜 형식 변환 및 writer 객체 형식 통일
    const formattedList = list.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt:
        comment.createdAt instanceof Date
          ? comment.createdAt.toISOString()
          : comment.createdAt,
      updatedAt:
        comment.updatedAt instanceof Date
          ? comment.updatedAt.toISOString()
          : comment.updatedAt,
      writer: {
        id: comment.user.id,
        nickname: comment.user.nickname,
        image: comment.user.image || "",
      },
    }));

    const totalPages = Math.ceil(totalCount / pageSize);

    console.log(`✅ [GET /products/${productId}/comments] 댓글 목록 조회 성공`);

    res.status(200).json({
      list: formattedList,
      totalCount,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error(
      `❌ [GET /products/${req.params.productId}/comments] 댓글 목록 조회 실패:`,
      err
    );
    next(err);
  }
};
/**
 * @swagger
 * components:
 *   schemas:
 *     Comments:
 *       type: object
 *       required:
 *         - id
 *         - userId
 *         - resourceId
 *         - resourceType
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 댓글의 고유 식별자
 *           example: 4a7b9c8d-1e2f-3a4b-5c6d-7e8f9a0b1c2d
 *         userId:
 *           type: string
 *           format: uuid
 *           description: 댓글 작성자의 사용자 ID
 *           example: 2e388cc5-8421-4cd3-98f7-befdb6d3b675
 *         resourceId:
 *           type: string
 *           format: uuid
 *           description: 댓글이 달린 리소스(상품, 게시글 등)의 ID
 *           example: 1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d
 *         resourceType:
 *           type: string
 *           description: 댓글이 달린 리소스의 유형 (product, article 등)
 *           example: product
 *         content:
 *           type: string
 *           description: 댓글 내용
 *           example: 너무 귀여워요 !!
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 댓글 작성 시간
 *           example: 2023-07-15T09:30:45Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 댓글 수정 시간
 *           example: 2023-07-15T09:35:22Z

 */
