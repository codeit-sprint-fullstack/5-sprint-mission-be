"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
// 싱글톤 패턴으로 Prisma Client 인스턴스 생성
const prisma = new client_1.PrismaClient();
exports.default = prisma;
