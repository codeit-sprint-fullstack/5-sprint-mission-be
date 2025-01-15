import {
  getProduct as getProductService,
  createProduct as createProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
  getProducts as getProductsService,
} from "../services/index.js";

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductService(id);
    if (!product) {
      return res.status(404).send("상품을 찾을 수 없음");
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).send("서버 에러");
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, tags } = req.body;
    const newProduct = await createProductService({
      name,
      description,
      price,
      tags,
    });
    res.status(201).send("등록 성공~");
  } catch (error) {
    res.status(500).send("생성 실패 ㅠㅠ");
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, tags } = req.body;
    const updatedProduct = await updateProductService(id, {
      name,
      description,
      price,
      tags,
    });
    if (!updatedProduct) {
      return res.status(404).send("상품을 찾을 수 없음");
    }
    res.status(200).send("수정 성공");
  } catch (error) {
    res.status(500).send("서버 에러");
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await deleteProductService(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "상품을 찾을 수 없음" });
    }
    res.status(200).send("삭제 성공~~ ");
  } catch (error) {
    res.status(500).send("서버 에러");
  }
};

export const getProductsList = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const products = await getProductsService(page, limit);
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "상품을 찾을 수 없음" });
    }
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).send("서버 에러");
  }
};
