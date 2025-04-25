import { BadRequestException } from "@/exceptions/BadRequestExceptions";
import { UploadedImage } from "@/models/image";
import imageService from "@/services/imageService";
import { PostController } from "@/types/controller";
import { SuccessResponse } from "@/types/response";

const uploadImage: PostController<
  {},
  UploadRequestBody,
  SuccessResponse<UploadedImage>
> = async (req, res, next) => {
  try {
    if (!req.file) throw new BadRequestException('업로드할 이미지를 등록해주세요.')
    const result = await imageService.uploadImage(req.file);
    res.status(200).send(result);
  } catch (err) {
    next(err)
  }
};

const imageController = {
  uploadImage,
}

export default imageController;