import { z } from "zod";

export const getArticleListQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default("1") // 기본값: "1"
    .refine((val) => /^\d+$/.test(val), {
      message: "페이지 쿼리 값은 숫자 형식이어야 합니다.",
    }),
  pageSize: z
    .string()
    .optional()
    .default("10") // 기본값: "10"
    .refine((val) => /^\d+$/.test(val), {
      message: "페이지 사이즈 값은 숫자 형식이어야 합니다.",
    }),
  keyword: z.string().optional(),
  orderBy: z.string().optional(),
});

export const articleParamSchema = z.object({
  id: z.string().refine((val) => /^\d+$/.test(val), {
    message: "id 값은 숫자 형식이어야 합니다.",
  }),
});

export const articlePostAndPatchBodySchema = z.object({
  title: z
    .string()
    .min(1, "제목은 최소 1자 이상이어야 합니다.")
    .max(50, "제목은 최대 50자 이하이어야 합니다."),
  content: z.string().min(1, "내용을 입력해주세요."),
  img: z.array(z.string().url("유효한 URL 형식이어야 합니다.")).optional(),
});

export type getArticleListQuery = z.infer<typeof getArticleListQuerySchema>;
export type articleParam = z.infer<typeof articleParamSchema>;
export type articlePostAndPatchBody = z.infer<typeof articlePostAndPatchBodySchema>;
