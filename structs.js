import * as s from "superstruct";
import isEmail from "is-email";

export const RegisterStruct = s.object({
  email: s.define("Email", isEmail),
  nickname: s.size(s.string(), 2, 20),
  password: s.size(s.string(), 8, 100),
});

export const LoginStruct = s.object({
  email: s.define("Email", isEmail),
  password: s.size(s.string(), 8, 100),
});

// 파셜 - CreateUser의 일부면 괜찮다
export const PatchUser = s.partial(RegisterStruct);
