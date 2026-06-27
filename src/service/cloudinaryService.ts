/* eslint-disable @typescript-eslint/no-explicit-any */

import cloudinary from '../config/cloudinary.js';
import logger from '../lib/logger.js';

export const uploadFileToCloudinary = async (
  filePath: string,
  folderName?: string,
) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName || 'others', // optional: Cloudinary folder
      resource_type: 'auto', // auto-detect image/video
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error: Error | any) {
    logger.info(`Error uploading ${filePath} to Cloudinary: ${error.message}`);
    throw error;
  }
};

// Example usage:
export const generateCloudinarySignature = (folderName?: string) => {
  try {
    // Implementation for generating Cloudinary signature
    const timestamp = Math.round(new Date().getTime() / 1000);

    const params = {
      timestamp,
      folder: folderName || 'media',
    };

    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET!,
    );

    const data = {
      timestamp,
      signature,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      folder: folderName || 'media',
    };
    return data;
  } catch (error: Error | any) {
    logger.info(`Error generating Cloudinary signature: ${error.message}`);
    throw error;
  }
};

export const CloudinaryResourceType = {
  IMAGE: 'image',
  VIDEO: 'video',
  RAW: 'raw',
  CSS: 'css',
  JAVASCRIPT: 'javascript',
};

export const deleteAnyFileFromCloudinary = async (
  publicId: string,
  resourceType: (typeof CloudinaryResourceType)[keyof typeof CloudinaryResourceType],
) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return result;
  } catch (error: any) {
    logger.info(`Error deleting ${publicId}: ${error.message}`);
    throw error;
  }
};
