import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password1 = await bcrypt.hash("password123", 10);
  const password2 = await bcrypt.hash("secure456", 10);

  const [user1, user2] = await Promise.all([
    prisma.user.upsert({
      where: { email: "test1@example.com" },
      update: {},
      create: {
        email: "test1@example.com",
        nickname: "테스터1",
        encryptedPassword: password1,
        image: "https://i.pravatar.cc/150?img=1",
      },
    }),
    prisma.user.upsert({
      where: { email: "test2@example.com" },
      update: {},
      create: {
        email: "test2@example.com",
        nickname: "테스터2",
        encryptedPassword: password2,
        image: "https://i.pravatar.cc/150?img=2",
      },
    }),
  ]);

  const product1 = await prisma.product.create({
    data: {
      name: "iPhone13",
      description: "아이폰 13 미개봉입니다. 정품입니다.",
      price: 900000,
      imageUrls: [
        "https://via.placeholder.com/300x300?text=iPhone1",
        "https://via.placeholder.com/300x300?text=iPhone2",
      ],
      tags: ["전자기기", "애플", "스마트폰"],
      userId: user1.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Bike",
      description: "산지 1년된 자전거 상태 좋음",
      price: 150000,
      imageUrls: ["https://via.placeholder.com/300x300?text=Bike"],
      tags: ["스포츠", "레저", "자전거"],
      userId: user2.id,
    },
  });

  const article1 = await prisma.article.create({
    data: {
      title: "React vs Vue 뭐가 나을까?",
      content: "경험 있으신 분들 조언 부탁드립니다!",
      userId: user1.id,
    },
  });

  const article2 = await prisma.article.create({
    data: {
      title: "중고 거래 꿀팁 공유",
      content: "사기 안 당하려면 어떻게 해야 할까요?",
      userId: user2.id,
    },
  });

  await prisma.comment.createMany({
    data: [
      {
        content: "저는 React 추천해요!",
        articleId: article1.id,
        userId: user2.id,
      },
      {
        content: "좋은 정보 감사합니다!",
        articleId: article2.id,
        userId: user1.id,
      },
      {
        content: "자전거 흥미 있네요. DM 주세요",
        productId: product2.id,
        userId: user1.id,
      },
    ],
  });

  await Promise.all([
    prisma.productFavorite.create({
      data: {
        productId: product1.id,
        userId: user2.id,
      },
    }),
    prisma.articleFavorite.create({
      data: {
        articleId: article1.id,
        userId: user2.id,
      },
    }),
    prisma.articleFavorite.create({
      data: {
        articleId: article1.id,
        userId: user1.id,
      },
    }),
  ]);

  console.log("✅ 시드 데이터 삽입 완료!");
}

main()
  .catch((e) => {
    console.error("❌ 시드 에러:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
