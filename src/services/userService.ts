import prisma from "@/config/database";
import { BadRequestException } from "@/exceptions/BadRequestExceptions";
import { UserInfo } from "@/models/user";
import { SuccessResponse } from "@/types/response";
import createSuccessResponse from "@/utils/createSuccessResponse";

async function getUserInfo (userId : number): Promise<SuccessResponse<UserInfo>> {
  const userInfo = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      profileImg: true,
      nickname: true,
    }
  })
  if(!userInfo) throw new BadRequestException('없는 사용자 입니다.');

  return createSuccessResponse<UserInfo>(userInfo, '유저 정보 조회에 성공했습니다.')
}

const userService = {
  getUserInfo,
}
export default userService;
