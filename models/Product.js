import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    images: {
      type: [String],
    },
    price: {
      type: Number,
      required: true,
    },
    tags: {
      type: [String], // 문자열 배열
    },
    favoriteCount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
