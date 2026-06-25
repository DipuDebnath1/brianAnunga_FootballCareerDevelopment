import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import logger from '../lib/logger';

export const optimizeImage = async (filePath: string, size?: number) => {
  try {
    const parsed = path.parse(filePath);
    const webpPath = path.join(parsed.dir, parsed.name + '.webp');

    await sharp(filePath)
      .resize({ width: size || 720 })
      .webp({ quality: 80 })
      .toFile(webpPath);

    await fs.unlink(filePath); // delete old file

    return webpPath;
  } catch (error) {
    logger.error(`Error optimizing image:${error}`);
    return null;
  }
};
