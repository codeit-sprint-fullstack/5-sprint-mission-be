import { UploadedImage } from "@/models/image";
import { SuccessResponse } from "@/types/response";
import createSuccessResponse from "@/utils/createSuccessResponse";

async function uploadImage(
  file: Express.Multer.File
): Promise<SuccessResponse<UploadedImage>> {
  const imageUrl = file.path;
  const publicId = file.filename;

  return createSuccessResponse<UploadedImage>(
    { imageUrl, publicId },
    "이미지가 업로드 되었습니다!"
  );
}

const imageService = {
  uploadImage,
};

export default imageService;
