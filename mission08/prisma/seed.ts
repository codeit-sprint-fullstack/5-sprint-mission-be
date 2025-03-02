import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("DB 초기화 중...");

  // 기존 데이터 삭제
  await prisma.article.deleteMany();

  console.log("기존 데이터 삭제 완료");

  // 데이터 추가
  const postData = [
    {
      title: "오늘 날씨 정말 좋네요!",
      content:
        "하늘이 너무 맑고 기분도 상쾌한 하루예요. 다들 좋은 하루 보내세요!",
      author: "맑은하늘",
      likes: 15,
      comments: [
        { author: "맑음", content: "내 이름은 맑음" },
        { author: "QWER", content: "아래 댓글 저희 밴드 노래에요!" },
      ],
    },
    {
      title: "좋은 책 추천해 주세요",
      content:
        "최근에 읽을만한 책 찾고 있어요. 감동적이거나 생각할 거리가 많은 책 추천 부탁드려요!",
      author: "책덕후",
      likes: 21,
      comments: [
        {
          author: "책쟁이",
          content: "저는 요즘 '전문가를 위한 리액트'를 읽고 있어요. 추천해요!",
        },
      ],
    },
    {
      title: "집에서 혼술할 때 좋은 안주 추천!",
      content: "퇴근 후 혼자 맥주 한 잔 할 때 맛있는 안주 뭐가 있을까요?",
      author: "혼술러",
      likes: 18,
    },
    {
      title: "여행 가고 싶어요...",
      content: "바다 보러 떠나고 싶은데 요즘 어디가 좋을까요? 추천 부탁드려요!",
      author: "여행자",
      likes: 12,
    },
    {
      title: "강아지 키우시는 분들 계신가요?",
      content: "반려견과 함께할 때 꼭 알아야 할 팁이 있을까요?",
      author: "댕댕이맘",
      likes: 24,
    },
    {
      title: "좋아하는 노래 공유해요!",
      content: "요즘 자꾸 듣게 되는 노래가 있나요? 추천해주세요!",
      author: "음악광",
      likes: 17,
    },
    {
      title: "운동 시작했어요!",
      content:
        "헬스장 등록하고 3일째인데 벌써 근육통이.. 운동 루틴 추천받아요!",
      author: "운동초보",
      likes: 30,
    },
    {
      title: "아이폰 vs 갤럭시 고민 중입니다.",
      content: "새 폰 사려는데 아이폰과 갤럭시 중 뭐가 나을까요?",
      author: "폰고민중",
      likes: 20,
    },
    {
      title: "오늘 저녁 뭐 드시나요?",
      content: "배고픈데 뭐 먹을지 고민 중.. 다들 저녁 추천 좀 해주세요!",
      author: "배고픈사람",
      likes: 14,
    },
    {
      title: "이직 고민 중입니다.",
      content: "현재 직장에서 만족스럽지 않은데 이직을 고려해야 할까요?",
      author: "고민중",
      likes: 22,
    },
    {
      title: "넷플릭스에서 볼만한 드라마 추천!",
      content: "주말에 몰아볼 드라마 추천 부탁드려요!",
      author: "드라마광",
      likes: 19,
    },
    {
      title: "오늘 기분 좋은 일 있었어요!",
      content: "길 가다가 모르는 분이 웃으며 인사해주셨는데 기분이 좋아졌어요~",
      author: "기분좋음",
      likes: 16,
    },
    {
      title: "집에서 할 수 있는 취미 추천!",
      content: "요즘 집에서 시간 보낼만한 취미를 찾고 있어요. 추천 부탁드려요!",
      author: "집순이",
      likes: 28,
    },
    {
      title: "자기 전에 듣기 좋은 음악 추천!",
      content: "잠들기 전 듣기 좋은 잔잔한 음악 추천해 주세요!",
      author: "감성충만",
      likes: 23,
      comments: [{ author: "Chill Guy", content: "칠가이 브금 들으세요!" }],
    },
    {
      title: "첫 자동차 구매 고민 중입니다.",
      content: "소형 SUV vs 중형 세단 중에서 고민하고 있는데 조언 부탁드려요!",
      author: "차알못",
      likes: 20,
    },
    {
      title: "스트레스 해소법 공유해요!",
      content: "요즘 스트레스 많이 받는데 다들 어떻게 푸시나요?",
      author: "스트레스폭발",
      likes: 31,
    },
    {
      title: "다이어트 중인데 너무 힘드네요ㅠㅠ",
      content: "다이어트 중인데 야식이 너무 땡겨요. 어떻게 참을까요?",
      author: "다이어터",
      likes: 26,
    },
    {
      title: "좋은 카페 발견했어요!",
      content: "분위기 좋은 카페에서 커피 한 잔 마시는 중인데 너무 좋아요~",
      author: "카페러버",
      likes: 18,
    },
    {
      title: "새로운 취미 시작했어요!",
      content: "드로잉을 배우기 시작했는데 너무 재미있어요!",
      author: "취미부자",
      likes: 22,
    },
    {
      title: "요즘 핫한 맛집 추천!",
      content: "최근 다녀온 맛집 중 최고였던 곳 추천해 주세요!",
      author: "먹방러",
      likes: 27,
    },
    {
      title: "감동적인 영화 추천해 주세요!",
      content: "눈물 쏙 빼는 감동 영화 보고 싶어요. 추천 부탁드려요!",
      author: "영화광",
      likes: 25,
    },
    {
      title: "아침형 인간 vs 저녁형 인간",
      content:
        "여러분은 아침형인가요, 저녁형인가요? 어떤 게 더 좋은 것 같아요?",
      author: "야행성",
      likes: 16,
      comments: [
        {
          author: "아침형",
          content: "아침형이에요! 아침에 일어나서 일찍 일어나는 게 좋아요.",
        },
        {
          author: "야행성",
          content: "저는 저녁형이에요. 밤에 활동하는 게 더 편해요.",
        },
      ],
    },
    {
      title: "반려묘 키우시는 분들 계신가요?",
      content: "고양이와 함께 살고 있는데 더 행복하게 키우는 팁이 있을까요?",
      author: "고양이집사",
      likes: 29,
    },
    {
      title: "오늘 하루도 수고 많으셨습니다!",
      content: "다들 오늘 하루도 고생 많았어요! 편안한 밤 보내세요~",
      author: "응원러",
      likes: 32,
    },
  ];

  console.log("자유게시판 게시글 생성 중...");

  for (const data of postData) {
    // 게시글 생성
    const post = await prisma.article.create({
      data: {
        title: data.title,
        content: data.content,
        author: data.author,
        likes: data.likes,
      },
    });

    // comments가 있는 경우에만 댓글 생성
    if (data.comments && data.comments.length > 0) {
      await prisma.articleComment.createMany({
        data: data.comments.map((comment) => ({
          articleId: post.id, // 게시글 ID 연결
          author: comment.author,
          content: comment.content,
        })),
      });
    }
  }

  console.log("자유게시판 게시글 생성 완료");
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
