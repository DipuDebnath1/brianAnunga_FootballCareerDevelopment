/* eslint-disable no-undef */
import { existsSync } from 'fs';
import fs from 'fs/promises';
import logger from '../lib/logger';
// Function to delete a single file
const DeleteFile = async (
  file: Express.Multer.File | { path: string },
  message: string,
) => {
  try {
    //
    if (file && file.path) {
      if (existsSync(file.path)) await fs.unlink(file.path);
    }
  } catch (error) {
    logger.error(`Error deleting file: ${error} - ${message}`);
  }
};

// Function to delete multiple files
const DeleteFiles = async (
  files: Express.Multer.File[] | { path: string }[],
  message: string,
) => {
  try {
    if (files && Array.isArray(files) && files.length > 0) {
      for (const file of files) {
        if (file && file.path) {
          if (existsSync(file.path)) await fs.unlink(file.path);
        }
      }
    }

    logger.info(`Files deleted successfully: ${message}`);
  } catch (error) {
    logger.error(`Error deleting files: ${error} - ${message}`);
  }
};

export { DeleteFile, DeleteFiles };
