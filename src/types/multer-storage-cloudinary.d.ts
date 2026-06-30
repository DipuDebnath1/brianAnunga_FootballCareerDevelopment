/* eslint-disable no-unused-vars, no-undef */
declare module "multer-storage-cloudinary" {
  import type { Request } from "express";
  import type { StorageEngine } from "multer";
  import type { v2 as CloudinaryV2 } from "cloudinary";

  interface CloudinaryStorageParams {
    folder?: string;
    resource_type?: string;
    allowed_formats?: string[];
    public_id?: string;
    [key: string]: unknown;
  }

  interface CloudinaryStorageOptions {
    cloudinary: typeof CloudinaryV2;
    params?:
      | CloudinaryStorageParams
      | ((
          req: Request,
          file: Express.Multer.File
        ) => CloudinaryStorageParams | Promise<CloudinaryStorageParams>);
  }

  export class CloudinaryStorage implements StorageEngine {
    constructor(options: CloudinaryStorageOptions);
    _handleFile(
      req: Request,
      file: Express.Multer.File,
      callback: (error?: Error | null, info?: Partial<Express.Multer.File>) => void
    ): void;
    _removeFile(
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null) => void
    ): void;
  }
}
