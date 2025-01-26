import productService from "../services/productService.js";

const addProduct = async (req, res) => {
  try {
    const { name, description, price, tags } = req.body;

    const newProduct = await productService.createProduct(
      name,
      description,
      price,
      tags
    );
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: `상품 추가 실패: ${error.message}` });
  }
};

const getProducts = async (req, res) => {
  try {
    // 퀴리로 값이 들어옴
    const { page = 1, limit = 10, sort = "recent", search } = req.query;

    const products = await productService.getProducts({
      page,
      limit,
      sort,
      search,
    });
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: `상품 조회 실패: ${error.message}` });
  }
};

const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productService.getProductById(id);

    if (!product) {
      return res.status(404).json({ error: "상품을 찾을 수 없습니다" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: `상품 조회 실패: ${error.message}` });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    const updatedProduct = await productService.updateProduct(id, updateData);

    if (!updatedProduct) {
      return res.status(404).json({ error: "상품을 찾을 수 없습니다 " });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: `상품 수정 실패: ${error.message}}` });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedProduct = await productService.deleteProduct(id);

    console.log("삭제: ", deletedProduct);

    if (!deletedProduct) {
      return res.status(404).json({ error: `상품을 찾을 수 없습니다.` });
    }

    // 204는 본문이 없음
    res.status(200).json(deletedProduct);
  } catch (error) {
    res.status(500).json({ error: "상품 삭제 실패" });
  }
};

export default {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
