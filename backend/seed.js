import mongoose from "mongoose";
import Product from "./models/product.js";
import { DATABASE_URL } from "./env.js";

const data = [
  {
    name: "키보드",
    description: "타이핑이 편합니다",
    price: 30000,
    tags: "전자제품",
  },
  {
    name: "마우스",
    description: "정밀한 컨트롤",
    price: 25000,
    tags: "전자제품",
  },
  {
    name: "헤드폰",
    description: "소리가 깨끗합니다",
    price: 70000,
    tags: "전자제품",
  },
  {
    name: "스피커",
    description: "강력한 사운드",
    price: 80000,
    tags: "전자제품",
  },
  { name: "프린터", description: "고속 출력", price: 150000, tags: "전자제품" },
  {
    name: "무선 청소기",
    description: "강력한 흡입력",
    price: 200000,
    tags: "전자제품",
  },
  {
    name: "전기밥솥",
    description: "맛있는 밥을 지을 수 있습니다",
    price: 120000,
    tags: "전자제품",
  },
  {
    name: "커피머신",
    description: "바리스타처럼 커피를",
    price: 180000,
    tags: "전자제품",
  },
  {
    name: "믹서기",
    description: "편리하게 음식을 갈 수 있습니다",
    price: 35000,
    tags: "전자제품",
  },
  {
    name: "전자레인지",
    description: "간편한 조리",
    price: 60000,
    tags: "전자제품",
  },
  {
    name: "식기세척기",
    description: "편리한 세척",
    price: 400000,
    tags: "전자제품",
  },
  {
    name: "냉장고",
    description: "신선한 보관",
    price: 900000,
    tags: "전자제품",
  },
  {
    name: "다리미",
    description: "깔끔한 다림질",
    price: 35000,
    tags: "전자제품",
  },
  {
    name: "드라이기",
    description: "빠르게 머리 말리기",
    price: 40000,
    tags: "전자제품",
  },
  {
    name: "전기포트",
    description: "빠르게 끓이는 물",
    price: 20000,
    tags: "전자제품",
  },
  {
    name: "전기장판",
    description: "따뜻한 겨울나기",
    price: 70000,
    tags: "전자제품",
  },
  {
    name: "선풍기",
    description: "더위 날려줍니다",
    price: 30000,
    tags: "전자제품",
  },
  {
    name: "스마트폰",
    description: "다양한 기능",
    price: 500000,
    tags: "전자제품",
  },
  {
    name: "타블렛",
    description: "다양한 작업 가능",
    price: 350000,
    tags: "전자제품",
  },
  {
    name: "디지털카메라",
    description: "선명한 사진",
    price: 600000,
    tags: "전자제품",
  },
  {
    name: "LED TV",
    description: "선명한 화면",
    price: 900000,
    tags: "전자제품",
  },
  {
    name: "3D 프린터",
    description: "혁신적인 프린팅",
    price: 1000000,
    tags: "전자제품",
  },
  {
    name: "가습기",
    description: "편안한 공기",
    price: 50000,
    tags: "전자제품",
  },
  {
    name: "가전세트",
    description: "모두 포함된 세트",
    price: 1500000,
    tags: "전자제품",
  },
  {
    name: "게임기",
    description: "즐거운 게임",
    price: 300000,
    tags: "전자제품",
  },
  {
    name: "헤어드라이어",
    description: "빠르게 건조",
    price: 25000,
    tags: "전자제품",
  },
  {
    name: "전동칫솔",
    description: "효율적인 칫솔질",
    price: 50000,
    tags: "전자제품",
  },
  {
    name: "스마트워치",
    description: "건강 관리",
    price: 150000,
    tags: "전자제품",
  },
  {
    name: "자전거",
    description: "건강을 위한 운동",
    price: 200000,
    tags: "운동용품",
  },
  {
    name: "골프채",
    description: "정밀한 타격",
    price: 500000,
    tags: "운동용품",
  },
  {
    name: "배드민턴 라켓",
    description: "경기용 배드민턴 라켓",
    price: 30000,
    tags: "운동용품",
  },
  {
    name: "테니스 라켓",
    description: "편안한 그립감",
    price: 35000,
    tags: "운동용품",
  },
  {
    name: "탁구 라켓",
    description: "반응속도 향상",
    price: 25000,
    tags: "운동용품",
  },
  {
    name: "축구공",
    description: "경기용 축구공",
    price: 20000,
    tags: "운동용품",
  },
  {
    name: "농구공",
    description: "탁월한 반발력",
    price: 25000,
    tags: "운동용품",
  },
  {
    name: "배드민턴 셔틀콕",
    description: "경기용 셔틀콕",
    price: 15000,
    tags: "운동용품",
  },
  {
    name: "사이클링 헬멧",
    description: "안전한 사이클링",
    price: 40000,
    tags: "운동용품",
  },
  {
    name: "헬스장 장비",
    description: "편리한 운동기구",
    price: 200000,
    tags: "운동용품",
  },
  {
    name: "요가 매트",
    description: "편안한 요가",
    price: 25000,
    tags: "운동용품",
  },
  {
    name: "피트니스 덤벨",
    description: "근육 강화",
    price: 30000,
    tags: "운동용품",
  },
  {
    name: "러닝화",
    description: "편안한 운동화",
    price: 50000,
    tags: "운동용품",
  },
  { name: "텐트", description: "캠핑용 텐트", price: 150000, tags: "캠핑용품" },
  {
    name: "캠핑 의자",
    description: "편안한 의자",
    price: 35000,
    tags: "캠핑용품",
  },
  {
    name: "캠핑 테이블",
    description: "튼튼한 테이블",
    price: 40000,
    tags: "캠핑용품",
  },
  {
    name: "랜턴",
    description: "어두운 곳에서 유용",
    price: 20000,
    tags: "캠핑용품",
  },
  {
    name: "캠핑 가방",
    description: "편리한 수납",
    price: 25000,
    tags: "캠핑용품",
  },
  {
    name: "캠핑 매트",
    description: "편안한 휴식",
    price: 30000,
    tags: "캠핑용품",
  },
  {
    name: "그릴",
    description: "맛있는 바비큐",
    price: 60000,
    tags: "캠핑용품",
  },
  {
    name: "카메라 삼각대",
    description: "편리한 촬영",
    price: 15000,
    tags: "캠핑용품",
  },
  {
    name: "침낭",
    description: "편안한 잠자리",
    price: 50000,
    tags: "캠핑용품",
  },
];

mongoose.connect(DATABASE_URL);

await Product.deleteMany({});
await Product.insertMany(data);

mongoose.connection.close();
