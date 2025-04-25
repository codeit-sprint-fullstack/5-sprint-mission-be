import { z } from "zod";

export const likeParamSchema = z
  .object({
    productId: z
      .string()
      .refine((val) => /^\d+$/.test(val), {
        message: "productId는 숫자여야 합니다.",
      })
      .optional(),

    articleId: z
      .string()
      .refine((val) => /^\d+$/.test(val), {
        message: "articleId는 숫자여야 합니다.",
      })
      .optional(),
  })
  .refine((data) => !(data.productId && data.articleId), {
    message: "productId 또는 articleId 중 하나만 있어야 합니다.",
    path: ["productId,articleId"],
  });

export type likeParam = z.infer<typeof likeParamSchema>;
