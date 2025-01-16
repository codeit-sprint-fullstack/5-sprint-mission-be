import mongoose from "mongoose";
import * as dotenv from "dotenv";
import Product from "./models/Product.js";
// import * as dotenv from "dotenv";
// dotenv.config();
// id, name, description, price, tags, createdAt
const data = [
  {
    id: "77",
    name: "아메리카노",
    description: "드립커피",
    price: "3000",
    tags: "커피",
    createdAt: new Date("2023-03-23T06:34:07.617Z"),
  },
  {
    id: "78",
    name: "네스트 책",
    description: "중고",
    price: "9000",
    tags: "책",
    createdAt: new Date("2023-03-23T06:34:09.617Z"),
  },
  {
    id: "79",
    name: "가방",
    description: "노트북가방~",
    price: "30000",
    tags: "기타",
    createdAt: new Date("2023-03-23T06:34:10.617Z"),
  },
  {
    id: "80",
    name: "컴퓨터",
    description: "팔아요",
    price: "500000",
    tags: "전자기기",
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
];

mongoose.connect(process.env.DATABASE_URL);

await Product.deleteMany({});
await Product.insertMany(data);

mongoose.connection.close();
