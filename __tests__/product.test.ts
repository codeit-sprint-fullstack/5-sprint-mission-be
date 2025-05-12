import dotenv from "dotenv";
dotenv.config();

import request from "supertest";
import app from "../app";
import prisma from "../server/config/prismaClient";

describe("Product API 전체 흐름 테스트", () => {
  let token: string = "";
  let productId: string;
  const userEmail = `testuser${Date.now()}@example.com`;
  const userPassword = "password123";

  beforeAll(async () => {
    // 회원가입
    await request(app).post("/auth/signup").send({
      email: userEmail,
      password: userPassword,
      nickname: "테스트유저",
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
    await prisma.$disconnect();
  });

  it("✅ 상품을 생성한다", async () => {
    const res = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "이미지 상품",
        description: "설명",
        price: 3000,
        tags: ["image", "테스트"],
        imageUrls: [
          "https://your-bucket.s3.ap-northeast-2.amazonaws.com/uploads/test-image.jpg",
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");

    productId = res.body.id;
  });

  it("✅ 전체 상품 목록을 가져온다", async () => {
    const res = await request(app).get("/products");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body.products.length).toBeGreaterThan(0);
  });

  it("✅ 단일 상품을 조회한다", async () => {
    const res = await request(app)
      .get(`/products/${productId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("isLiked");
  });

  it("✅ 상품을 수정한다", async () => {
    const res = await request(app)
      .patch(`/products/${productId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "이미지 수정된 상품",
        description: "이미지를 교체합니다.",
        price: 4000,
        tags: ["수정", "이미지"],
        imageUrls: [
          "https://your-bucket.s3.ap-northeast-2.amazonaws.com/uploads/test-image-2.jpg",
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("이미지 수정된 상품");
  });

  it("✅ 상품을 삭제한다", async () => {
    const res = await request(app)
      .delete(`/products/${productId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  it("❌ 삭제된 상품 조회 시 404 응답", async () => {
    const res = await request(app)
      .get(`/products/${productId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/상품을 찾을 수 없습니다/);
  });
});

describe("❌ 실패 케이스 테스트", () => {
  let token: string = "";
  const userEmail = `testuser${Date.now()}@example.com`;
  const userPassword = "password123";

  beforeAll(async () => {
    // 회원가입
    await request(app).post("/auth/signup").send({
      email: userEmail,
      password: userPassword,
      nickname: "테스트유저",
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
    await prisma.$disconnect();
  });
  it("❌ 로그인 없이 상품 생성 시 401 반환", async () => {
    const res = await request(app)
      .post("/products")
      .field("name", "비로그인 상품")
      .field("description", "설명")
      .field("price", "3000");

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/인증이 필요/);
  });

  it("❌ 잘못된 UUID로 상품 조회 시 400 반환", async () => {
    const res = await request(app)
      .get("/products/not-a-uuid")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Invalid id/);
  });

  it("❌ 존재하지 않는 상품 수정 시 404", async () => {
    const fakeId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
    const res = await request(app)
      .patch(`/products/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .field("name", "수정불가")
      .field("description", "없음")
      .field("price", "3000");

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/상품을 찾을 수 없습니다/);
  });

  it("❌ 권한 없는 사용자가 상품 삭제 시 403", async () => {
    // 다른 유저 생성
    const anotherEmail = `another${Date.now()}@example.com`;
    const password = "password123";

    await request(app).post("/auth/signup").send({
      email: anotherEmail,
      password,
      nickname: "타인",
    });

    const loginRes = await request(app).post("/auth/login").send({
      email: anotherEmail,
      password,
    });

    const anotherToken = loginRes.body.accessToken;

    // 상품 생성
    const productRes = await prisma.product.create({
      data: {
        name: "타인상품",
        description: "설명",
        price: 1234,
        imageUrls: [],
        tags: [],
        userId: token
          ? (await prisma.user.findFirst({ where: { email: userEmail } }))!.id
          : "",
      },
    });

    const res = await request(app)
      .delete(`/products/${productRes.id}`)
      .set("Authorization", `Bearer ${anotherToken}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/권한이 없습니다/);
  });
});
