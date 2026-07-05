// src/services/cloudinary.service.ts
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
export const uploadImage = (file, folder = "products") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder,
            resource_type: "image",
        }, (error, result) => {
            if (error) {
                console.error("❌ Cloudinary upload callback error:", error);
                return reject(error);
            }
            if (!result) {
                return reject(new Error("Cloudinary upload failed."));
            }
            resolve({
                url: result.secure_url,
                publicId: result.public_id,
            });
        });
        // Handle stream-level errors
        uploadStream.on("error", (error) => {
            console.error("❌ Cloudinary upload stream error:", error);
            reject(error);
        });
        const readStream = streamifier.createReadStream(file.buffer);
        readStream.on("error", (error) => {
            console.error("❌ Streamifier read stream error:", error);
            reject(error);
        });
        readStream.pipe(uploadStream);
    });
};
export const uploadMultipleImages = async (files, folder = "products") => {
    const uploadedImages = await Promise.all(files.map((file) => uploadImage(file, folder)));
    return uploadedImages;
};
export const deleteImage = async (publicId) => {
    await cloudinary.uploader.destroy(publicId);
};
export const deleteMultipleImages = async (publicIds) => {
    await Promise.all(publicIds.map((id) => cloudinary.uploader.destroy(id)));
};
