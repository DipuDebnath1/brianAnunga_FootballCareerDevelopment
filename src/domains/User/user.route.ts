import { Router } from "express";
import auth from "../../middlewares/auth";
import userFileUploadMiddleware from "../../middlewares/fileUpload.middleware";
import { ROLE } from "../../utills/roles";
import userController from "./user.controller";

const router = Router();

const USER_PICTURES = "./public/uploads/users";

router.get("/self/in", auth(ROLE.common), userController.userDetails);
router.post(
  "/upload-single",
  auth(ROLE.common),
  userFileUploadMiddleware(USER_PICTURES).single("image"),
  userController.singleFileUpload
);

router.post(
  "/upload-multiple",
  auth(ROLE.common),
  userFileUploadMiddleware(USER_PICTURES).fields([
    { name: "image", maxCount: 2 },
  ]),
  userController.multipleFileUpload
);

export default router;
