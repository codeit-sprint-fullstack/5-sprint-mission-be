import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
        },
        favoriteCount: {
            type: Number,
            default: 0,
        },
        ownerNickname: {
            type: String,
        },
        ownerId: {
            type: Number,
        },
        images: {
            type: Array,
        },
        tags: {
            type: Array,
        },
        price: {
            type: Number,
        },
        description: {
            type: String,
        },
        name: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;