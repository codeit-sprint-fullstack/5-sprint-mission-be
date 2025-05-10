import request from "supertest";
import app from "../app";
import prisma from "../server/config/prismaClient";
import path from "path";

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
    const imagePath = path.join(__dirname, "fixtures", "test-image.jpg");
    const res = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "이미지 상품")
      .field("description", "설명")
      .field("price", "3000")
      .field("tags", '["image","테스트"]')
      .attach("images", imagePath);

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
    const newImagePath = path.join(__dirname, "fixtures", "test-image-2.jpg");
    const res = await request(app)
      .patch(`/products/${productId}`)
      .set("Authorization", `Bearer ${token}`)
      .field("name", "이미지 수정된 상품")
      .field("description", "이미지를 교체합니다.")
      .field("price", "4000")
      .field("tags", '["수정", "이미지"]')
      .attach("images", newImagePath);

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
