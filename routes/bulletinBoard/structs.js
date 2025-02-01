//유효성 검사해주는 라이브러리
import * as s from "superstruct";

/*
model Writing {
    id        String    @id @default(uuid())
    title     String // 제목
    contents  String // 게시글 내용
    img       String // 게시글 이미지
    like      Int // 찜? 좋아요 받은 갯수
    createdAt DateTime  @default(now())
    updatedAt DateTime  @updatedAt
    userId    String // 유저 정보
    comment   Comment[]
    user      User      @relation(fields: [userId], references: [id])
}
*/

// 게시글 유효성 검사
export const validation = s.object({
  title: s.size(s.string(), 1, 30), // string 타입의 길이를 제한
  contents: s.size(s.string(), 1, 100), // string 타입의 길이를 제한
});
