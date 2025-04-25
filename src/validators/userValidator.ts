import { z } from "zod";

export const userCreateSchema = z.object({
  email: z.string().email({ message: "유효한 이메일을 입력해주세요." }),
  nickname: z.string().min(1, { message: "닉네임은 1자 이상이어야 합니다." }),
  password: z
    .string()
    .min(8, { message: "비밀번호 길이는 최소 8자 이상이어야 합니다." })
    .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
    .max(20, { message: "비밀번호는 최대 20자 이하여야 합니다." })
    .regex(/[a-z]/, { message: "소문자를 포함해야 합니다." })
    .regex(/[0-9]/, { message: "숫자를 포함해야 합니다." })
    .regex(/[^A-Za-z0-9]/, { message: "특수문자를 포함해야 합니다." }),
});

export const userLoginSchema = z.object({
  email: z.string().email({ message: "유효한 이메일을 입력해주세요." }),
  password: z
    .string()
    .min(8, { message: "비밀번호 길이는 최소 8자 이상이어야 합니다." })
    .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
    .max(20, { message: "비밀번호는 최대 20자 이하여야 합니다." })
    .regex(/[a-z]/, { message: "소문자를 포함해야 합니다." })
    .regex(/[0-9]/, { message: "숫자를 포함해야 합니다." })
    .regex(/[^A-Za-z0-9]/, { message: "특수문자를 포함해야 합니다." }),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;
