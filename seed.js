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
    images: [],
    price: 3000,
    tags: ["커피"],
    favoriteCount: 3,
    createdAt: new Date("2023-03-23T06:34:07.617Z"),
  },
  {
    id: "78",
    name: "네스트 책",
    description: "중고",
    images: [],
    price: 9000,
    tags: ["책"],
    favoriteCount: 11,
    createdAt: new Date("2023-03-23T06:34:09.617Z"),
  },
  {
    id: "79",
    name: "가방",
    description: "노트북가방~",
    images: [],
    price: 30000,
    tags: ["기타"],
    favoriteCount: 2,
    createdAt: new Date("2023-03-23T06:34:10.617Z"),
  },
  {
    id: "80",
    name: "컴퓨터",
    description: "팔아요",
    images: [],
    price: 500000,
    tags: ["전자기기"],
    favoriteCount: 3,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
<<<<<<< HEAD
=======
  {
    id: "81",
    name: "맥북",
    description: "미개봉 새상품",
    images: ["https://cdn.it.chosun.com/news/photo/202101/2021011901887_1.jpg"],
    price: 2000000,
    tags: ["전자기기"],
    favoriteCount: 5,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "82",
    name: "아이폰 16 프로",
    description: "팔아요",
    images: [],
    price: 500000,
    tags: ["전자기기"],
    favoriteCount: 7,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "83",
    name: "LG 그램 16",
    description: "깨끗해요",
    images: [],
    price: 200000,
    tags: ["전자기기"],
    favoriteCount: 3,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "84",
    name: "모니터",
    description: "LG 모니터",
    images: [],
    price: 50000,
    tags: ["기타"],
    favoriteCount: 4,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "85",
    name: "감귤 3kg",
    description: "제주감귤",
    images: [],
    price: 30000,
    tags: ["식품"],
    favoriteCount: 30,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "86",
    name: "에어팟",
    description: "에어팟 프로 미개봉 새제품",
    images: [],
    price: 80000,
    tags: ["전자기기"],
    favoriteCount: 0,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "87",
    name: "아이패드 프로",
    description: "아이패드 프로 신제품",
    images: [],
    price: 700000,
    tags: ["전자기기"],
    favoriteCount: 3,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "88",
    name: "메이플",
    description: "캐나다산 메이플 시럽",
    images: [],
    price: 10000,
    tags: ["식품"],
    favoriteCount: 7,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "89",
    name: "치즈",
    description: "프랑스 직구",
    images: [],
    price: 30000,
    tags: ["식품"],
    favoriteCount: 33,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "90",
    name: "요리 클래스 쿠폰",
    description: "한식요리",
    images: [],
    price: 30000,
    tags: ["취미"],
    favoriteCount: 3,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "91",
    name: "베를린 엽서",
    description: "베를린 사진집",
    images: [],
    price: 3000,
    tags: ["식품"],
    favoriteCount: 12,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "95",
    name: "마우스",
    description: "로지땡",
    images: [],
    price: 10000,
    tags: ["전자기기"],
    favoriteCount: 23,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "98",
    name: "비타민",
    description: "독일산 비타민 C",
    images: [],
    price: 50000,
    tags: ["식품"],
    favoriteCount: 34,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "99",
    name: "뉴욕 티셔츠",
    description: "I LOVE NYC",
    images: [],
    price: 30000,
    tags: ["식품"],
    favoriteCount: 5,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "102",
    name: "안마기",
    description: "바x 프랜드",
    images: [],
    price: 3000000,
    tags: ["식품"],
    favoriteCount: 2,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
<<<<<<< HEAD
>>>>>>> 9a3702f (seed added)
=======
  {
    id: "103",
    name: "test",
    description: "testtest",
    images: [],
    price: 3000000,
    tags: ["식품"],
    favoriteCount: 2,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "105",
    name: "test",
    description: "testtest",
    images: [],
    price: 3000000,
    tags: ["식품"],
    favoriteCount: 2,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "107",
    name: "test",
    description: "test",
    images: [],
    price: 3000000,
    tags: ["식품"],
    favoriteCount: 2,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "102",
    name: "test",
    description: "test",
    images: [],
    price: 3000000,
    tags: ["식품"],
    favoriteCount: 2,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "102",
    name: "test",
    description: "test",
    images: [],
    price: 3000000,
    tags: ["식품"],
    favoriteCount: 2,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "102",
    id: "102",
    name: "test",
    description: "test",
    images: [],
    price: 3000000,
    tags: ["식품"],
    favoriteCount: 2,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "102",
    name: "test",
    description: "test",
    images: [],
    price: 3000000,
    tags: ["식품"],
    favoriteCount: 2,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "102",
    name: "test",
    description: "test",
    images: [],
    price: 3000000,
    tags: ["식품"],
    favoriteCount: 2,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "102",
    name: "test",
    description: "test",
    images: [],
    price: 3000000,
    tags: ["식품"],
    favoriteCount: 2,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "102",
    name: "test",
    description: "test",
    images: [],
    price: 3000000,
    tags: ["식품"],
    favoriteCount: 2,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "102",
    name: "test",
    description: "test",
    images: [],
    price: 3000000,
    tags: ["식품"],
    favoriteCount: 2,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "102",
    name: "test",
    description: "test",
    images: [],
    price: 3000000,
    tags: ["식품"],
    favoriteCount: 2,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "102",
    name: "test",
    description: "test",
    images: [],
    price: 3000000,
    tags: ["식품"],
    favoriteCount: 2,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "102",
    name: "test",
    description: "test",
    images: [],
    price: 3000000,
    tags: ["식품"],
    favoriteCount: 2,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
  {
    id: "102",
    name: "test",
    description: "test",
    images: [],
    price: 3000000,
    tags: ["식품"],
    favoriteCount: 2,
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
  },
>>>>>>> c70b490 (seed more)
];

mongoose.connect(process.env.DATABASE_URL);

await Product.deleteMany({});
await Product.insertMany(data);

mongoose.connection.close();
