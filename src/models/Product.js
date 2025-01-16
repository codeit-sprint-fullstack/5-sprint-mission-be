import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const ProductSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    tags: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const Product = mongoose.model('Product', ProductSchema);

export default Product;