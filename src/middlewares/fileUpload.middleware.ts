import multer from "multer";
import path from "path";
const userFileUploadMiddleware = (uploadFolder: string) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadFolder); // Set the destination folder
    },
    filename: (req, file, cb) => {
      const extname = path.extname(file.originalname);
      const filename = Date.now() + "-" + file.fieldname + extname; // Unique file name
      cb(null, filename); // Set the file name
    },
  });

  return multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Max file size: 10MB
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png/;
      const extname = fileTypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      const mimetype = fileTypes.test(file.mimetype);

      if (extname && mimetype) {
        return cb(null, true); // If file is valid, allow it
      } else {
        const error: any = new Error("Only image or heic files are allowed!");
        error.code = "INVALID_FILE_TYPE";
        return cb(error, false);
      }
    },
  });
};

export default userFileUploadMiddleware;
