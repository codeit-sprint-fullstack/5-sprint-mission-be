import {Request, Response, NextFunction} from "express";

export default (err: any, req: Request, res: Response, next: NextFunction): void => {
    console.log(err);
    res.status(500).json({ message: "500에러" });
}