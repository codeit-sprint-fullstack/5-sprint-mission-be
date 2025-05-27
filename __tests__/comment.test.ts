import request from "supertest";
import app from "../app";
import prisma from "../server/config/prismaClient";

describe("Comment API 흐름 테스트", () => {
  let token: string = "";
  let userId: string;
  let productId: string;
  let commentId: string;

  const email = `test-comment-${Date.now()}@example.com`;
  const password = "commentTest123";

  beforeAll(async () => {
    // 유저 생성 및 로그인
    await request(app).post("/auth/signup").send({
      email,
      password,
      nickname: "댓글유저",
    });

    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email, password });
    token = loginRes.body.accessToken;
    userId = loginRes.body.user.id;

    // 테스트용 상품 생성
    const productRes = await prisma.product.create({
      data: {
        name: "댓글 테스트 상품",
        description: "설명",
        price: 1000,
        tags: [],
        imageUrls: [],
        userId,
      },
    });

    productId = productRes.id;
  });

  afterAll(async () => {
    await prisma.comment.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("✅ 댓글을 생성한다", async () => {
    const res = await request(app)
      .post(`/products/${productId}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "첫 번째 댓글입니다." });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("content", "첫 번째 댓글입니다.");
    expect(res.body.data).toHaveProperty("user");

    commentId = res.body.data.id;
  });

  it("✅ 상품 댓글 목록을 조회한다", async () => {
    const res = await request(app).get(`/products/${productId}/comments`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("✅ 댓글을 수정한다", async () => {
    const res = await request(app)
      .patch(`/comments/${commentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "수정된 댓글입니다." });

    expect(res.status).toBe(200);
    expect(res.body.data.content).toBe("수정된 댓글입니다.");
  });

  it("✅ 댓글을 삭제한다", async () => {
    const res = await request(app)
      .delete(`/comments/${commentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  it("❌ 삭제된 댓글 수정 시 404 응답", async () => {
    const res = await request(app)
      .patch(`/comments/${commentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "이건 실패할 수정입니다." });

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/댓글을 찾을 수 없습니다/);
  });
});
