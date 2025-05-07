import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_EXPIRES_IN?: string;
    FRONTEND_URL?: string;
    GOOGLE_CLIENT_ID?: string;
  }
}
