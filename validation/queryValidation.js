import * as s from "superstruct";

export const productListQueryValidation = s.object({
  sort: s.optional(s.enums(["recent", "favorite"])),
  offset: s.optional(s.size(s.integer(), 0, Infinity)),
  limit: s.optional(s.size(s.integer(), 0, Infinity)),
  keyword: s.optional(s.string()),
});

export const articleListQueryValidation = s.object({
  sort: s.optional(s.enums(["recent", "favorite"])),
  offset: s.optional(s.size(s.integer(), 0, Infinity)),
  limit: s.optional(s.size(s.integer(), 0, Infinity)),
  keyword: s.optional(s.string()),
});
