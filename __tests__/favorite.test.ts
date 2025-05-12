import request from "supertest";
import app from "../app";
import prisma from "../server/config/prismaClient";

//product test
describe("Favorite API 흐름 테스트", () => {
  let token: string = "";
  let userId: string;
  let productId: string;

  const email = `favorite-${Date.now()}@example.com`;
  const password = "favoriteTest123";

  beforeAll(async () => {
    // 유저 회원가입 및 로그인
    await request(app).post("/auth/signup").send({
      email,
      password,
      nickname: "좋아요유저",
    });

    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email, password });
    token = loginRes.body.accessToken;
    userId = loginRes.body.user.id;

    // 테스트용 상품 생성
    const productRes = await prisma.product.create({
      data: {
        name: "좋아요 테스트 상품",
        description: "테스트 설명",
        price: 1000,
        tags: [],
        imageUrls: [],
        userId,
      },
    });

    productId = productRes.id;
  });

  afterAll(async () => {
    await prisma.productFavorite.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("✅ 상품 좋아요를 추가한다", async () => {
    const res = await request(app)
      .put(`/products/${productId}/favorite`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(201);
    expect(res.body.isLike).toBe(true);
    expect(res.body.message).toMatch(/좋아요가 추가/);
  });

  it("❌ 중복 좋아요는 400 응답", async () => {
    const res = await request(app)
      .put(`/products/${productId}/favorite`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/이미 좋아요를 눌렀습니다/);
  });

  it("✅ 상품 좋아요를 취소한다", async () => {
    const res = await request(app)
      .delete(`/products/${productId}/favorite`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.isLike).toBe(false);
    expect(res.body.message).toMatch(/좋아요가 취소/);
  });

  it("❌ 이미 취소된 상품은 404 응답", async () => {
    const res = await request(app)
      .delete(`/products/${productId}/favorite`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/이미 좋아요가 취소/);
  });
});

//article test
describe("Article 좋아요 API 흐름 테스트", () => {
  let token: string = "";
  let userId: string;
  let articleId: string;

  const email = `article-fav-${Date.now()}@example.com`;
  const password = "favTest123";

  beforeAll(async () => {
    // 유저 생성 및 로그인
    await request(app).post("/auth/signup").send({
      email,
      password,
      nickname: "아티클좋아요유저",
    });

    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email, password });
    token = loginRes.body.accessToken;
    userId = loginRes.body.user.id;

    // 테스트용 게시글 생성
    const articleRes = await prisma.article.create({
      data: {
        title: "좋아요 테스트 글",
        content: "좋아요 테스트 내용",
        imageUrls: [],
        userId,
      },
    });

    articleId = articleRes.id;
  });

  afterAll(async () => {
    await prisma.articleFavorite.deleteMany();
    await prisma.article.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("✅ 게시글 좋아요를 추가한다", async () => {
    const res = await request(app)
      .put(`/articles/${articleId}/favorite`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(201);
    expect(res.body.isLike).toBe(true);
    expect(res.body.message).toMatch(/좋아요가 추가/);
  });

  it("❌ 중복 좋아요는 400 응답", async () => {
    const res = await request(app)
      .put(`/articles/${articleId}/favorite`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/이미 좋아요를 눌렀습니다/);
  });

  it("✅ 게시글 좋아요를 취소한다", async () => {
    const res = await request(app)
      .delete(`/articles/${articleId}/favorite`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.isLike).toBe(false);
    expect(res.body.message).toMatch(/좋아요가 취소/);
  });

  it("❌ 이미 취소된 게시글은 404 응답", async () => {
    const res = await request(app)
      .delete(`/articles/${articleId}/favorite`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/이미 좋아요가 취소/);
  });
});
