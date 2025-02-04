import * as s from "superstruct";

export const createProductValidation = s.object({
  name: s.size(s.string(), 1, 10),
  description: s.size(s.string(), 10, 100),
  price: s.number(),
  tags: s.size(s.array(s.string()), 1, Infinity),
  images: s.array(s.string()), // 빈 배열일 경우에도 유효성 검사 통과
});

export const updateProductValidation = s.object({
  name: s.optional(s.size(s.string(), 1, 10)),
  description: s.optional(s.size(s.string(), 10, 100)),
  price: s.optional(s.number()),
  tags: s.optional(s.size(s.array(s.string()), 1, Infinity)),
  images: s.optional(s.array(s.string())), // 빈 배열일 경우에도 유효성 검사 통과
});
