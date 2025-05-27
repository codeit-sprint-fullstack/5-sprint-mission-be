import { Request, Response, NextFunction } from "express";
import { generatePresignedUrl } from "../../aws/s3";

export const getPresignedUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileName, fileType } = req.query as {
      fileName: string;
      fileType: string;
    };

    const { uploadUrl, fileUrl } = await generatePresignedUrl(
      fileName,
      fileType
    );
    res.status(200).json({ uploadUrl, fileUrl });
  } catch (err) {
    next(err);
  }
};
