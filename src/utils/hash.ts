import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// 비밀번호 해싱 처리 함수
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// 비밀번호 검증 함수 (해싱 된 것, 해싱 되지 않은 것)
export const comparePassword = async (password:string, hashedPassword:string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
}