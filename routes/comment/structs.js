//유효성 검사해주는 라이브러리
import * as s from "superstruct";

/*
// 댓글
model Comment {
    id        String   @id @default(uuid())
    contents  String // 댓글 내용
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    userId    String // 댓글 글 쓴 정보
    WritingId String // 게시판 글 쓴 사람
    user      User     @relation(fields: [userId], references: [id])
    bulletinBoard   BulletinBoard  @relation(fields: [WritingId], references: [id])
}
*/

// 게시글 유효성 검사
export const validation = s.object({
  contents: s.size(s.string(), 1, 100), // string 타입의 길이를 제한
});
