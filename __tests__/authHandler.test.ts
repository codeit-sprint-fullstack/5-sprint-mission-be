import request from "supertest";
import jwt, { Secret } from "jsonwebtoken";
import app from "../app";
import prisma from "../server/config/prismaClient";
import { SignOptions } from "jsonwebtoken";

type Expiry = "1ms" | "10m" | "15m" | "1h" | "2h" | "7d" | "15m";

export const generateAccessToken = (id: string, expiresIn: Expiry = "1h") => {
  const options: SignOptions = { expiresIn };
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET as Secret, options);
};

export const generateRefreshToken = (id: string, expiresIn: Expiry = "7d") => {
  const options: SignOptions = { expiresIn };
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET as Secret, options);
};

describe("authHandler - validateUser 미들웨어", () => {
  let userId: string;
  let token: string;

  beforeAll(async () => {
    const email = `middleware${Date.now()}@example.com`;
    const password = "password123";

    const signupRes = await request(app).post("/auth/signup").send({
      email,
      password,
      nickname: "미들웨어유저",
    });

    userId = signupRes.body.user.id;
    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email, password });
    token = loginRes.body.accessToken;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("❌ 토큰이 없으면 401 반환", async () => {
    const res = await request(app).get("/users/me");
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/인증이 필요/);
  });

  it("❌ 잘못된 토큰이면 401 반환", async () => {
    const res = await request(app)
      .get("/users/me")
      .set("Authorization", "Bearer wrong.token.value");

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/토큰이 유효하지 않/);
  });

  it("❌ 유저가 삭제되었으면 401 반환", async () => {
    const accessToken = generateAccessToken(userId);
    await prisma.user.delete({ where: { id: userId } });

    const res = await request(app)
      .get("/users/me")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/토큰이 유효/);
  });

  it("❌ 만료된 AccessToken + 유효하지 않은 RefreshToken → 401", async () => {
    const email = `refreshfail${Date.now()}@test.com`;
    const password = "password123";
    const signupRes = await request(app)
      .post("/auth/signup")
      .send({ email, password, nickname: "실패유저" });
    const id = signupRes.body.user.id;

    const expiredAccess = generateAccessToken(id, "1ms");
    const badRefresh = "invalid.refresh.token";

    const res = await request(app)
      .get("/users/me")
      .set("Authorization", `Bearer ${expiredAccess}`)
      .set("Cookie", [`refreshToken=${badRefresh}`]);

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/유효하지 않거나 만료/);
  });

  it("✅ Google OAuth 토큰 분기 커버", async () => {
    // 테스트용 구글 사용자 DB에 생성
    const email = `googleuser${Date.now()}@gmail.com`;
    const user = await prisma.user.create({
      data: {
        email,
        nickname: "구글유저",
        encryptedPassword: "google-oauth",
      },
    });

    // Google 방식 헤더로 요청
    const res = await request(app)
      .get("/users/me")
      .set("Authorization", `Bearer google dummy-token`)
      .expect(401); // 실제 검증 실패로 빠지긴 하지만 분기 커버됨

    expect(res.body.message).toMatch(/구글 토큰 검증 실패/);
  });

  it("✅ 알 수 없는 에러 → 마지막 catch 진입 (500 또는 401)", async () => {
    const res = await request(app)
      .get("/users/me")
      .set("Authorization", "Bearer"); // 빈 토큰 → jwt.verify()에서 TypeError

    expect(res.status).toBe(401);
  });
});
