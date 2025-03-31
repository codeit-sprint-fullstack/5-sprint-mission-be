import express, { NextFunction, Request, Response } from "express";
import service from "./service.ts";
import prisma from "../../prismaClient.js";
import CustomError from "../../types/error.ts";
import auth from "../../middleware/auth.ts";

const router = express.Router();

/**
 * @swagger
 * /{productId}/favorite:
 *   post:
 *     summary: 상품을 즐겨찾기에 추가
 *     tags: 
 *       - Favorite
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 즐겨찾기 추가할 상품 ID
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 즐겨찾기 추가 성공
 *       404:
 *         description: 존재하지 않는 상품
 *       500:
 *         description: 서버 오류
 */
router.post("/:productId/favorite",auth.verifyAccessToken ,async(req:Request, res:Response, next:NextFunction) => {
  const userId = req.user?.id;
  const productId = req.params.productId.trim();
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    }
  });
  if(!userId){
    return;
  }
  if(!product){
    next(new CustomError(404, "존재하지 않는 상품에 대한 요청입니다."))
    return;
  }
  const result = await service.addFavorite(productId, userId);
  if(!result){
    next(new CustomError(500, "트랜잭션 오류 발생"))
    return;
  }
  const {status, ...data} = result;
  res.status(result.status).send(data);
  return;
});

router.delete("/:productId/favorite",auth.verifyAccessToken ,async(req:Request, res:Response, next:NextFunction) => {
  const userId = req.user?.id;
  const productId = req.params.productId.trim();
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    }
  });
  if(!userId){
    return;
  }
  if(!product){
    next(new CustomError(404, "존재하지 않는 상품에 대한 요청입니다."))
    return;
  }
  const result = await service.removeFavorite(productId, userId);
  if(!result){
    next(new CustomError(500, "트랜잭션 오류 발생"))
    return;
  }
  res.status(result.status).send(result);
  return;
});

export default router;