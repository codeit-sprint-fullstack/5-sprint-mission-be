import { Request, Response } from "express";
import prisma from "../../prismaClient.js";

const getUser = async (req: Request, res: Response) => {
  const user = req.user;
  const userData = await prisma.user.findUnique({
    where: {
      id: user?.id,
    }
  })
  if(!userData){
    res.status(401).send({message : "사용자 인증 에러"});
    return;
  }
  const {refreshToken, encryptedPassword, ...withOutImportantData} = userData;
  res.status(200).send(withOutImportantData);
  
}

const service = {
  getUser,
}

export default service;