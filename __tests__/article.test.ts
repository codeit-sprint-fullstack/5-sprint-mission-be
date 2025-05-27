import dotenv from "dotenv";
dotenv.config();

import request from "supertest";
import app from "../app";
import prisma from "../server/config/prismaClient";

describe("Article API 전체 흐름 테스트", () => {
  let token: string = "";
  let articleId: string;
  const userEmail = `test-article${Date.now()}@example.com`;
  const userPassword = "testPassword123";

  beforeAll(async () => {
    // 회원가입
    await request(app).post("/auth/signup").send({
      email: userEmail,
      password: userPassword,
      nickname: "게시글테스터",
    });

    // 로그인 → accessToken 추출
    const loginRes = await request(app).post("/auth/login").send({
      email: userEmail,
      password: userPassword,
    });

    token = loginRes.body.accessToken;
    if (!token) throw new Error("accessToken 누락");
  });

  afterAll(async () => {
    await prisma.article.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("✅ 게시글을 생성한다", async () => {
    const res = await request(app)
      .post("/articles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "테스트 게시글",
        content: "테스트 내용입니다.",
        imageUrls: [
          "https://your-bucket.s3.ap-northeast-2.amazonaws.com/uploads/test-article.jpg",
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe("테스트 게시글");

    articleId = res.body.data.id;
  });

  it("✅ 전체 게시글 목록을 가져온다", async () => {
    const res = await request(app).get("/articles");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.articles)).toBe(true);
    expect(res.body.totalCount).toBeGreaterThanOrEqual(1);
  });

  it("✅ 단일 게시글을 조회한다", async () => {
    const res = await request(app)
      .get(`/articles/${articleId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("테스트 게시글");
    expect(res.body).toHaveProperty("isLiked");
    expect(res.body).toHaveProperty("favoriteCount");
  });

  it("✅ 게시글을 수정한다", async () => {
    const res = await request(app)
      .patch(`/articles/${articleId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "수정된 제목",
        content: "수정된 내용",
        imageUrls: [
          "https://your-bucket.s3.ap-northeast-2.amazonaws.com/uploads/edited-article.jpg",
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe("수정된 제목");
  });

  it("✅ 게시글을 삭제한다", async () => {
    const res = await request(app)
      .delete(`/articles/${articleId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  it("✅ Presigned URL을 발급한다", async () => {
    const res = await request(app)
      .get("/articles/presigned-url")
      .query({
        fileName: "test.jpg",
        fileType: "image/jpeg",
      })
      .set("Authorization", `Bearer ${token}`);

    console.log("[TEST] res.status:", res.status);
    console.log("[TEST] res.body:", res.body);

    expect(res.status).toBe(200);
    expect(res.body.uploadUrl).toMatch(/^https:\/\/.+amazonaws\.com/);
    expect(res.body.fileUrl).toContain("/uploads/");
  });

  it("❌ 삭제된 게시글 조회 시 404 응답", async () => {
    const res = await request(app)
      .get(`/articles/${articleId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/게시글을 찾을 수 없습니다/);
  });
});
