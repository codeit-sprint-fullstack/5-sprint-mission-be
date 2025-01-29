import * as s from "superstruct";
import isUuid from "is-uuid";

export const productValidation = s.object({
  name: s.size(s.string(), 1, 10),
  description: s.size(s.string(), 10, 100),
  price: s.number(),
  tags: s.size(s.array(s.string()), 1, Infinity),
  images: s.array(s.string()), // 빈 배열일 경우에도 유효성 검사 통과
});

export const idValidation = s.define("id", isUuid);

export const queryValidation = s.object({
  sort: s.optional(s.enums(["resent", "favorite"])),
  offset: s.optional(s.size(s.number(), 0, Infinity)),
  limit: s.optional(s.size(s.number(), 0, Infinity)),
  keyword: s.optional(s.string()),
});
