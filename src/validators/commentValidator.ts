import { z } from "zod";

export const commentQuerySchema = z.object({
  pageSize: z
    .string()
    .optional()
    .default("5") // 기본값: "10"
    .refine((val) => /^\d+$/.test(val), {
      message: "페이지 사이즈 값은 숫자 형식이어야 합니다.",
    }),
  cursor: z.string().refine((val) => /^\d+$/.test(val), {
    message: "cursor는 숫자여야 합니다.",
  }).optional(),
});

export const commentParamSchema = z.object({
  productId: z.string().refine((val) => /^\d+$/.test(val), {
    message: "productId는 숫자여야 합니다.",
  }).optional(),

  articleId: z.string().refine((val) => /^\d+$/.test(val), {
    message: "articleId는 숫자여야 합니다.",
  }).optional(),

  id: z.string().refine((val) => /^\d+$/.test(val), {
    message: "id는 숫자여야 합니다.",
  }).optional(),
}).refine(
  (data) =>
    !(data.productId && data.articleId),
  {
    message: "productId 또는 articleId 중 하나만 있어야 합니다.",
    path: ["productId,articleId"]
  }
);

export const commentBodySchema = z.object({
  content: z.string().min(1, '댓글의 내용을 입력해주세요.')
})

export type commentParam = z.infer<typeof commentParamSchema>;
export type commentQuery = z.infer<typeof commentQuerySchema>;
export type commentBody = z.infer<typeof commentBodySchema>;
