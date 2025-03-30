import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { ARTICLES } from "./mock/mock_article.js";
import { ARTICLE_COMMENTS } from "./mock/mock_article_comment.js";
import { PRODUCT_COMMENTS } from "./mock/mock_product_comment.js";
import { PRODUCTS } from "./mock/mock_product.js";
async function seed() {
  //기존 데이터 삭제
  await prisma.article.deleteMany();

  //목 데이터 삽입
  await prisma.article.createMany({
    data: ARTICLES,
    skipDuplicates: true,
  });
  await prisma.article_Comment.deleteMany();
  await prisma.article_Comment.createMany({
    data: ARTICLE_COMMENTS,
    skipDuplicates: true,
  });

  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: PRODUCTS,
    skipDuplicates: true,
  });
  await prisma.product_Comment.deleteMany();
  await prisma.product_Comment.createMany({
    data: PRODUCT_COMMENTS,
    skipDuplicates: true,
  });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
