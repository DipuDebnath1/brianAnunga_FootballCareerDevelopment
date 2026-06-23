import { Router } from "express";
import auth from "../../middlewares/auth";
import userFileUploadMiddleware from "../../middlewares/fileUpload.middleware";
import validationRequest from "../../middlewares/validationRequest";
import { ROLE } from "../../utills/roles";
import { UserController } from "./user.controller";
import UserValidation from "./user.validation";

const router = Router();
const fileUpload = userFileUploadMiddleware("uploads/users");

router.get("/self/in", auth(ROLE.common), UserController.getProfile);

router.patch(
  "/self/update",
  auth(ROLE.common),
  fileUpload.single("image"),
  validationRequest(UserValidation.updateProfileValidation),
  UserController.updateProfile
);

router.post(
  "/upload-single",
  auth(ROLE.common),
  fileUpload.single("image"),
  UserController.singleFileUpload
);

router.post(
  "/upload-multiple",
  auth(ROLE.common),
  fileUpload.fields([{ name: "image", maxCount: 5 }]),
  UserController.multipleFileUpload
);

export default router;
