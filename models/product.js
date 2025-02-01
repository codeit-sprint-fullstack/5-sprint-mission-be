import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    // 여기가 데이터 기본 틀을 작성하는 곳
    // img는 아직 무엇을 넣어줘야하는지 모르니까 default 값으로 basic을 주고 프론트에서 basic이면 기본 이미지 띄우게 만들기
    index: { type: Number }, // 일단 박아둔거
    img: { type: String, default: "basic" },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    like: { type: Number, default: 0 },
    description: { type: String, required: true },
    tags: { type: String, required: true },
    order: { type: Number, index: true }, // 일단 박아둔거
  },
  { timestamps: true }
  // { versionKey: false } 흠 제거가 안되네
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
