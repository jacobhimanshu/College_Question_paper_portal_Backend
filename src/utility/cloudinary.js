import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const UploadOnCloudinary = async (localfilepath) => {
  try {
    // 🛑 If file doesn't exist, skip upload
    if (!localfilepath || !fs.existsSync(localfilepath)) {
      console.log("File does not exist. Skipping upload.");
      return null;
    }

    const response = await cloudinary.uploader.upload(localfilepath, {
      folder: "himanshu",
  resource_type: "raw",
  type: "upload", // ✅ this is critical
  upload_preset: 'ml_default',
    access_mode: "public",
    });

    console.log(
      "File has been uploaded successfully to Cloudinary:",
      response.secure_url
    );

    // ✅ Optional: delete the local file after upload
    fs.unlinkSync(localfilepath);

    return response;
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);
    if (fs.existsSync(localfilepath)) {
      fs.unlinkSync(localfilepath); // Delete even on error
    }
    return null;
  }
};

export default UploadOnCloudinary;



