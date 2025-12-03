import { Router } from "express";
import userController from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import userFileUploadMiddleware from "../../middlewares/fileUpload.middleware";

const router = Router();

const USER_PICTURES = "./public/uploads/users";

router.get("/self/in", authMiddleware, userController.userDetails);
router.post(
  "/upload-single",
  authMiddleware,
  userFileUploadMiddleware(USER_PICTURES).single("image"),
  userController.singleFileUpload
);

router.post(
  "/upload-multiple",
  authMiddleware,
  userFileUploadMiddleware(USER_PICTURES).fields([
    { name: "image", maxCount: 2 },
  ]),
  userController.multipleFileUpload
);

export default router;
