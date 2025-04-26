import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(2).max(30),
  content: z.string().min(10).max(100),
  imageUrls: z.array(z.string()).max(3).optional(),
});
