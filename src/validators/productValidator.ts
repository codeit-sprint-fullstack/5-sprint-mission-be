import { z } from "zod";

export const getProductListQuerySchema = z.object({
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

export const productParamSchema = z.object({
  id: z.string().refine((val) => /^\d+$/.test(val), {
    message: "id 값은 숫자 형식이어야 합니다.",
  }),
});

export const productPostAndPatchBodySchema = z.object({
  name: z
    .string()
    .min(1, "상품 이름은 최소 1자 이상이어야 합니다.")
    .max(50, "상품 이름은 최대 30자 이하이어야 합니다."),
  description: z.string().min(1, "상품 설명을 입력해주세요."),
  images: z.array(z.string().url("유효한 URL 형식이어야 합니다.")).optional(),
  price: z
    .string()
    .regex(/^\d+$/, "가격은 숫자로만 입력해야 합니다.")
    .refine((val) => Number(val) >= 0, "가격은 0 이상이어야 합니다."),
  tags: z.array(
    z
      .string()
      .min(1, "태그는 공백일 수 없습니다.")
      .max(5, "태그는 5자이하이어야 합니다.")
  ),
});

export type getProductListQuery = z.infer<typeof getProductListQuerySchema>;
export type productParam = z.infer<typeof productParamSchema>;
export type productPostAndPatchBody = z.infer<typeof productPostAndPatchBodySchema>;
