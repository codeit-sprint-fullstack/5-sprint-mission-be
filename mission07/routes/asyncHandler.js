import jwt from "jsonwebtoken"; // JWT import
import { Prisma } from "@prisma/client";

export default function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (
        e.name === "StructError" ||
        e instanceof Prisma.PrismaClientValidationError
      ) {
        res.status(400).send({ message: e.message });
      } else if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        res.sendStatus(404);
      } else if (e instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}
