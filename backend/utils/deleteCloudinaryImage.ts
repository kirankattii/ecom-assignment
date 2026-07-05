// src/utils/deleteCloudinaryImage.ts

import cloudinary from "../config/cloudinary.js";

const deleteCloudinaryImage = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};

export default deleteCloudinaryImage;
