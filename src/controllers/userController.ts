import { UnauthorizedException } from "@/exceptions/UnauthorizedExceptions";
import { UserInfo } from "@/models/user";
import userService from "@/services/userService";
import { GetController } from "@/types/controller";
import { SuccessResponse } from "@/types/response";
import { ParamsDictionary } from "express-serve-static-core";

const getUserInfo: GetController<
  ParamsDictionary,
  Record<string, any>,
  SuccessResponse<UserInfo>
> = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    if (!userId) throw new UnauthorizedException();
    const result = await userService.getUserInfo(userId);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

const userController = {
  getUserInfo,
}

export default userController;

