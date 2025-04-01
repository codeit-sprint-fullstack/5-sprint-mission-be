import { PrismaClient } from "@prisma/client";

// 싱글톤 패턴으로 Prisma Client 인스턴스 생성
const prisma = new PrismaClient();

export default prisma;
