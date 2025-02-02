import { PrismaClient } from "@prisma/client";
import { ARTICLES } from "./mock.js";

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.article.deleteMany();
  await prisma.comment.deleteMany(); // 기존 댓글도 삭제

  // 목 데이터 삽입
  for (const article of ARTICLES) {
    // 1. 게시글 생성
    const createdArticle = await prisma.article.create({
      data: {
        id: article.id,
        nickname: article.nickname,
        title: article.title,
        content: article.content,
        image: article.image,
        Heart: article.Heart,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
      },
    });

    // 2. 댓글 생성
    for (const comment of article.comments) {
      // 댓글에 articleId 추가 (위에서 생성된 게시글의 ID를 참조)
      await prisma.comment.create({
        data: {
          id: comment.id,
          userId: comment.userId,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          articleId: createdArticle.id, // 생성된 게시글의 ID를 연결
        },
      });
    }
  }
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
