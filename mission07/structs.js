import * as s from "superstruct";
import isEmail from "is-email";

// s.object는 객체를 정의하는 것
export const CreateUser = s.object({
  email: s.define("Email", isEmail), // "Email함수는 isEmail을 통과하는 값들"
  name: s.size(s.string(), 1, 30), // string 타입의 길이를 제한
  address: s.size(s.string(), 1, 100),
  age: s.min(s.max(s.number(), 100), 18), // 최소 18, 최대 100으로 제한
  userPreference: s.object({
    receiveEmail: s.boolean(),
  }),
});

export const CreateProduct = s.object({
  price: s.number(),
  description: s.size(s.string(),10,100),
  name: s.size(s.string(),1,10),
  tags: s.optional(s.array(s.string(),1,5))
})


export const PatchProduct = s.partial(CreateProduct);

