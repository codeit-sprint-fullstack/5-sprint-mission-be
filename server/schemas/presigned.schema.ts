import { z } from "zod";

export const presignedUrlSchema = z.object({
  fileName: z.string().min(1),
  fileType: z
    .string()
    .refine(
      (type) => ["image/jpeg", "image/png", "image/webp"].includes(type),
      { message: "지원하지 않는 파일 형식입니다." }
    ),
});

export type PresignedUrlQuery = z.infer<typeof presignedUrlSchema>;
