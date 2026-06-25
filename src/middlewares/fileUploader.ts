// middlewares/fileUploader.ts
import httpStatus from 'http-status';
import AppError from '../ErrorHandler/AppError';
import config from '../config';
import s3Uploader from './fileUploadS3';
import fileUploadLocally from './fileUploadLocally';

const fileUploader = (folderName = 'others') => {
  if (config.file.UploaderServices === 'AWS') {
    return s3Uploader({ folderName });
  }

  if (config.file.UploaderServices === 'LOCAL') {
    return fileUploadLocally(folderName);
  }

  throw new AppError(
    httpStatus.BAD_GATEWAY,
    `Invalid uploader service: ${config.file.UploaderServices}`,
  );
};

export default fileUploader;
