import { PrismaClient } from "@prisma/client";
// import { faker } from '@faker-js/faker'; 다음에 써볼놈

const prisma = new PrismaClient();

async function main() {
  console.log("데이터가 들어간다");

  // 유저 생성
  const user1 = await prisma.user.create({
    data: {
      email: "user1@example.com",
      nickName: "user1",
      password: "password123",
      profileImg: "user1.jpg",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "user2@example.com",
      nickName: "user2",
      password: "password456",
      profileImg: "user2.jpg",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: "user3@example.com",
      nickName: "user3",
      password: "password789",
      profileImg: "user3.jpg",
    },
  });

  // 상품 생성
  const product1 = await prisma.product.create({
    data: {
      title: "iPhone 15",
      price: 1200000,
      like: 10,
      description: "최신 iPhone 15, 미개봉 제품",
      tags: "전자제품, 휴대폰",
      img: "iphone15.jpg",
    },
  });

  const product2 = await prisma.product.create({
    data: {
      title: "MacBook Pro",
      price: 2500000,
      like: 20,
      description: "M2 MacBook Pro 16인치",
      tags: "노트북, 애플",
      img: "macbookpro.jpg",
    },
  });

  // 게시글 생성
  const post1 = await prisma.bulletinBoard.create({
    data: {
      title: "iPhone 15 중고 팝니다",
      contents: "사용한지 3개월 된 아이폰 15 판매합니다.",
      img: "iphone_sale.jpg",
      like: 5,
      userId: user1.id,
    },
  });

  const post2 = await prisma.bulletinBoard.create({
    data: {
      title: "MacBook Pro 새제품 할인 판매",
      contents: "맥북 프로 새 제품 할인 판매합니다.",
      img: "macbook_sale.jpg",
      like: 8,
      userId: user2.id,
    },
  });

  // 댓글 생성
  await prisma.comment.create({
    data: {
      contents: "댓글1",
      userId: user2.id,
      WritingId: post1.id,
    },
  });

  await prisma.comment.create({
    data: {
      contents: "댓글2",
      userId: user1.id,
      WritingId: post2.id,
    },
  });

  console.log("되었나?");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
