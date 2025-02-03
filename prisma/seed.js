import prisma from "../server/config/prismaClient.js";

async function main() {
  // 상품 데이터 생성
  await prisma.product.create({
    data: {
      name: "상품 이름 예시 1",
      description: "상품 소개",
      price: 10000,
      tags: ["테그1", "테그2"],
    },
  });
  await prisma.product.create({
    data: {
      name: "상품 이름 예시 2",
      description: "상품 소개",
      price: 200000,
      tags: ["테그3"],
    },
  });

  //자유 게시판 데이터 생성
  await prisma.article.createMany({
    data: {
      title: "자유게시판 게시글 1",
      content: "게시글 내용1",
      image: ["이미지 1", "이미지2"],
    },
  });
  await prisma.article.createMany({
    data: {
      title: "자유게시판 게시글 2",
      content: "게시글 내용2",
      image: ["이미지 3"],
    },
  });
}

main()
  .then(() => {
    console.log("Seeding completed");
    prisma.$disconnect();
  })
  .catch((err) => {
    console.error("Seeding failed:", err);
    prisma.$disconnect();
  });
