import Product from "../models/Product.js";

const createProduct = async (name, description, price, tags) => {
  return await Product.create({ name, description, price, tags });
};

const getProducts = async ({ page, limit, sort, search }) => {
  const offset = (page - 1) * limit;
  const query = {};

  console.log("getProducts", page, limit, sort, search);

  // 검색 퀴리에 배열로 들어감.
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const sortOption = sort === "recent" ? { createdAt: -1 } : {};

  return await Product.find(query)
    .sort(sortOption)
    .skip(offset)
    .limit(parseInt(limit, 10));
};

const getProductById = async (id) => {
  return await Product.findById(id);
};

const updateProduct = async (id, updateData) => {
  return await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

export default {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
