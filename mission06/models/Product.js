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
            required: true,
        },
        description: {
            type: String,
            minLength: 10,
            maxLength: 100,
            required: true,
        },
        name: {
            type: String,
            minLength: 1,
            maxLength: 10,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;