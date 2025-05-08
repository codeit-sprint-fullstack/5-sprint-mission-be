import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log('PostgreSQL에 연결되었습니다.');
  } catch (error) {
    console.error('데이터베이스 연결 실패: ',error);
    process.exit(1);
  }
}

export default prisma;