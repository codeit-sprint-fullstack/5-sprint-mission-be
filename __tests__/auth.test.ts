import request from "supertest";
import app from "../app";
import dotenv from "dotenv";
import prisma from "../server/config/prismaClient";
dotenv.config({ path: ".env.test" });

jest.mock("google-auth-library", () => {
  return {
    OAuth2Client: jest.fn().mockImplementation(() => ({
      verifyIdToken: async () => ({
        getPayload: () => ({
          email: "googleuser@test.com",
          name: "Google Tester",
          picture: "https://test.com/profile.png",
        }),
      }),
    })),
  };
});

describe("Auth API", () => {
  const endpoint = "/auth/signup";

  it("✅ 유효한 회원가입 정보로 요청 시 201 응답과 유저 객체를 반환한다", async () => {
    const res = await request(app)
      .post(endpoint)
      .send({
        email: "test" + Date.now() + "@example.com",
        password: "password123",
        nickname: "테스트유저",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", expect.stringContaining("@"));
    expect(res.body.user).toHaveProperty("nickname", "테스트유저");
  });

  it("❌ 중복된 이메일로 요청 시 409 응답을 반환한다", async () => {
    const email = "duplicate@example.com";

    // 먼저 한 번 생성
    await request(app).post(endpoint).send({
      email,
      password: "password123",
      nickname: "user1",
    });

    // 중복 요청
    const res = await request(app).post(endpoint).send({
      email,
      password: "password123",
      nickname: "user2",
    });

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/이미 사용 중인 이메일/);
  });

  it("❌ 비밀번호가 누락된 경우 400 에러가 발생한다", async () => {
    const res = await request(app).post(endpoint).send({
      email: "missingpw@example.com",
      nickname: "tester",
    });

    expect(res.status).toBe(400);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});

describe("POST /auth/login", () => {
  const endpoint = "/auth/login";
  const testEmail = `loginuser${Date.now()}@example.com`;
  const testPassword = "password123";

  beforeAll(async () => {
    await request(app).post("/auth/signup").send({
      email: testEmail,
      password: testPassword,
      nickname: "로그인테스트유저",
    });
  });

  it("✅ 유효한 로그인 정보로 요청 시 200 응답과 토큰을 반환한다", async () => {
    const res = await request(app).post(endpoint).send({
      email: testEmail,
      password: testPassword,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("user");
  });

  it("❌ 등록되지 않은 이메일로 로그인 시 401 에러 반환", async () => {
    const res = await request(app).post(endpoint).send({
      email: "nonexistent@example.com",
      password: testPassword,
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/존재하지 않는/);
  });

  it("❌ 비밀번호가 틀릴 경우 401 에러 반환", async () => {
    const res = await request(app).post(endpoint).send({
      email: testEmail,
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/비밀번호/);
  });
});

describe("POST /auth/refresh-token", () => {
  let cookies: string[];

  beforeAll(async () => {
    const email = `user${Date.now()}@test.com`;
    const password = "password123";

    await request(app).post("/auth/signup").send({
      email,
      password,
      nickname: "토큰테스트",
    });

    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email, password });

    const rawCookies = loginRes.headers["set-cookie"];
    if (!rawCookies) throw new Error("Set-Cookie 누락");
    cookies = Array.isArray(rawCookies) ? rawCookies : [rawCookies];
  });

  it("✅ 유효한 refreshToken으로 accessToken을 재발급받는다", async () => {
    const res = await request(app)
      .post("/auth/refresh-token")
      .set("Cookie", cookies);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

  it("❌ refreshToken이 없으면 401 에러가 발생한다", async () => {
    const res = await request(app).post("/auth/refresh-token");
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/리프레시 토큰이 존재하지 않습니다/);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});

describe("POST /auth/google", () => {
  beforeAll(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id_token: "mocked-id-token",
      }),
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("✅ 유효한 Google token으로 요청 시 200 응답과 유저 + 토큰을 반환한다", async () => {
    const res = await request(app).post("/auth/google").send({
      code: "mocked-code",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body.user.email).toBe("googleuser@test.com");
  });

  it("❌ token이 없을 경우 400 에러를 반환한다", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: "invalid_grant",
        error_description: "Bad Request",
      }),
    });

    const res = await request(app).post("/auth/google").send({
      code: "invalid-code",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/구글 토큰 교환 실패/);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
