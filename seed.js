import mongoose from "mongoose";
import Product from "./models/Product.js";
import * as dotenv from "dotenv";

dotenv.config();

const productData = [
  {
    name: "거울",
    description: "거울입니다.",
    price: 2000,
    tags: ["미용", "인테리어"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "바나나",
    description: "바나나입니다.",
    price: 10000,
    tags: ["음식", "과일"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "컵",
    description: "컵입니다.",
    price: 3000,
    tags: ["식기", "주방"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "물",
    description: "물입니다.",
    price: 5000,
    tags: ["음식", "생활용품"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "컴퓨터",
    description: "컴퓨터입니다.",
    price: 500000,
    tags: ["전자기기", "컴퓨터"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "책",
    description: "책입니다.",
    price: 10000,
    tags: ["도서", "취미"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "화장품",
    description: "화장품입니다.",
    price: 6000,
    tags: ["미용"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "달력",
    description: "달력입니다.",
    price: 5000,
    tags: ["사무용품", "문구", "새해"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "화장지",
    description: "화장지입니다.",
    price: 2000,
    tags: ["생활용품", "화장지"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "펜",
    description: "펜입니다.",
    price: 1000,
    tags: ["사무용품", "문구류"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

mongoose.connect(process.env.DATABASE_URL);

await Product.deleteMany({});
await Product.insertMany(productData);

mongoose.connection.close();
