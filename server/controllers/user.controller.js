import prisma from "../config/prismaClient.js";

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user)
      return next({ status: 404, message: "사용자를 찾을 수 없습니다." });

    res.json(user);
  } catch (error) {
    next(error);
  }
};
