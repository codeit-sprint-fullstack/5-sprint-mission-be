import express from "express";
import prisma from "../config/prismaClient.js";

const router = express.Router();

//상품 목록 조회
router.get("/", async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search = "" } = req.query;

    const products = await prisma.product.findMany({
      skip: Number((page - 1) * pageSize),
      take: Number(pageSize),
      orderBy: { createdAt: "desc" },
    });

    res.status(200).send(products);
  } catch (err) {
    res.status(500).send(console.log("CAN NOT FOUND ERROR"));
  }
});

//상품 등록
router.post("/", async (req, res) => {
  try {
    const { name, description, price, tags } = req.body;
    const products = await prisma.product.create({
      name,
      description,
      price,
      tags,
    });

    res.status(201).send(products);
  } catch (err) {
    res.status(500).send(console.log("CAN NOT FOUND ERROR"));
  }
});

//상품 상세 조회
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const products = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!products) return res.status(404).send("CAN NOT FOUND PRODUCT");
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send("CAN NOT FOUND ERROR");
  }
});

//상품 수정
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const upData = req.body;
    const product = await prisma.product.update({
      data: {
        upData,
      },
      where: {
        id,
      },
    });
    if (!product) return res.status(404).send("CAN NOT FOUND PRODUCT");
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send("CAN NOT FOUND ERROR");
  }
});

//상품 삭제
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.delete({
      where: {
        id,
      },
    });
    if (!product) return res.status(404).send("CAN NOT FOUND PRODUCT");
    res.status(204).send("PRODUCT DELETED SUCCESS");
  } catch (err) {
    res.status(500).send("CAN NOT FOUND ERROR");
  }
});

export default router;
