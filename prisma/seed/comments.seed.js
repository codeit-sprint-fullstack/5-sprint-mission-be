const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function getRandomUserId() {
  const userIds = [
    "user-1",
    "user-2",
    "user-3",
    "user-4",
    "user-5",
    "user-6",
    "user-7",
    "user-8",
    "user-9",
    "user-10",
  ];
  return userIds[Math.floor(Math.random() * userIds.length)];
}

function getRandomProductId() {
  const productIds = [
    "product-1",
    "product-2",
    "product-3",
    "product-4",
    "product-5",
    "product-6",
    "product-7",
    "product-8",
    "product-9",
    "product-10",
  ];
  return productIds[Math.floor(Math.random() * productIds.length)];
}

const commentsContents = [
  "생각보다 상태가 좋네요, 만족합니다!",
  "사용감은 있지만, 이 가격에 이 정도면 정말 괜찮아요.",
  "설명대로 제품 상태가 좋습니다, 신뢰할 수 있는 판매자에요.",
  "배송도 빠르고, 상품 상태도 괜찮았어요.",
  "약간의 사용감은 있지만, 전반적으로 만족스러운 구매였습니다.",
  "너무 귀여워서 반해버렸어요! 이 가격에 이런 건 정말 행운이에요!",
  "사진보다 실제로 보니 훨씬 더 예쁘네요! 만족스러워요.",
  "설명보다 실물이 훨씬 더 귀엽네요, 갖고 싶었던 거라 너무 좋아요!",
  "배송도 빨랐고, 실물이 너무 귀여워서 마음에 들어요!",
  "이런 아이템을 이 가격에 살 수 있어서 기쁩니다. 생각보다 귀여워요!",
];

function getRandomComment() {
  return commentsContents[Math.floor(Math.random() * commentsContents.length)];
}

const commentData = Array.from({ length: 30 }, () => ({
  userId: getRandomUserId(),
  resourceId: getRandomProductId(),
  resourceType: "Product",
  content: getRandomComment(),
  createdAt: new Date(),
  updatedAt: new Date(),
}));

async function seedComments() {
  await prisma.comments.createMany({
    data: commentData,
  });
  console.log("✅ Comments seeded");
}

module.exports = seedComments;
