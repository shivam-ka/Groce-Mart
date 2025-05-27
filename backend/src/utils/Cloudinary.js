import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (filePath) => {
    try {
        if (!filePath) return;

        const response = await cloudinary.uploader.upload(filePath, { resource_type: "auto" })
        return response;
    } catch (error) {
        console.log(error)
    }
}

const deleteOnCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('deleteOnCloudinary:', error);
    }
}

export { uploadOnCloudinary, deleteOnCloudinary }