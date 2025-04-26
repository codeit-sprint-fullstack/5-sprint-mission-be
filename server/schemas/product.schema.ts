import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().nonnegative(),
  tags: z.array(z.string()).optional(),
  imageUrls: z.array(z.string()).max(3).optional(),
});
