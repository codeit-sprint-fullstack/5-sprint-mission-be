import request from "supertest";
import app from "../app";
import prisma from "../server/config/prismaClient";

describe("User API - GET /users/me/:id", () => {
  let token: string = "";
  let userId: string;
  const userEmail = `test-user${Date.now()}@example.com`;
  const userPassword = "password123";

  beforeAll(async () => {
    // 회원가입
    await request(app).post("/auth/signup").send({
      email: userEmail,
      password: userPassword,
      nickname: "테스트유저",
    });

    // 로그인 → 토큰 추출
    const loginRes = await request(app).post("/auth/login").send({
      email: userEmail,
      password: userPassword,
    });

    token = loginRes.body.accessToken;
    userId = loginRes.body.user.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("✅ 유저 정보를 정상적으로 조회한다", async () => {
    const res = await request(app)
      .get(`/users/me`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("email", userEmail);
    expect(res.body).toHaveProperty("nickname", "테스트유저");
  });

  it("❌ 토큰 없이 요청하면 401 응답", async () => {
    const res = await request(app).get(`/users/me`);
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/인증이 필요/);
  });

  it("❌ 존재하지 않는 유저 조회 시 404", async () => {
    // 유효한 토큰을 사용하지만 DB에서 유저를 삭제한 후 요청
    await prisma.user.delete({ where: { id: userId } });

    const res = await request(app)
      .get(`/users/me`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/유효하지 않은/);
  });
});
