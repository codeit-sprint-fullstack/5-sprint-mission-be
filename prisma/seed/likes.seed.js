const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 사용자 ID 배열
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
// 상품 ID와 해당 상품의 즐겨찾기 수
const products = [
  { id: "product-1", count: 25 },
  { id: "product-2", count: 40 },
  { id: "product-3", count: 15 },
  { id: "product-4", count: 30 },
  { id: "product-5", count: 20 },
  { id: "product-6", count: 35 },
  { id: "product-7", count: 50 },
  { id: "product-8", count: 10 },
  { id: "product-9", count: 45 },
  { id: "product-10", count: 22 },
];

// 함수: 랜덤 사용자 ID를 반환
function getRandomUserId() {
  return userIds[Math.floor(Math.random() * userIds.length)];
}

// 즐겨찾기 데이터 생성
async function seedLikes() {
  let likes = [];
  for (const product of products) {
    // 이미 사용된 사용자 ID를 추적하기 위한 Set
    const usedUserIds = new Set();

    // 각 상품당 지정된 수의 즐겨찾기 생성
    let count = 0;
    while (count < product.count && usedUserIds.size < userIds.length) {
      const userId = getRandomUserId();

      // 동일 사용자가 동일 상품에 대해 중복 즐겨찾기 방지
      const key = `${userId}_${product.id}`;
      if (!usedUserIds.has(key)) {
        usedUserIds.add(key);
        likes.push({
          userId: userId,
          resourceId: product.id,
          resourceType: "Product",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        count++;
      }
    }
  }

  // 즐겨찾기 데이터 벌크 인서트
  await prisma.likes.createMany({
    data: likes,
  });
  console.log(`✅ ${likes.length} likes seeded`);
}

// 모듈로만 내보내고 직접 실행하지 않음
module.exports = seedLikes;
