import Product from "../model/Product.js";

const addProduct = async ({ title, price, description, tags, imgUrl }) => {
  const product = new Product({ title, price, description, tags, imgUrl });
  return await product.save();
};

const productService = {
  addProduct,
};

export default productService;
