import * as s from "superstruct";
import isUuid from "is-uuid";
import { TargetType } from "@prisma/client";

export const createCommentValidation = s.object({
  targetId: s.define("targetId", (value) => isUuid.v4(value)),
  targetType: s.enums(Object.values(TargetType)),
  content: s.size(s.string(), 1, Infinity),
});

export const updateCommentValidation = s.object({
  content: s.size(s.string(), 1, Infinity),
});
