import * as s from "superstruct";
import isUuid from "is-uuid";

export const productIdParamValidation = s.define("Id", (value) =>
  isUuid.v4(value)
);

export const articleIdParamValidation = s.define("Id", (value) =>
  isUuid.v4(value)
);
