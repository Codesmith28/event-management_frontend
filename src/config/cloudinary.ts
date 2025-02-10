export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
};

if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
  console.error(
    "Cloudinary configuration is missing. Please check your environment variables."
  );
} 