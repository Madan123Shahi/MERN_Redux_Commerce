import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, transformation: [{ width: 300, height: 300, crop: "fill" }] },
      (error, result) => (result ? resolve(result) : reject(error))
    );
    Readable.from(buffer).pipe(stream);
  });
};

/* Delete an image from Cloudinary
 * @param {string} publicId - The unique ID of the image
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;

    // Cloudinary's built-in destroy method
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    throw new Error("Failed to delete image from cloud storage");
  }
};
