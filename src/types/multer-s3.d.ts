/* eslint-disable no-unused-vars, no-undef */
declare module "multer-s3" {
  import type { S3Client } from "@aws-sdk/client-s3";
  import type { Request } from "express";
  import type { StorageEngine } from "multer";

  interface MulterS3StorageOptions {
    s3: S3Client;
    bucket: string;
    key: (
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, key?: string) => void
    ) => void;
    contentType?: (
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, mime?: string) => void
    ) => void;
  }

  interface MulterS3 {
    (options: MulterS3StorageOptions): StorageEngine;
    AUTO_CONTENT_TYPE: (
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, mime?: string) => void
    ) => void;
  }

  const multerS3: MulterS3;
  export default multerS3;
}
