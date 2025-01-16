import mongoose from "mongoose"; //몽구스 라이브러리 사용 선언

const ProductSchema = new mongoose.Schema(
  {
    // id: {
    //   type: String, // id 문자열 타입
    //   required: true, // 필수 항목
    // },
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
    tags: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt과 updatedAt 필드 자동 추가
  }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
