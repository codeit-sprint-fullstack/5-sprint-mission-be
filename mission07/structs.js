import * as s from "superstruct";
import isEmail from "is-email";
import isUuid from "is-uuid";

const Uuid = s.define("Uuid", (value) => isUuid.v4(value));

export const CreateUser = s.object({
  email: s.define("Email", isEmail), // 이메일: email
  password: s.size(s.string(), 8, 100), // 비밀번호: min length 8
  nick: s.size(s.string(), 1, 6), // 닉네임: max length 6
});
export const PatchUser = s.partial(CreateUser);

export const CreateProduct = s.object({
  name: s.size(s.string(), 1, 10), // 상품명: max length 10
  description: s.size(s.string(), 10, 100), // 설명: size 10 ~ 100
  price: s.min(s.number(), 0),
  tags: s.array(s.string()), // 태그: String array
});
export const PatchProduct = s.partial(CreateProduct);

export const CreateArticle = s.object({
  title: s.size(s.string(), 1, 10), // 제목: max length 10
  content: s.size(s.string(), 10, 100), // 내용: size 10 ~ 100
  images: s.array(s.string()), // 이미지: String array
});
export const PatchArticle = s.partial(CreateArticle);

export const CreateComment = s.object({
  content: s.size(s.string(), 1, 100), // 내용: size 1 ~ 100
});
export const PatchComment = s.partial(CreateComment);
