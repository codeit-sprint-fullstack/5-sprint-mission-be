import Product from "../models/product.js";

// 상품 등록 (Create)
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res
      .status(400)
      .json({ message: "상품 등록에 실패했습니다", error: error.message });
  }
};

// 상품 목록 조회 (Read - 전체)
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const products = await Product.find(offset, limit);
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "상품 목록 조회에 실패했습니다", error: error.message });
  }
};

// 상품 상세 조회 (Read - 단일)
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다" });
    }
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "상품 조회에 실패했습니다", error: error.message });
  }
};

// 상품 수정 (Update)
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res
      .status(400)
      .json({ message: "상품 수정에 실패했습니다", error: error.message });
  }
};

// 상품 삭제 (Delete)
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다" });
    }
    res.status(200).json({ message: "상품이 삭제되었습니다" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "상품 삭제에 실패했습니다", error: error.message });
  }
};

/**
 * 상품 좋아요 토글 기능
 * 좋아요가 없으면 추가하고, 있으면 취소합니다.
 */
export const toggleLike = async (req, res) => {
  try {
    const product = await Product.toggleLike(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다" });
    }
    res.status(200).json({
      message:
        product.likes > 0
          ? "좋아요가 추가되었습니다"
          : "좋아요가 취소되었습니다",
      product,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "좋아요 처리에 실패했습니다", error: error.message });
  }
};
