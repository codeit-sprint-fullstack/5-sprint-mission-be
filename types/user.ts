export default interface UserCard {
  id: number;
  email: string;
  nickname: string;
  createdAt: Date;
  updatedAt: Date;
}

// Express의 User 타입 확장
declare global {
  namespace Express {
    interface User extends UserCard {} // Express.User를 우리가 만든 UserCard 타입으로 확장
  }
}