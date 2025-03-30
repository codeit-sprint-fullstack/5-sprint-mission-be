const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userData = [
  {
    id: "user-1",
    email: "jjangu@example.com",
    password: "hashedpassword1",
    nickname: "짱구",
    image: "https://example.com/images/jjangu.png",
  },
  {
    id: "user-2",
    email: "penguin@example.com",
    password: "hashedpassword2",
    nickname: "펭귄덕후",
    image: "https://example.com/images/penguin.png",
  },
  {
    id: "user-3",
    email: "molang@example.com",
    password: "hashedpassword3",
    nickname: "몰랑몰랑",
    image: "https://example.com/images/molang.png",
  },
  {
    id: "user-4",
    email: "totoro@example.com",
    password: "hashedpassword4",
    nickname: "토토로빠",
    image: "https://example.com/images/totoro.png",
  },
  {
    id: "user-5",
    email: "spongebob@example.com",
    password: "hashedpassword5",
    nickname: "스폰지밥",
    image: "https://example.com/images/spongebob.png",
  },
  {
    id: "user-6",
    email: "patrick@example.com",
    password: "hashedpassword6",
    nickname: "패트릭",
    image: "https://example.com/images/patrick.png",
  },
  {
    id: "user-7",
    email: "squidward@example.com",
    password: "hashedpassword7",
    nickname: "징징이",
    image: "https://example.com/images/squidward.png",
  },
  {
    id: "user-8",
    email: "sandy@example.com",
    password: "hashedpassword8",
    nickname: "샌디",
    image: "https://example.com/images/sandy.png",
  },
  {
    id: "user-9",
    email: "mrkrabs@example.com",
    password: "hashedpassword9",
    nickname: "게살버거",
    image: "https://example.com/images/mrkrabs.png",
  },
  {
    id: "user-10",
    email: "plankton@example.com",
    password: "hashedpassword10",
    nickname: "플랑크톤",
    image: "https://example.com/images/plankton.png",
  },
];

async function seedUsers() {
  for (const user of userData) {
    await prisma.users.create({
      data: user,
    });
  }
  console.log("✅ Users seeded");
}

module.exports = seedUsers;
