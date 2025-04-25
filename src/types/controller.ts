import { Request, Response, NextFunction } from 'express';
import { ParsedQs } from 'qs';
// GET 요청용 컨트롤러
export type GetController<P, Q, D> = (
  req: Request<P, any, any, Q>, // Body는 없음
  res: Response<D>,
  next: NextFunction
) => Promise<void>;

// POST 요청용 컨트롤러
export type PostController<P, B, D> = (
  req: Request<P, any, B, ParsedQs>, // Query는 없음
  res: Response<D>,
  next: NextFunction
) => Promise<void>;

// PATCH 요청용 컨트롤러
export type PatchController<P, B, D> = (
  req: Request<P, any, B>, // Query는 없음
  res: Response<D>,
  next: NextFunction
) => Promise<void>;

// DELETE 요청용 컨트롤러
export type DeleteController<P, Q, D> = (
  req: Request<P, any, any, Q>, // Body는 없음
  res: Response<D>,
  next: NextFunction
) => Promise<void>;