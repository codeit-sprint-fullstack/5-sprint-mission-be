"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const dotenv_1 = __importDefault(require("dotenv"));
const prismaClient_1 = __importDefault(require("../server/config/prismaClient"));
dotenv_1.default.config({ path: ".env.test" });
jest.mock("google-auth-library", () => {
    return {
        OAuth2Client: jest.fn().mockImplementation(() => ({
            verifyIdToken: () => __awaiter(void 0, void 0, void 0, function* () {
                return ({
                    getPayload: () => ({
                        email: "googleuser@test.com",
                        name: "Google Tester",
                        picture: "https://test.com/profile.png",
                    }),
                });
            }),
        })),
    };
});
describe("Auth API", () => {
    const endpoint = "/auth/signup";
    it("✅ 유효한 회원가입 정보로 요청 시 201 응답과 유저 객체를 반환한다", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
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
    }));
    it("❌ 중복된 이메일로 요청 시 409 응답을 반환한다", () => __awaiter(void 0, void 0, void 0, function* () {
        const email = "duplicate@example.com";
        // 먼저 한 번 생성
        yield (0, supertest_1.default)(app_1.default).post(endpoint).send({
            email,
            password: "password123",
            nickname: "user1",
        });
        // 중복 요청
        const res = yield (0, supertest_1.default)(app_1.default).post(endpoint).send({
            email,
            password: "password123",
            nickname: "user2",
        });
        expect(res.status).toBe(409);
        expect(res.body.message).toMatch(/이미 사용 중인 이메일/);
    }));
    it("❌ 비밀번호가 누락된 경우 400 에러가 발생한다", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post(endpoint).send({
            email: "missingpw@example.com",
            nickname: "tester",
        });
        expect(res.status).toBe(400);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prismaClient_1.default.$disconnect();
    }));
});
describe("POST /auth/login", () => {
    const endpoint = "/auth/login";
    const testEmail = `loginuser${Date.now()}@example.com`;
    const testPassword = "password123";
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).post("/auth/signup").send({
            email: testEmail,
            password: testPassword,
            nickname: "로그인테스트유저",
        });
    }));
    it("✅ 유효한 로그인 정보로 요청 시 200 응답과 토큰을 반환한다", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post(endpoint).send({
            email: testEmail,
            password: testPassword,
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body).toHaveProperty("user");
    }));
    it("❌ 등록되지 않은 이메일로 로그인 시 401 에러 반환", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post(endpoint).send({
            email: "nonexistent@example.com",
            password: testPassword,
        });
        expect(res.status).toBe(401);
        expect(res.body.message).toMatch(/존재하지 않는/);
    }));
    it("❌ 비밀번호가 틀릴 경우 401 에러 반환", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post(endpoint).send({
            email: testEmail,
            password: "wrongpassword",
        });
        expect(res.status).toBe(401);
        expect(res.body.message).toMatch(/비밀번호/);
    }));
});
describe("POST /auth/refresh-token", () => {
    let cookies;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const email = `user${Date.now()}@test.com`;
        const password = "password123";
        yield (0, supertest_1.default)(app_1.default).post("/auth/signup").send({
            email,
            password,
            nickname: "토큰테스트",
        });
        const loginRes = yield (0, supertest_1.default)(app_1.default)
            .post("/auth/login")
            .send({ email, password });
        const rawCookies = loginRes.headers["set-cookie"];
        if (!rawCookies)
            throw new Error("Set-Cookie 누락");
        cookies = Array.isArray(rawCookies) ? rawCookies : [rawCookies];
    }));
    it("✅ 유효한 refreshToken으로 accessToken을 재발급받는다", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/auth/refresh-token")
            .set("Cookie", cookies);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
    }));
    it("❌ refreshToken이 없으면 401 에러가 발생한다", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post("/auth/refresh-token");
        expect(res.status).toBe(401);
        expect(res.body.message).toMatch(/리프레시 토큰이 존재하지 않습니다/);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prismaClient_1.default.$disconnect();
    }));
});
describe("POST /auth/google", () => {
    beforeAll(() => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => __awaiter(void 0, void 0, void 0, function* () {
                return ({
                    id_token: "mocked-id-token",
                });
            }),
        });
    });
    afterAll(() => {
        jest.resetAllMocks();
    });
    it("✅ 유효한 Google token으로 요청 시 200 응답과 유저 + 토큰을 반환한다", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post("/auth/google").send({
            code: "mocked-code",
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body.user.email).toBe("googleuser@test.com");
    }));
    it("❌ token이 없을 경우 400 에러를 반환한다", () => __awaiter(void 0, void 0, void 0, function* () {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: () => __awaiter(void 0, void 0, void 0, function* () {
                return ({
                    error: "invalid_grant",
                    error_description: "Bad Request",
                });
            }),
        });
        const res = yield (0, supertest_1.default)(app_1.default).post("/auth/google").send({
            code: "invalid-code",
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/구글 토큰 교환 실패/);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prismaClient_1.default.$disconnect();
    }));
});
