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
/**
 * @swagger
 * components:
 *   schemas:
 *     Users:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - password
 *         - nickname
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 사용자의 고유 식별자 (자동 생성)
 *           example: 2e388cc5-8421-4cd3-98f7-befdb6d3b675
 *         email:
 *           type: string
 *           format: email
 *           description: 사용자 이메일 (고유값)
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: 사용자 비밀번호 (암호화되어 저장)
 *           example: hashedpassword123
 *         nickname:
 *           type: string
 *           description: 사용자 닉네임 (고유값)
 *           example: 판다마스터
 *         image:
 *           type: string
 *           nullable: true
 *           description: 사용자 프로필 이미지 URL
 *           example: https://example.com/profile.jpg
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 계정 생성 시간
 *           example: 2023-06-01T08:30:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 계정 정보 최종 수정 시간
 *           example: 2023-06-15T10:45:00Z
 *       example:
 *         id: 2e388cc5-8421-4cd3-98f7-befdb6d3b675
 *         email: user@example.com
 *         password: hashedpassword123
 *         nickname: 판다마스터
 *         image: https://example.com/profile.jpg
 *         createdAt: 2023-06-01T08:30:00Z
 *         updatedAt: 2023-06-15T10:45:00Z
 */
