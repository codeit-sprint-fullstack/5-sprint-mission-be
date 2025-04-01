const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const productData = [
  {
    id: "product-1",
    ownerId: "user-1",
    ownerNickname: "짱구",
    likeCount: 25,
    images: ["https://example.com/images/jjangu-pajamas.jpg"],
    tags: ["잠옷", "짱구", "귀여움"],
    price: 12000,
    name: "짱구 잠옷 세트",
    description:
      "짱구 얼굴이 그려진 귀여운 잠옷 세트! M 사이즈. 한 번 착용했어요 :)",
  },
  {
    id: "product-2",
    ownerId: "user-2",
    ownerNickname: "펭귄덕후",
    likeCount: 40,
    images: ["https://example.com/images/penguin-cup.jpg"],
    tags: ["컵", "펭귄", "귀여운소품"],
    price: 5000,
    name: "펭귄 모양 머그컵",
    description: "귀여운 펭귄 얼굴이 있는 머그컵이에요. 소장용으로 딱!",
  },
  {
    id: "product-3",
    ownerId: "user-3",
    ownerNickname: "몰랑몰랑",
    likeCount: 15,
    images: ["https://example.com/images/molang-keyring.jpg"],
    tags: ["키링", "몰랑이", "악세서리"],
    price: 3000,
    name: "몰랑이 키링",
    description: "몰랑몰랑 귀여운 몰랑이 키링 팝니다~",
  },
  {
    id: "product-4",
    ownerId: "user-1",
    ownerNickname: "짱구",
    likeCount: 30,
    images: ["https://example.com/images/rilakkuma-blanket.jpg"],
    tags: ["담요", "리락쿠마", "겨울용품"],
    price: 8000,
    name: "리락쿠마 담요",
    description: "따뜻한 리락쿠마 무릎담요예요. 부드럽고 귀여워요!",
  },
  {
    id: "product-5",
    ownerId: "user-4",
    ownerNickname: "토토로빠",
    likeCount: 20,
    images: ["https://example.com/images/totoro-pen.jpg"],
    tags: ["문구", "토토로", "펜"],
    price: 2000,
    name: "토토로 젤펜",
    description:
      "글씨 부드럽게 써지고 토토로 피규어가 달려있는 귀여운 펜이에요!",
  },
  {
    id: "product-6",
    ownerId: "user-5",
    ownerNickname: "스폰지밥",
    likeCount: 35,
    images: ["https://example.com/images/spongebob-stickers.jpg"],
    tags: ["스티커", "스폰지밥", "파티용품"],
    price: 1000,
    name: "스폰지밥 스티커 세트",
    description:
      "다양한 스폰지밥 캐릭터 스티커들, 파티나 노트북 장식에 좋아요!",
  },
  {
    id: "product-7",
    ownerId: "user-6",
    ownerNickname: "패트릭",
    likeCount: 50,
    images: ["https://example.com/images/patrick-hat.jpg"],
    tags: ["모자", "패트릭", "패션"],
    price: 7000,
    name: "패트릭 캐릭터 모자",
    description: "패트릭 모양의 귀여운 모자, 아웃도어 활동에 적합합니다!",
  },
  {
    id: "product-8",
    ownerId: "user-7",
    ownerNickname: "징징이",
    likeCount: 10,
    images: ["https://example.com/images/squidward-shirt.jpg"],
    tags: ["셔츠", "징징이", "패션"],
    price: 15000,
    name: "징징이 아트 셔츠",
    description: "징징이 팬이라면 꼭 가져야 할 아트 셔츠입니다. 독특한 디자인!",
  },
  {
    id: "product-9",
    ownerId: "user-8",
    ownerNickname: "샌디",
    likeCount: 45,
    images: ["https://example.com/images/sandy-book.jpg"],
    tags: ["책", "샌디", "과학"],
    price: 9000,
    name: "샌디의 과학 모험",
    description:
      "샌디와 함께하는 재미있는 과학 모험! 어린이와 청소년을 위한 최고의 선택.",
  },
  {
    id: "product-10",
    ownerId: "user-9",
    ownerNickname: "게살버거",
    likeCount: 22,
    images: ["https://example.com/images/mrkrabs-cookbook.jpg"],
    tags: ["책", "게살버거", "요리"],
    price: 20000,
    name: "게살버거 요리책",
    description:
      "게살버거 가게의 비밀 요리법이 담긴 요리책! 집에서도 맛있는 버거를 만들 수 있습니다.",
  },
];

async function seedProducts() {
  await prisma.products.createMany({
    data: productData,
  });
  console.log("✅ Products seeded");
}

module.exports = seedProducts;
