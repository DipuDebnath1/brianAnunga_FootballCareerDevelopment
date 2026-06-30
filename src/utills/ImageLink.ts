/* eslint-disable @typescript-eslint/no-explicit-any */

import path from 'path';
import config from '../config';
function generateImageUrl(destination: string, filename: string): string {
  // Normalize slashes (Windows uses \, Linux uses /)
  const normalizedDest = destination.replace(/\\/g, '/');

  // Remove any leading './' or 'public/' parts
  const folderPath = normalizedDest
    .replace(/^\.?\/*public\/*/, '') // remove ./public/ or public/
    .replace(/^\/+/, ''); // remove leading slashes if any

  // Construct clean relative URL
  const url = path.posix.join(folderPath, filename);

  return url;
}

// Function to add the URL to the file object
export function ImageUrl(fileObj: any, service?: 'AWS' | 'LOCAL' | 'CLOUDINARY'): string {
  if (!fileObj) return '';
  const uploaderService = service || config.file.UploaderServices;

  // Handle AWS S3 case
  if (uploaderService === 'AWS') return fileObj.location || '';

  // Handle Local Storage case
  if (uploaderService === 'LOCAL')
    return generateImageUrl(fileObj.destination, fileObj.filename);

  // Handle Cloudinary case
  if (uploaderService === 'CLOUDINARY') return fileObj.secure_url || '';

  return '';
}
