import Product from "../model/Product.js";

const addProduct = async ({ title, price, description, tags, imgUrl }) => {
  const product = new Product({ title, price, description, tags, imgUrl });
  return await product.save();
};

const fetchProductList = async (query) => {
  return await Product.find(query);
};

const productService = {
  addProduct,
  fetchProductList,
};

export default productService;
