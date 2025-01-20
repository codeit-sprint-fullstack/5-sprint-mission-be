import {
  getProduct as getProductService,
  createProduct as createProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
  getProducts as getProductsService,
  getTotalProductsCount,
} from "./products.service.js";

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
    console.log("Received data:", { name, description, price, tags });
    const newProduct = await createProductService({
      name,
      description,
      price,
      tags,
    });
    res.status(201).send({ message: "등록 성공~", product: newProduct });
  } catch (error) {
    res.status(500).send("생성 실패 ㅠㅠ");
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, images, description, price, tags } = req.body;
    const updatedProduct = await updateProductService(id, {
      name,
      images,
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
    const { page = 1, limit = 10, search = "", orderBy = "recent" } = req.query;
    const validLimit = Number.isNaN(Number(limit)) ? 10 : Number(limit); // limit 값이 숫자인지 체크하고 기본값 설정
    const offset = (page - 1) * validLimit; // 페이지와 limit에 맞는 데이터 범위 계산

    const { products, totalProducts } = await getProductsService(
      offset,
      validLimit,
      search,
      orderBy
    );

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "상품을 찾을 수 없음" });
    }

    res.status(200).json({ products, totalProducts });
  } catch (error) {
    res.status(500).send("서버 에러");
  }
};
