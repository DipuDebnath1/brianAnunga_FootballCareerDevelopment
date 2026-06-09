import multer from "multer";
import path from "path";

const userFileUploadMiddleware = (uploadFolder: string) => {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadFolder);
    },
    filename: (_req, file, cb) => {
      const extname = path.extname(file.originalname);
      const filename = `${Date.now()}-${file.fieldname}${extname}`;
      cb(null, filename);
    },
  });

  return multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const fileTypes = /jpeg|jpg|png/;
      const extname = fileTypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      const mimetype = fileTypes.test(file.mimetype);

      if (extname && mimetype) {
        cb(null, true);
      } else {
        cb(new Error("Only image or heic files are allowed!"));
      }
    },
  });
};

export default userFileUploadMiddleware;
