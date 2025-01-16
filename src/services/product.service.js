import Product from '../models/Product.js';

const createProduct = async (data) => {
    const newProduct = new Product(data);
    return await newProduct.save();
};

const getProducts = async () => {
    return await Product.find();
};

const getProductById = async (id) => {
    return await Product.findById(id);
};

const updateProduct = async (id, data) => {
    return await Product.findByIdAndUpdate(id, data, { new: true });
};

const deleteProduct = async (id) => {
    return await Product.findByIdAndDelete(id);
};

export default {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
