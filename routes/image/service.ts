const uploadImage = async (fileData: Express.Multer.File) => {
  return { path : `/uploads/${fileData.filename}`}
}

const service = {
  uploadImage,
}

export default service