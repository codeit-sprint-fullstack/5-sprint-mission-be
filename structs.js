// import * as s from "superstruct";
// // import isEmail from "is-email";

// // s.object는 객체를 정의하는 것
// export const CreateUser = s.object({
//   // email: s.define("Email", isEmail), // "Email함수는 isEmail을 통과하는 값들"
//   nickname: s.size(s.string(), 1, 30), // string 타입의 길이를 제한
//   title: s.size(s.string(), 1, 100),
//   content: s.size(s.string(), 1, 1000),
// });

// // 파셜 - CreateUser의 일부면 괜찮다
// export const PatchUser = s.partial(CreateUser);
