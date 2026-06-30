import { Request } from "express";
import httpStatus from "http-status";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import AppError from "../ErrorHandler/AppError";
import config from "../config";
import cloudinary from "../config/cloudinary";

type MulterFile = Parameters<NonNullable<multer.Options["fileFilter"]>>[1];

const cloudinaryUploader = (UPLOADS_FOLDER: string): multer.Multer => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (
      _req: Request,
      file: MulterFile
    ) => ({
      folder: UPLOADS_FOLDER,
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`,
    }),
  });

  const upload = multer({
    storage,
    limits: {
      fileSize: Number(config.file.imageFileSizeLimit) * 1024 * 1024,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fileFilter: (req: Request, file: MulterFile, cb: any) => {
      if (
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/heic" ||
        file.mimetype === "image/heif"
      ) {
        cb(null, true);
      } else {
        cb(
          new AppError(
            httpStatus.BAD_REQUEST,
            "Only jpg, png, jpeg, heic, heif formats are allowed!"
          ),
          false
        );
      }
    },
  });

  return upload;
};

export default cloudinaryUploader;
