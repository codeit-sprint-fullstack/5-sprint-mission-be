import { PrismaClient } from "@prisma/client";
import { PRODUCTS } from "./mock.product.js";
const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.products.deleteMany();

  // 목 데이터 삽입
  await prisma.products.createMany({
    data: PRODUCTS,
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
