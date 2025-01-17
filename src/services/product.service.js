import Product from '../models/Product.js';

const createProduct = async (data) => {
    const newProduct = new Product(data);
    return newProduct.save();
};

const getProducts = async () => {
    return Product.find();
};

const getProductById = async (id) => {
    return Product.findById(id);
};

const updateProduct = async (id, data) => {
    return Product.findByIdAndUpdate(id, data, { new: true });
};

const deleteProduct = async (id) => {
    return Product.findByIdAndDelete(id);
};

export default {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
