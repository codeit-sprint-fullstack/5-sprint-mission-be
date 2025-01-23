import { PrismaClient } from "@prisma/client";
import { PRODUCTS, ARTICLES } from "./seedData.js";

const prisma = new PrismaClient();

async function main() {
  // 테이블 초기화
  await prisma.products.deleteMany();
  await prisma.articles.deleteMany();
  //   await prisma.comments.deleteMany();

  // 시드 데이터 삽입
  await prisma.products.createMany({
    data: PRODUCTS,
    skipDuplicates: true,
  });

  await prisma.articles.createMany({
    data: ARTICLES,
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("success");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
