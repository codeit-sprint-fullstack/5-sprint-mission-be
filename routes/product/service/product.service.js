import Product from "../model/Product.js";

const addProduct = async ({ title, price, description, tags, imgUrl }) => {
  try {
    const product = new Product({ title, price, description, tags, imgUrl });
    return await product.save();
  } catch (err) {
    throw new Error("- Database error while add product");
  }
};

const fetchProductList = async (query, skip, pageSize, orderBy) => {
  const sortBy = orderBy === "recent" ? "createdAt" : "favoriteCnt";
  try {
    return await Product.find(query)
      .sort({ [sortBy]: -1 })
      .skip(skip)
      .limit(pageSize);
  } catch (err) {
    throw new Error("- Database error while fetch product list");
  }
};

const fetchProductCount = async () => {
  try {
    return await Product.countDocuments();
  } catch (err) {
    throw new Error("- Database error while fetch product count");
  }
};

const productService = {
  addProduct,
  fetchProductList,
  fetchProductCount,
};

export default productService;
