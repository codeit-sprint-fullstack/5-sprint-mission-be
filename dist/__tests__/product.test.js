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
const prismaClient_1 = __importDefault(require("../server/config/prismaClient"));
const path_1 = __importDefault(require("path"));
describe("Product API 전체 흐름 테스트", () => {
    let token = "";
    let productId;
    const userEmail = `testuser${Date.now()}@example.com`;
    const userPassword = "password123";
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // 회원가입
        yield (0, supertest_1.default)(app_1.default).post("/auth/signup").send({
            email: userEmail,
            password: userPassword,
            nickname: "테스트유저",
        });
        // 로그인 → accessToken 추출
        const loginRes = yield (0, supertest_1.default)(app_1.default).post("/auth/login").send({
            email: userEmail,
            password: userPassword,
        });
        token = loginRes.body.accessToken;
        if (!token)
            throw new Error("accessToken 누락");
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prismaClient_1.default.$disconnect();
    }));
    it("✅ 상품을 생성한다", () => __awaiter(void 0, void 0, void 0, function* () {
        const imagePath = path_1.default.join(__dirname, "fixtures", "test-image.jpg");
        const res = yield (0, supertest_1.default)(app_1.default)
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
    }));
    it("✅ 전체 상품 목록을 가져온다", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get("/products");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.products)).toBe(true);
        expect(res.body.products.length).toBeGreaterThan(0);
    }));
    it("✅ 단일 상품을 조회한다", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get(`/products/${productId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("name");
        expect(res.body).toHaveProperty("isLiked");
    }));
    it("✅ 상품을 수정한다", () => __awaiter(void 0, void 0, void 0, function* () {
        const newImagePath = path_1.default.join(__dirname, "fixtures", "test-image-2.jpg");
        const res = yield (0, supertest_1.default)(app_1.default)
            .patch(`/products/${productId}`)
            .set("Authorization", `Bearer ${token}`)
            .field("name", "이미지 수정된 상품")
            .field("description", "이미지를 교체합니다.")
            .field("price", "4000")
            .field("tags", '["수정", "이미지"]')
            .attach("images", newImagePath);
        expect(res.status).toBe(200);
        expect(res.body.name).toBe("이미지 수정된 상품");
    }));
    it("✅ 상품을 삭제한다", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete(`/products/${productId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(204);
    }));
    it("❌ 삭제된 상품 조회 시 404 응답", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get(`/products/${productId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toMatch(/상품을 찾을 수 없습니다/);
    }));
});
