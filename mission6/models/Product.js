import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.length <= 3; // 배열의 길이가 3 이하인지 확인
        },
        message: "이미지 등록은 최대 3개까지 가능합니다.", // 조건에 맞지 않으면 메시지 출력
      },
    },
    tags: {
      type: [String],
      default: [],
    },
    favoritesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
