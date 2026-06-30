import httpStatus from "http-status";
import AppError from "../ErrorHandler/AppError";
import config from "../config";
import fileUploadLocally from "./fileUploadLocally";
import s3Uploader from "./fileUploadS3";
import cloudinaryUploader from "./multerCloudinaryStorage";

const fileUploader = (folderName = "others", Service?: "AWS" | "LOCAL" | "CLOUDINARY" ) => {

const uploaderService = Service || config.file.UploaderServices;

  if (uploaderService === "AWS") {
    return s3Uploader({ folderName });
  }

  if (uploaderService === "LOCAL") {
    return fileUploadLocally(folderName);
  }

  if (uploaderService === "CLOUDINARY") {
    return cloudinaryUploader(folderName);
  }

  throw new AppError(
    httpStatus.BAD_GATEWAY,
    `Invalid uploader service: ${config.file.UploaderServices}`
  );
};

export default fileUploader;
