import mongoose from "mongoose";
import Product from "./src/models/Product.js";
import dotenv from "dotenv";

dotenv.config();

// MongoDB 연결
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("MongoDB 연결 성공"))
  .catch((err) => console.error("MongoDB 연결 실패:", err));

// 시딩 데이터
const seedData = [
  {
    name: "Tuscany Wine Tour",
    description:
      "이탈리아 투스카니 지역의 포도밭에서 와인 시음과 투어를 즐길 수 있는 패키지",
    price: 200,
    tags: ["travel", "wine", "Italy"],
  },
  {
    name: "Handmade Ceramic Dinner Plate Set",
    description:
      "고급스러운 디자인의 수작업으로 만들어진 도자기 디너 플레이트 세트 (4개입)",
    price: 75,
    tags: ["kitchen", "ceramic", "handmade"],
  },
  {
    name: "Gourmet Cheese Selection",
    description: "유럽 각지에서 엄선된 5종의 고급 치즈 세트",
    price: 50,
    tags: ["food", "cheese", "gourmet"],
  },
  {
    name: "Professional Acrylic Paint Set",
    description: "화가와 예술가를 위한 24색 아크릴 페인트 세트",
    price: 40,
    tags: ["art", "paint", "acrylic"],
  },
  {
    name: "Camping Tent for 4 People",
    description: "내구성이 뛰어나고 방수 처리된 4인용 캠핑 텐트",
    price: 150,
    tags: ["outdoor", "camping", "tent"],
  },
  {
    name: "Organic Herbal Tea Sampler",
    description: "라벤더, 카모마일, 페퍼민트 등 6종의 유기농 허브티 샘플러",
    price: 25,
    tags: ["tea", "herbal", "organic"],
  },
  {
    name: "Mountain Bike - 21 Speed",
    description:
      "산악 트레일을 위해 설계된 가벼운 알루미늄 프레임의 21단 산악 자전거",
    price: 600,
    tags: ["sports", "bike", "mountain"],
  },
  {
    name: "Leather Journal with Pen Holder",
    description: "고급스러운 가죽 소재의 다이어리, 펜 홀더 포함",
    price: 35,
    tags: ["stationery", "journal", "leather"],
  },
  {
    name: "Scented Soy Candles Set",
    description: "라벤더, 바닐라, 시트러스 향의 천연 소이 캔들 세트",
    price: 30,
    tags: ["home-decor", "candles", "natural"],
  },
  {
    name: "Gourmet Chocolate Box",
    description: "다크, 밀크, 화이트 초콜릿을 포함한 고급 초콜릿 박스 (12개입)",
    price: 25,
    tags: ["food", "chocolate", "gourmet"],
  },
];

// 데이터베이스에 시딩
const seedDatabase = async () => {
  try {
    // 기존 데이터 제거
    // await Product.deleteMany();
    // console.log("기존 데이터 제거 완료");

    // 새로운 데이터 삽입
    await Product.insertMany(seedData);
    console.log("시딩 데이터 삽입 완료");

    mongoose.connection.close();
  } catch (err) {
    console.error("시딩 중 오류 발생:", err);
    mongoose.connection.close();
  }
};

seedDatabase();
