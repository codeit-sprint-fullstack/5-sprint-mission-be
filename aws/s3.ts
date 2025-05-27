import dotenv from "dotenv";
dotenv.config();

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./s3Client";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export const generatePresignedUrl = async (
  fileName: string,
  fileType: string
) => {
  const ext = path.extname(fileName);
  const key = `uploads/${uuidv4()}${ext}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // 5분

  return {
    uploadUrl,
    fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
  };
};
