import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    tags: { type: [String], default: [], required: false },
    imgUrl: { type: String, required: false },
    favoriteCnt: { type: Number, default: 0, required: false },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
