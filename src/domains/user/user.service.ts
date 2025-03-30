import prisma from "../../utils/prismaClient";

/**
 * 사용자 ID로 사용자 정보 조회
 * @param userId 사용자 ID
 * @returns 사용자 정보 (nickname 포함)
 */
export const getUserById = async (userId: string) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nickname: true,
      },
    });

    return user;
  } catch (error) {
    console.error("❌ 사용자 조회 중 오류 발생:", error);
    throw new Error("사용자 조회 실패");
  }
};
